const pool = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');
const { uploadToS3 } = require('../utils/s3');

class ProviderService {
  /**
   * Register a new provider
   */
  async registerProvider(userId, providerData) {
    const {
      businessName,
      description,
      serviceRadius,
      city,
      state,
      latitude,
      longitude,
      documents
    } = providerData;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check if user already has a provider profile
      const existing = await client.query(
        'SELECT id FROM providers WHERE user_id = $1',
        [userId]
      );

      if (existing.rows.length > 0) {
        const error = new Error('Provider profile already exists');
        error.statusCode = 409;
        throw error;
      }

      // Create provider profile
      const result = await client.query(
        `INSERT INTO providers 
         (user_id, business_name, description, service_radius, city, state,
          latitude, longitude, verification_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
         RETURNING *`,
        [userId, businessName, description, serviceRadius || 10, city, state,
         latitude, longitude]
      );

      const providerId = result.rows[0].id;

      // Store verification documents if provided
      if (documents && documents.length > 0) {
        for (const doc of documents) {
          await client.query(
            `INSERT INTO provider_documents 
             (provider_id, document_type, document_url, status)
             VALUES ($1, $2, $3, 'pending')`,
            [providerId, doc.type, doc.url]
          );
        }
      }

      await client.query('COMMIT');

      logger.info(`Provider registered: ${providerId}`);
      return this.formatProvider(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get provider by ID
   */
  async getProvider(providerId) {
    const cacheKey = `provider:${providerId}`;
    
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for provider: ${providerId}`);
      return JSON.parse(cached);
    }

    // Query database with services
    const result = await pool.query(
      `SELECT p.*, u.email, u.first_name, u.last_name, u.phone,
              COUNT(DISTINCT b.id) as total_jobs_completed,
              AVG(r.rating) as average_rating,
              COUNT(DISTINCT r.id) as total_reviews
       FROM providers p
       LEFT JOIN users u ON p.user_id = u.id
       LEFT JOIN bookings b ON p.id = b.provider_id AND b.status = 'completed'
       LEFT JOIN reviews r ON p.id = r.provider_id
       WHERE p.id = $1
       GROUP BY p.id, u.email, u.first_name, u.last_name, u.phone`,
      [providerId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Provider not found');
      error.statusCode = 404;
      throw error;
    }

    const provider = this.formatProvider(result.rows[0]);

    // Get provider services
    provider.services = await this.getProviderServices(providerId);

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(provider));

    return provider;
  }

  /**
   * Update provider profile
   */
  async updateProvider(providerId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = {
      businessName: 'business_name',
      description: 'description',
      serviceRadius: 'service_radius',
      city: 'city',
      state: 'state',
      latitude: 'latitude',
      longitude: 'longitude',
      profileImage: 'profile_image'
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

    values.push(providerId);

    const result = await pool.query(
      `UPDATE providers 
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      const error = new Error('Provider not found');
      error.statusCode = 404;
      throw error;
    }

    // Invalidate cache
    await redis.del(`provider:${providerId}`);

    logger.info(`Provider updated: ${providerId}`);
    return this.formatProvider(result.rows[0]);
  }

  /**
   * Get provider services
   */
  async getProviderServices(providerId) {
    const result = await pool.query(
      `SELECT ps.*, s.name as service_name, s.category
       FROM provider_services ps
       JOIN services s ON ps.service_id = s.id
       WHERE ps.provider_id = $1 AND ps.is_active = true
       ORDER BY s.category, s.name`,
      [providerId]
    );

    return result.rows.map(row => ({
      id: row.id,
      serviceId: row.service_id,
      serviceName: row.service_name,
      category: row.category,
      basePrice: row.base_price ? parseFloat(row.base_price) : null,
      pricingType: row.pricing_type,
      description: row.description,
      isActive: row.is_active
    }));
  }

  /**
   * Add service offering
   */
  async addService(providerId, serviceData) {
    const { serviceId, basePrice, pricingType, description } = serviceData;

    try {
      const result = await pool.query(
        `INSERT INTO provider_services 
         (provider_id, service_id, base_price, pricing_type, description, is_active)
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT (provider_id, service_id) 
         DO UPDATE SET 
           base_price = EXCLUDED.base_price,
           pricing_type = EXCLUDED.pricing_type,
           description = EXCLUDED.description,
           is_active = true
         RETURNING *`,
        [providerId, serviceId, basePrice, pricingType, description]
      );

      // Invalidate cache
      await redis.del(`provider:${providerId}`);

      logger.info(`Service added: provider=${providerId}, service=${serviceId}`);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23503') {
        const err = new Error('Service not found');
        err.statusCode = 404;
        throw err;
      }
      throw error;
    }
  }

