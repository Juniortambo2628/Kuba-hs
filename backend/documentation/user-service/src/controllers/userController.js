const userService = require('../services/userService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class UserController {
  /**
   * Get user by ID
   */
  async getUser(req, res, next) {
    try {
      const { userId } = req.params;
      
      // Authorization: users can only access their own data (unless admin)
      if (req.user.userId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const user = await userService.getUser(userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  async updateUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { userId } = req.params;

      // Authorization: users can only update their own data
      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const user = await userService.updateUser(userId, req.body);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user account
   */
  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      await userService.deleteUser(userId);

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user addresses
   */
  async getAddresses(req, res, next) {
    try {
      const { userId } = req.params;

      if (req.user.userId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const addresses = await userService.getAddresses(userId);

      res.json({
        success: true,
        data: addresses
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add new address
   */
  async addAddress(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { userId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const address = await userService.addAddress(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update address
   */
  async updateAddress(req, res, next) {
    try {
      const { userId, addressId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const address = await userService.updateAddress(userId, addressId, req.body);

      res.json({
        success: true,
        message: 'Address updated successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete address
   */
  async deleteAddress(req, res, next) {
    try {
      const { userId, addressId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      await userService.deleteAddress(userId, addressId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set default address
   */
  async setDefaultAddress(req, res, next) {
    try {
      const { userId, addressId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const address = await userService.setDefaultAddress(userId, addressId);

      res.json({
        success: true,
        message: 'Default address updated',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user favorites
   */
  async getFavorites(req, res, next) {
    try {
      const { userId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const favorites = await userService.getFavorites(userId);

      res.json({
        success: true,
        data: favorites
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add to favorites
   */
  async addFavorite(req, res, next) {
    try {
      const { userId, providerId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      await userService.addFavorite(userId, providerId);

      res.status(201).json({
        success: true,
        message: 'Added to favorites'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove from favorites
   */
  async removeFavorite(req, res, next) {
    try {
      const { userId, providerId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      await userService.removeFavorite(userId, providerId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(req, res, next) {
    try {
      const { userId } = req.params;

      if (req.user.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'
        });
      }

      // Validate file size (max 5MB)
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB'
        });
      }

      const url = await userService.uploadProfilePicture(userId, req.file);

      res.json({
        success: true,
        message: 'Profile picture uploaded successfully',
        data: { url }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
