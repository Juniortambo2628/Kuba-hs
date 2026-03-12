const pool = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');
const axios = require('axios');

class ReviewService {
  /**
   * Create a review
   */
  async createReview(reviewData) {
    const {
      bookingId,
      customerId,
      providerId,
      rating,
      comment,
      serviceQuality,
      communication,
      timeliness,
      professionalism
    } = reviewData;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Verify booking exists and is completed
      const bookingResult = await client.query(
        `SELECT * FROM bookings 
         WHERE id = $1 AND customer_id = $2 AND provider_id = $3`,
        [bookingId, customerId, providerId]
      );

      if (bookingResult.rows.length === 0) {
        const error = new Error('Booking not found');
        error.statusCode = 404;
        throw error;
      }

      const booking = bookingResult.rows[0];

      if (booking.status !== 'completed') {
        const error = new Error('Can only review completed bookings');
        error.statusCode = 400;
        throw error;
      }

      // Check if review already exists
      const existingReview = await client.query(
        'SELECT id FROM reviews WHERE booking_id = $1',
        [bookingId]
      );

      if (existingReview.rows.length > 0) {
        const error = new Error('Booking already reviewed');
        error.statusCode = 409;
        throw error;
      }

      // Create review
      const result = await client.query(
        `INSERT INTO reviews 
         (booking_id, customer_id, provider_id, rating, comment,
          service_quality, communication, timeliness, professionalism)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [bookingId, customerId, providerId, rating, comment,
         serviceQuality, communication, timeliness, professionalism]
      );

      // Update provider's average rating
      await this.updateProviderRating(providerId, client);

      await client.query('COMMIT');

      // Invalidate cache
      await redis.del(`provider:${providerId}`);
      await redis.del(`provider:${providerId}:reviews`);

      // Notify provider
      this.notifyProvider(providerId, result.rows[0].id, 'new_review')
        .catch(err => logger.error('Notification error:', err));

      logger.info(`Review created: ${result.rows[0].id}`);
      return this.formatReview(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get review by ID
   */
  async getReview(reviewId) {
    const result = await pool.query(
      `SELECT r.*,
              u.first_name as customer_first_name, u.last_name as customer_last_name,
              p.business_name as provider_business_name,
              b.booking_number
       FROM reviews r
       LEFT JOIN users u ON r.customer_id = u.id
       LEFT JOIN providers p ON r.provider_id = p.id
       LEFT JOIN bookings b ON r.booking_id = b.id
       WHERE r.id = $1`,
      [reviewId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      throw error;
    }

    return this.formatDetailedReview(result.rows[0]);
  }

  /**
   * Get reviews for provider
   */
  async getProviderReviews(providerId, filters = {}) {
    const {
      minRating,
      maxRating,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = filters;

    const cacheKey = `provider:${providerId}:reviews:${page}:${limit}:${minRating}:${maxRating}`;
    
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    let query = `
      SELECT r.*,
             u.first_name as customer_first_name, u.last_name as customer_last_name,
             b.booking_number
      FROM reviews r
      LEFT JOIN users u ON r.customer_id = u.id
      LEFT JOIN bookings b ON r.booking_id = b.id
      WHERE r.provider_id = $1
    `;

    const params = [providerId];
    let paramCount = 2;

    if (minRating) {
      query += ` AND r.rating >= $${paramCount++}`;
      params.push(minRating);
    }

    if (maxRating) {
      query += ` AND r.rating <= $${paramCount++}`;
      params.push(maxRating);
    }

    // Validate sort column
    const allowedSortColumns = ['created_at', 'rating'];
    const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY r.${sortColumn} ${order} LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, (page - 1) * limit);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM reviews WHERE provider_id = $1';
    const countParams = [providerId];
    let countParamIdx = 2;

    if (minRating) {
      countQuery += ` AND rating >= $${countParamIdx++}`;
      countParams.push(minRating);
    }
    if (maxRating) {
      countQuery += ` AND rating <= $${countParamIdx++}`;
      countParams.push(maxRating);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    const response = {
      data: result.rows.map(this.formatDetailedReview),
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(response));

    return response;
  }

  /**
   * Get reviews by customer
   */
  async getCustomerReviews(customerId, page = 1, limit = 20) {
    const result = await pool.query(
      `SELECT r.*,
              p.business_name as provider_business_name,
              b.booking_number
       FROM reviews r
       LEFT JOIN providers p ON r.provider_id = p.id
       LEFT JOIN bookings b ON r.booking_id = b.id
       WHERE r.customer_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [customerId, limit, (page - 1) * limit]
    );

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM reviews WHERE customer_id = $1',
      [customerId]
    );
    const total = parseInt(countResult.rows[0].count);

