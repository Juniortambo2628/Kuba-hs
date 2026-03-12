const pool = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');
const { uploadToS3 } = require('../utils/s3');

class UserService {
  /**
   * Get user by ID
   */
  async getUser(userId) {
    const cacheKey = `user:${userId}`;
    
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for user: ${userId}`);
      return JSON.parse(cached);
    }

    // Query database
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, phone, role, 
              email_verified, profile_picture, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const user = this.formatUser(result.rows[0]);

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(user));

    logger.info(`User fetched: ${userId}`);
    return user;
  }

  /**
   * Update user profile
   */
  async updateUser(userId, data) {
    const { firstName, lastName, phone } = data;
    
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (firstName !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(firstName);
    }
    if (lastName !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(lastName);
    }
    if (phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(phone);
    }

    if (fields.length === 0) {
      const error = new Error('No fields to update');
      error.statusCode = 400;
      throw error;
    }

    values.push(userId);

    const result = await pool.query(
      `UPDATE users 
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING id, email, first_name, last_name, phone, role, 
                 email_verified, profile_picture, created_at, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const user = this.formatUser(result.rows[0]);

    // Invalidate cache
    await redis.del(`user:${userId}`);

    logger.info(`User updated: ${userId}`);
    return user;
  }

  /**
   * Delete user account (soft delete)
   */
  async deleteUser(userId) {
    const result = await pool.query(
      `UPDATE users 
       SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id`,
      [userId]
    );

    if (result.rows.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Invalidate cache
    await redis.del(`user:${userId}`);

    logger.info(`User deleted (soft): ${userId}`);
  }

  /**
   * Get user addresses
   */
  async getAddresses(userId) {
    const result = await pool.query(
      `SELECT id, user_id, address_type, street_address, apartment, 
              city, state, postal_code, country, latitude, longitude, 
              is_default, created_at
       FROM addresses 
       WHERE user_id = $1 
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    return result.rows.map(this.formatAddress);
  }

  /**
   * Add new address
   */
  async addAddress(userId, addressData) {
    const {
      addressType,
      streetAddress,
      apartment,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
      isDefault
    } = addressData;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // If setting as default, unset other defaults
      if (isDefault) {
        await client.query(
          'UPDATE addresses SET is_default = false WHERE user_id = $1',
          [userId]
        );
      }

      const result = await client.query(
        `INSERT INTO addresses 
         (user_id, address_type, street_address, apartment, city, state,
          postal_code, country, latitude, longitude, is_default)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [userId, addressType, streetAddress, apartment, city, state,
         postalCode, country, latitude, longitude, isDefault || false]
      );

      await client.query('COMMIT');

      logger.info(`Address added for user: ${userId}`);
      return this.formatAddress(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update address
   */
  async updateAddress(userId, addressId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = {
      addressType: 'address_type',
      streetAddress: 'street_address',
      apartment: 'apartment',
      city: 'city',
      state: 'state',
      postalCode: 'postal_code',
      country: 'country',
      latitude: 'latitude',
      longitude: 'longitude',
      isDefault: 'is_default'
    };

    for (const [key, dbField] of Object.entries(allowedFields)) {
      if (data[key] !== undefined) {
        fields.push(`${dbField} = $${paramCount++}`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) {
      const error = new Error('No fields to update');
      error.statusCode = 400;
      throw error;
    }

    values.push(userId, addressId);

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // If setting as default, unset other defaults
      if (data.isDefault) {
        await client.query(
          'UPDATE addresses SET is_default = false WHERE user_id = $1',
          [userId]
        );
      }

      const result = await client.query(
        `UPDATE addresses 
         SET ${fields.join(', ')}
         WHERE user_id = $${paramCount - 1} AND id = $${paramCount}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        const error = new Error('Address not found');
        error.statusCode = 404;
        throw error;
      }

      await client.query('COMMIT');

      return this.formatAddress(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete address
   */
  async deleteAddress(userId, addressId) {
    const result = await pool.query(
      'DELETE FROM addresses WHERE user_id = $1 AND id = $2 RETURNING id',
      [userId, addressId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Address not found');
      error.statusCode = 404;
      throw error;
    }

    logger.info(`Address deleted: ${addressId}`);
  }

  /**
   * Set default address
   */
  async setDefaultAddress(userId, addressId) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Unset all defaults
      await client.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [userId]
      );

      // Set new default
      const result = await client.query(
        `UPDATE addresses SET is_default = true 
         WHERE user_id = $1 AND id = $2
         RETURNING *`,
        [userId, addressId]
      );

      if (result.rows.length === 0) {
        const error = new Error('Address not found');
        error.statusCode = 404;
        throw error;
      }

      await client.query('COMMIT');

      return this.formatAddress(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get user favorites
   */
  async getFavorites(userId) {
    const result = await pool.query(
      `SELECT f.provider_id, f.created_at,
              p.business_name, p.average_rating, p.profile_image
       FROM user_favorites f
       LEFT JOIN providers p ON f.provider_id = p.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    return result.rows.map(row => ({
      providerId: row.provider_id,
      businessName: row.business_name,
      averageRating: row.average_rating ? parseFloat(row.average_rating) : null,
      profileImage: row.profile_image,
      addedAt: row.created_at
    }));
  }

  /**
   * Add to favorites
   */
  async addFavorite(userId, providerId) {
    try {
      await pool.query(
        `INSERT INTO user_favorites (user_id, provider_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, provider_id) DO NOTHING`,
        [userId, providerId]
      );

      logger.info(`Favorite added: user=${userId}, provider=${providerId}`);
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation
        const err = new Error('Provider not found');
        err.statusCode = 404;
        throw err;
      }
      throw error;
    }
  }

  /**
   * Remove from favorites
   */
  async removeFavorite(userId, providerId) {
    const result = await pool.query(
      'DELETE FROM user_favorites WHERE user_id = $1 AND provider_id = $2 RETURNING id',
      [userId, providerId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Favorite not found');
      error.statusCode = 404;
      throw error;
    }

    logger.info(`Favorite removed: user=${userId}, provider=${providerId}`);
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(userId, file) {
    // Upload to S3
    const url = await uploadToS3(file.buffer, 'profiles', file.originalname, file.mimetype);

    // Update user record
    await pool.query(
      'UPDATE users SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [url, userId]
    );

    // Invalidate cache
    await redis.del(`user:${userId}`);

    logger.info(`Profile picture uploaded: ${userId}`);
    return url;
  }

  /**
   * Format user object
   */
  formatUser(row) {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      role: row.role,
      emailVerified: row.email_verified,
      profilePicture: row.profile_picture,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Format address object
   */
  formatAddress(row) {
    return {
      id: row.id,
      userId: row.user_id,
      addressType: row.address_type,
      streetAddress: row.street_address,
      apartment: row.apartment,
      city: row.city,
      state: row.state,
      postalCode: row.postal_code,
      country: row.country,
      latitude: row.latitude ? parseFloat(row.latitude) : null,
      longitude: row.longitude ? parseFloat(row.longitude) : null,
      isDefault: row.is_default,
      createdAt: row.created_at
    };
  }
}

module.exports = new UserService();