  /**
   * Update service offering
   */
  async updateService(providerId, serviceId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.basePrice !== undefined) {
      fields.push(`base_price = $${paramCount++}`);
      values.push(data.basePrice);
    }
    if (data.pricingType !== undefined) {
      fields.push(`pricing_type = $${paramCount++}`);
      values.push(data.pricingType);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(data.isActive);
    }

    if (fields.length === 0) {
      const error = new Error('No fields to update');
      error.statusCode = 400;
      throw error;
    }

    values.push(providerId, serviceId);

    const result = await pool.query(
      `UPDATE provider_services 
       SET ${fields.join(', ')}
       WHERE provider_id = $${paramCount++} AND service_id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      const error = new Error('Service offering not found');
      error.statusCode = 404;
      throw error;
    }

    // Invalidate cache
    await redis.del(`provider:${providerId}`);

    return result.rows[0];
  }

  /**
   * Remove service offering
   */
  async removeService(providerId, serviceId) {
    const result = await pool.query(
      `UPDATE provider_services 
       SET is_active = false
       WHERE provider_id = $1 AND service_id = $2
       RETURNING id`,
      [providerId, serviceId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Service offering not found');
      error.statusCode = 404;
      throw error;
    }

    // Invalidate cache
    await redis.del(`provider:${providerId}`);

    logger.info(`Service removed: provider=${providerId}, service=${serviceId}`);
  }

  /**
   * Get provider availability schedule
   */
  async getAvailability(providerId) {
    const result = await pool.query(
      `SELECT * FROM provider_availability 
       WHERE provider_id = $1 
       ORDER BY day_of_week`,
      [providerId]
    );

    return result.rows.map(row => ({
      dayOfWeek: row.day_of_week,
      startTime: row.start_time,
      endTime: row.end_time,
      isAvailable: row.is_available
    }));
  }

  /**
   * Update provider availability
   */
  async updateAvailability(providerId, schedule) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Delete existing schedule
      await client.query(
        'DELETE FROM provider_availability WHERE provider_id = $1',
        [providerId]
      );

      // Insert new schedule
      for (const slot of schedule) {
        await client.query(
          `INSERT INTO provider_availability 
           (provider_id, day_of_week, start_time, end_time, is_available)
           VALUES ($1, $2, $3, $4, $5)`,
          [providerId, slot.dayOfWeek, slot.startTime, slot.endTime, slot.isAvailable]
        );
      }

      await client.query('COMMIT');

      logger.info(`Availability updated: provider=${providerId}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get provider documents
   */
  async getDocuments(providerId) {
    const result = await pool.query(
      `SELECT id, document_type, document_url, status, 
              rejection_reason, uploaded_at, verified_at
       FROM provider_documents
       WHERE provider_id = $1
       ORDER BY uploaded_at DESC`,
      [providerId]
    );

    return result.rows.map(row => ({
      id: row.id,
      documentType: row.document_type,
      documentUrl: row.document_url,
      status: row.status,
      rejectionReason: row.rejection_reason,
      uploadedAt: row.uploaded_at,
      verifiedAt: row.verified_at
    }));
  }

  /**
   * Upload provider document
   */
  async uploadDocument(providerId, file, documentType) {
    // Upload to S3
    const url = await uploadToS3(
      file.buffer, 
      `providers/${providerId}/documents`, 
      file.originalname, 
      file.mimetype
    );

    // Store in database
    const result = await pool.query(
      `INSERT INTO provider_documents 
       (provider_id, document_type, document_url, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [providerId, documentType, url]
    );

    logger.info(`Document uploaded: provider=${providerId}, type=${documentType}`);
    return {
      id: result.rows[0].id,
      documentType: result.rows[0].document_type,
      documentUrl: result.rows[0].document_url,
      status: result.rows[0].status,
      uploadedAt: result.rows[0].uploaded_at
    };
  }

  /**
   * Verify provider (admin only)
   */
  async verifyProvider(providerId, status, notes) {
    const result = await pool.query(
      `UPDATE providers 
       SET verification_status = $1, 
           verification_notes = $2,
           verified_at = CASE WHEN $1 = 'verified' THEN CURRENT_TIMESTAMP ELSE NULL END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, notes, providerId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Provider not found');
      error.statusCode = 404;
      throw error;
    }

    // Invalidate cache
    await redis.del(`provider:${providerId}`);

    logger.info(`Provider verification updated: ${providerId} -> ${status}`);
    return this.formatProvider(result.rows[0]);
  }

  /**
   * Get provider earnings
   */
  async getEarnings(providerId, startDate, endDate) {
    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_jobs,
         SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) as completed_jobs,
         SUM(CASE WHEN b.status = 'completed' THEN b.final_price ELSE 0 END) as total_revenue,
         SUM(CASE WHEN p.status = 'completed' THEN p.provider_amount ELSE 0 END) as total_earnings,
         SUM(CASE WHEN p.status = 'completed' THEN p.platform_fee ELSE 0 END) as total_fees,
         AVG(CASE WHEN b.status = 'completed' THEN r.rating ELSE NULL END) as avg_rating
       FROM bookings b
       LEFT JOIN payments p ON b.id = p.booking_id
       LEFT JOIN reviews r ON b.id = r.booking_id
       WHERE b.provider_id = $1
         AND b.created_at >= $2
         AND b.created_at <= $3`,
      [providerId, startDate, endDate]
    );

    return {
      totalJobs: parseInt(result.rows[0].total_jobs) || 0,
      completedJobs: parseInt(result.rows[0].completed_jobs) || 0,
      totalRevenue: parseFloat(result.rows[0].total_revenue) || 0,
      totalEarnings: parseFloat(result.rows[0].total_earnings) || 0,
      totalFees: parseFloat(result.rows[0].total_fees) || 0,
      averageRating: result.rows[0].avg_rating ? parseFloat(result.rows[0].avg_rating) : null,
      period: {
        startDate,
        endDate
      }
    };
  }

  /**
   * Search providers
   */
  async searchProviders(filters) {
    const {
      service,
      city,
      state,
      latitude,
      longitude,
      radius = 25,
      minRating,
      page = 1,
      limit = 20
    } = filters;

    let query = `
      SELECT DISTINCT p.*, 
             AVG(r.rating) as average_rating,
             COUNT(DISTINCT r.id) as review_count,
             COUNT(DISTINCT b.id) as job_count
    `;

    // Add distance calculation if coordinates provided
    if (latitude && longitude) {
      query += `,
        earth_distance(
          ll_to_earth(p.latitude, p.longitude),
          ll_to_earth($1, $2)
        ) / 1000 as distance
      `;
    }

    query += `
      FROM providers p
      LEFT JOIN reviews r ON p.id = r.provider_id
      LEFT JOIN bookings b ON p.id = b.provider_id AND b.status = 'completed'
    `;

    const params = [];
    let paramCount = 1;
    const conditions = ['p.verification_status = \'verified\''];

    if (latitude && longitude) {
      params.push(latitude, longitude);
      paramCount += 2;
    }

    if (service) {
      query += `
        JOIN provider_services ps ON p.id = ps.provider_id
        JOIN services s ON ps.service_id = s.id
      `;
      conditions.push(`ps.service_id = $${paramCount++}`);
      conditions.push('ps.is_active = true');
      params.push(service);
    }

    if (city) {
      conditions.push(`LOWER(p.city) = LOWER($${paramCount++})`);
      params.push(city);
    }

    if (state) {
      conditions.push(`LOWER(p.state) = LOWER($${paramCount++})`);
      params.push(state);
    }

    if (latitude && longitude && radius) {
      conditions.push(`earth_distance(
        ll_to_earth(p.latitude, p.longitude),
        ll_to_earth($1, $2)
      ) <= $${paramCount++} * 1000`);
      params.push(radius);
    }

    query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` GROUP BY p.id`;

    if (minRating) {
      query += ` HAVING AVG(r.rating) >= $${paramCount++}`;
      params.push(minRating);
    }

    // Order by distance if coordinates provided, otherwise by rating
    query += latitude && longitude
      ? ' ORDER BY distance, average_rating DESC'
      : ' ORDER BY average_rating DESC, job_count DESC';

    query += ` LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, (page - 1) * limit);

    const result = await pool.query(query, params);

    return result.rows.map(row => ({
      ...this.formatProvider(row),
      averageRating: row.average_rating ? parseFloat(row.average_rating) : null,
      reviewCount: parseInt(row.review_count) || 0,
      jobCount: parseInt(row.job_count) || 0,
      distance: row.distance ? parseFloat(row.distance) : null
    }));
  }

  /**
   * Format provider object
   */
  formatProvider(row) {
    return {
      id: row.id,
      userId: row.user_id,
      businessName: row.business_name,
      description: row.description,
      serviceRadius: row.service_radius,
      city: row.city,
      state: row.state,
      latitude: row.latitude ? parseFloat(row.latitude) : null,
      longitude: row.longitude ? parseFloat(row.longitude) : null,
      verificationStatus: row.verification_status,
      verificationNotes: row.verification_notes,
      averageRating: row.average_rating ? parseFloat(row.average_rating) : 0,
      totalReviews: row.total_reviews ? parseInt(row.total_reviews) : 0,
      totalJobsCompleted: row.total_jobs_completed ? parseInt(row.total_jobs_completed) : 0,
      profileImage: row.profile_image,
      verifiedAt: row.verified_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      // User info if joined
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone
    };
  }
}

module.exports = new ProviderService();
