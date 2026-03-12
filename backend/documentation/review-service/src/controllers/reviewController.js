const reviewService = require('../services/reviewService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class ReviewController {
  /**
   * Create review
   */
  async createReview(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const customerId = req.user.userId;
      const review = await reviewService.createReview({
        ...req.body,
        customerId
      });

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get review by ID
   */
  async getReview(req, res, next) {
    try {
      const { reviewId } = req.params;
      const review = await reviewService.getReview(reviewId);

      res.json({
        success: true,
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get provider reviews
   */
  async getProviderReviews(req, res, next) {
    try {
      const { providerId } = req.params;
      const {
        minRating,
        maxRating,
        page,
        limit,
        sortBy,
        sortOrder
      } = req.query;

      const result = await reviewService.getProviderReviews(providerId, {
        minRating: minRating ? parseInt(minRating) : undefined,
        maxRating: maxRating ? parseInt(maxRating) : undefined,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        data: result.data,
        metadata: result.metadata
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get customer reviews
   */
  async getCustomerReviews(req, res, next) {
    try {
      const customerId = req.user.userId;
      const { page, limit } = req.query;

      const result = await reviewService.getCustomerReviews(
        customerId,
        page ? parseInt(page) : 1,
        limit ? parseInt(limit) : 20
      );

      res.json({
        success: true,
        data: result.data,
        metadata: result.metadata
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update review
   */
  async updateReview(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { reviewId } = req.params;
      const customerId = req.user.userId;

      const review = await reviewService.updateReview(reviewId, customerId, req.body);

      res.json({
        success: true,
        message: 'Review updated successfully',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete review
   */
  async deleteReview(req, res, next) {
    try {
      const { reviewId } = req.params;

      await reviewService.deleteReview(
        reviewId,
        req.user.userId,
        req.user.role
      );

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add provider response
   */
  async addProviderResponse(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { reviewId } = req.params;
      const { response } = req.body;

      // Get provider ID for this user
      const providerId = await this.getProviderIdForUser(req.user.userId);
      if (!providerId) {
        return res.status(403).json({
          success: false,
          message: 'Only providers can respond to reviews'
        });
      }

      const review = await reviewService.addProviderResponse(reviewId, providerId, response);

      res.json({
        success: true,
        message: 'Response added successfully',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update provider response
   */
  async updateProviderResponse(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { reviewId } = req.params;
      const { response } = req.body;

      const providerId = await this.getProviderIdForUser(req.user.userId);
      if (!providerId) {
        return res.status(403).json({
          success: false,
          message: 'Only providers can update responses'
        });
      }

      const review = await reviewService.updateProviderResponse(reviewId, providerId, response);

      res.json({
        success: true,
        message: 'Response updated successfully',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get provider statistics
   */
  async getProviderStatistics(req, res, next) {
    try {
      const { providerId } = req.params;
      const stats = await reviewService.getProviderStatistics(providerId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Flag review
   */
  async flagReview(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { reviewId } = req.params;
      const { reason } = req.body;
      const userId = req.user.userId;

      await reviewService.flagReview(reviewId, userId, reason);

      res.json({
        success: true,
        message: 'Review flagged for moderation'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Helper: Get provider ID for user
   */
  async getProviderIdForUser(userId) {
    const pool = require('../config/database');
    const result = await pool.query(
      'SELECT id FROM providers WHERE user_id = $1',
      [userId]
    );
    return result.rows.length > 0 ? result.rows[0].id : null;
  }
}

module.exports = new ReviewController();
