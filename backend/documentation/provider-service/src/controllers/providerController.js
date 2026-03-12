const providerService = require('../services/providerService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class ProviderController {
  /**
   * Register new provider
   */
  async registerProvider(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const userId = req.user.userId;
      const provider = await providerService.registerProvider(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Provider registration submitted for verification',
        data: provider
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get provider by ID
   */
  async getProvider(req, res, next) {
    try {
      const { providerId } = req.params;
      const provider = await providerService.getProvider(providerId);

      res.json({
        success: true,
        data: provider
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update provider profile
   */
  async updateProvider(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { providerId } = req.params;

      // Verify ownership
      const existing = await providerService.getProvider(providerId);
      if (existing.userId !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const provider = await providerService.updateProvider(providerId, req.body);

      res.json({
        success: true,
        message: 'Provider profile updated successfully',
        data: provider
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get provider services
   */
  async getServices(req, res, next) {
    try {
      const { providerId } = req.params;
      const services = await providerService.getProviderServices(providerId);

      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add service offering
   */
  async addService(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { providerId } = req.params;

      // Verify ownership
      const provider = await providerService.getProvider(providerId);
      if (provider.userId !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const service = await providerService.addService(providerId, req.body);

      res.status(201).json({
        success: true,
        message: 'Service added successfully',
        data: service
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update service offering
   */
  async updateService(req, res, next) {
    try {
      const { providerId, serviceId } = req.params;

      // Verify ownership
      const provider = await providerService.getProvider(providerId);
      if (provider.userId !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const service = await providerService.updateService(providerId, serviceId, req.body);

      res.json({
        success: true,
        message: 'Service updated successfully',
        data: service
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove service offering
   */
  async removeService(req, res, next) {
    try {
      const { providerId, serviceId } = req.params;

      // Verify ownership
      const provider = await providerService.getProvider(providerId);
      if (provider.userId !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      await providerService.removeService(providerId, serviceId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get provider availability
   */
  async getAvailability(req, res, next) {
    try {
      const { providerId } = req.params;
      const availability = await providerService.getAvailability(providerId);

      res.json({
        success: true,
        data: availability
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update provider availability
   */
  async updateAvailability(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { providerId } = req.params;

      // Verify ownership
      const provider = await providerService.getProvider(providerId);
      if (provider.userId !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      await providerService.updateAvailability(providerId, req.body.schedule);

      res.json({
        success: true,
        message: 'Availability updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get provider documents
   */
  async getDocuments(req, res, next) {
    try {
      const { providerId } = req.params;

      // Verify ownership
      const provider = await providerService.getProvider(providerId);
      if (provider.userId !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const documents = await providerService.getDocuments(providerId);

      res.json({
        success: true,
        data: documents
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload provider document
   */
  async uploadDocument(req, res, next) {
    try {
      const { providerId } = req.params;
      const { documentType } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Verify ownership
      const provider = await providerService.getProvider(providerId);
      if (provider.userId !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Only PDF, JPEG, and PNG are allowed'
        });
      }

      // Validate file size (max 10MB)
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB'
        });
      }

      const document = await providerService.uploadDocument(providerId, req.file, documentType);

      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: document
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify provider (admin only)
   */
  async verifyProvider(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { providerId } = req.params;
      const { status, notes } = req.body;

      const provider = await providerService.verifyProvider(providerId, status, notes);

      res.json({
        success: true,
        message: `Provider ${status} successfully`,
        data: provider
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get provider earnings
   */
  async getEarnings(req, res, next) {
    try {
      const { providerId } = req.params;
      const { startDate, endDate } = req.query;

      // Verify ownership
      const provider = await providerService.getProvider(providerId);
      if (provider.userId !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Default to last 30 days if not specified
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const end = endDate || new Date().toISOString();

      const earnings = await providerService.getEarnings(providerId, start, end);

      res.json({
        success: true,
        data: earnings
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search providers
   */
  async searchProviders(req, res, next) {
    try {
      const {
        service,
        city,
        state,
        latitude,
        longitude,
        radius,
        minRating,
        page,
        limit
      } = req.query;

      const providers = await providerService.searchProviders({
        service,
        city,
        state,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        radius: radius ? parseInt(radius) : 25,
        minRating: minRating ? parseFloat(minRating) : null,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20
      });

      res.json({
        success: true,
        data: providers,
        metadata: {
          page: page ? parseInt(page) : 1,
          limit: limit ? parseInt(limit) : 20
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProviderController();