    return {
      data: result.rows.map(this.formatDetailedReview),
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update review
   */
  async updateReview(reviewId, customerId, updateData) {
    const { rating, comment, serviceQuality, communication, timeliness, professionalism } = updateData;

    // Get existing review
    const existing = await this.getReview(reviewId);

    // Verify ownership
    if (existing.customerId !== customerId) {
      const error = new Error('Not authorized to update this review');
      error.statusCode = 403;
      throw error;
    }

    // Check if review can be updated (within 30 days)
    const daysSinceCreation = (Date.now() - new Date(existing.createdAt)) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > 30) {
      const error = new Error('Reviews can only be edited within 30 days');
      error.statusCode = 400;
      throw error;
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const fields = [];
      const values = [];
      let paramCount = 1;

      if (rating !== undefined) {
        fields.push(`rating = $${paramCount++}`);
        values.push(rating);
      }
      if (comment !== undefined) {
        fields.push(`comment = $${paramCount++}`);
        values.push(comment);
      }
      if (serviceQuality !== undefined) {
        fields.push(`service_quality = $${paramCount++}`);
        values.push(serviceQuality);
      }
      if (communication !== undefined) {
        fields.push(`communication = $${paramCount++}`);
        values.push(communication);
      }
      if (timeliness !== undefined) {
        fields.push(`timeliness = $${paramCount++}`);
        values.push(timeliness);
      }
      if (professionalism !== undefined) {
        fields.push(`professionalism = $${paramCount++}`);
        values.push(professionalism);
      }

      if (fields.length === 0) {
        const error = new Error('No fields to update');
        error.statusCode = 400;
        throw error;
      }

      values.push(reviewId);

      const result = await client.query(
        `UPDATE reviews 
         SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      // Update provider's average rating if rating changed
      if (rating !== undefined) {
        await this.updateProviderRating(existing.providerId, client);
      }

      await client.query('COMMIT');

      // Invalidate cache
      await redis.del(`provider:${existing.providerId}:reviews`);

      logger.info(`Review updated: ${reviewId}`);
      return this.formatReview(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete review (soft delete)
   */
  async deleteReview(reviewId, userId, userRole) {
    const review = await this.getReview(reviewId);

    // Only customer who wrote it or admin can delete
    if (review.customerId !== userId && userRole !== 'admin') {
      const error = new Error('Not authorized to delete this review');
      error.statusCode = 403;
      throw error;
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      await client.query(
        'UPDATE reviews SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
        [reviewId]
      );

      // Update provider's average rating
      await this.updateProviderRating(review.providerId, client);

      await client.query('COMMIT');

      // Invalidate cache
      await redis.del(`provider:${review.providerId}:reviews`);

      logger.info(`Review deleted: ${reviewId}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Add provider response to review
   */
  async addProviderResponse(reviewId, providerId, response) {
    const review = await this.getReview(reviewId);

    // Verify provider owns this review
    if (review.providerId !== providerId) {
      const error = new Error('Not authorized to respond to this review');
      error.statusCode = 403;
      throw error;
    }

    if (review.providerResponse) {
      const error = new Error('Response already exists. Use update instead.');
      error.statusCode = 409;
      throw error;
    }

    const result = await pool.query(
      `UPDATE reviews 
       SET provider_response = $1, 
           response_date = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [response, reviewId]
    );

    // Invalidate cache
    await redis.del(`provider:${providerId}:reviews`);

    // Notify customer
    this.notifyCustomer(review.customerId, reviewId, 'provider_responded')
      .catch(err => logger.error('Notification error:', err));

    logger.info(`Provider response added: ${reviewId}`);
    return this.formatReview(result.rows[0]);
  }

  /**
   * Update provider response
   */
  async updateProviderResponse(reviewId, providerId, response) {
    const review = await this.getReview(reviewId);

    // Verify provider owns this review
    if (review.providerId !== providerId) {
      const error = new Error('Not authorized to update this response');
      error.statusCode = 403;
      throw error;
    }

    if (!review.providerResponse) {
      const error = new Error('No response exists. Use add instead.');
      error.statusCode = 404;
      throw error;
    }

    const result = await pool.query(
      `UPDATE reviews 
       SET provider_response = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [response, reviewId]
    );

    // Invalidate cache
    await redis.del(`provider:${providerId}:reviews`);

    logger.info(`Provider response updated: ${reviewId}`);
    return this.formatReview(result.rows[0]);
  }

  /**
   * Get provider rating statistics
   */
  async getProviderStatistics(providerId) {
    const cacheKey = `provider:${providerId}:stats`;
    
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_reviews,
         AVG(rating) as average_rating,
         AVG(service_quality) as avg_service_quality,
         AVG(communication) as avg_communication,
         AVG(timeliness) as avg_timeliness,
         AVG(professionalism) as avg_professionalism,
         COUNT(*) FILTER (WHERE rating = 5) as five_star,
         COUNT(*) FILTER (WHERE rating = 4) as four_star,
         COUNT(*) FILTER (WHERE rating = 3) as three_star,
         COUNT(*) FILTER (WHERE rating = 2) as two_star,
         COUNT(*) FILTER (WHERE rating = 1) as one_star,
         COUNT(*) FILTER (WHERE provider_response IS NOT NULL) as responded_count
       FROM reviews
       WHERE provider_id = $1 AND deleted_at IS NULL`,
      [providerId]
    );

    const row = result.rows[0];
    const totalReviews = parseInt(row.total_reviews) || 0;

    const stats = {
      totalReviews,
      averageRating: row.average_rating ? parseFloat(row.average_rating).toFixed(2) : 0,
      avgServiceQuality: row.avg_service_quality ? parseFloat(row.avg_service_quality).toFixed(2) : null,
      avgCommunication: row.avg_communication ? parseFloat(row.avg_communication).toFixed(2) : null,
      avgTimeliness: row.avg_timeliness ? parseFloat(row.avg_timeliness).toFixed(2) : null,
      avgProfessionalism: row.avg_professionalism ? parseFloat(row.avg_professionalism).toFixed(2) : null,
      ratingDistribution: {
        5: parseInt(row.five_star) || 0,
        4: parseInt(row.four_star) || 0,
        3: parseInt(row.three_star) || 0,
        2: parseInt(row.two_star) || 0,
        1: parseInt(row.one_star) || 0
      },
      responseRate: totalReviews > 0 
        ? ((parseInt(row.responded_count) / totalReviews) * 100).toFixed(1) 
        : 0
    };

    // Cache for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(stats));

    return stats;
  }

  /**
   * Flag review for moderation
   */
  async flagReview(reviewId, userId, reason) {
    const result = await pool.query(
      `INSERT INTO review_flags (review_id, flagged_by, reason)
       VALUES ($1, $2, $3)
       ON CONFLICT (review_id, flagged_by) 
       DO UPDATE SET reason = EXCLUDED.reason, created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [reviewId, userId, reason]
    );

    logger.info(`Review flagged: ${reviewId} by ${userId}`);
    return result.rows[0];
  }

  /**
   * Update provider average rating
   */
  async updateProviderRating(providerId, client = null) {
    const conn = client || await pool.connect();

    try {
      const result = await conn.query(
        `SELECT 
           AVG(rating) as avg_rating,
           COUNT(*) as review_count
         FROM reviews
         WHERE provider_id = $1 AND deleted_at IS NULL`,
        [providerId]
      );

      const avgRating = result.rows[0].avg_rating 
        ? parseFloat(result.rows[0].avg_rating) 
        : 0;
      const reviewCount = parseInt(result.rows[0].review_count) || 0;

      await conn.query(
        `UPDATE providers 
         SET average_rating = $1, total_reviews = $2
         WHERE id = $3`,
        [avgRating, reviewCount, providerId]
      );

      // Invalidate provider cache
      await redis.del(`provider:${providerId}`);
      await redis.del(`provider:${providerId}:stats`);

      logger.info(`Provider rating updated: ${providerId} - ${avgRating}`);
    } finally {
      if (!client) {
        conn.release();
      }
    }
  }

  /**
   * Helper: Send notification
   */
  async notifyProvider(providerId, reviewId, type) {
    if (!process.env.NOTIFICATION_SERVICE_URL) return;

    try {
      await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/send`,
        {
          recipientId: providerId,
          type,
          data: { reviewId }
        }
      );
    } catch (error) {
      logger.error('Failed to send notification:', error);
    }
  }

  /**
   * Helper: Send notification to customer
   */
  async notifyCustomer(customerId, reviewId, type) {
    if (!process.env.NOTIFICATION_SERVICE_URL) return;

    try {
      await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/send`,
        {
          recipientId: customerId,
          type,
          data: { reviewId }
        }
      );
    } catch (error) {
      logger.error('Failed to send notification:', error);
    }
  }

  /**
   * Format review object
   */
  formatReview(row) {
    return {
      id: row.id,
      bookingId: row.booking_id,
      customerId: row.customer_id,
      providerId: row.provider_id,
      rating: parseInt(row.rating),
      comment: row.comment,
      serviceQuality: row.service_quality ? parseInt(row.service_quality) : null,
      communication: row.communication ? parseInt(row.communication) : null,
      timeliness: row.timeliness ? parseInt(row.timeliness) : null,
      professionalism: row.professionalism ? parseInt(row.professionalism) : null,
      providerResponse: row.provider_response,
      responseDate: row.response_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at
    };
  }

  /**
   * Format detailed review object (with joins)
   */
  formatDetailedReview(row) {
    return {
      ...this.formatReview(row),
      customerName: row.customer_first_name && row.customer_last_name
        ? `${row.customer_first_name} ${row.customer_last_name}`
        : null,
      providerName: row.provider_business_name,
      bookingNumber: row.booking_number
    };
  }
}

module.exports = new ReviewService();
