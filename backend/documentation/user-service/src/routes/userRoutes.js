const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authenticate');
const multer = require('multer');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Validation rules
const updateUserValidation = [
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('phone').optional().trim().matches(/^\+?[1-9]\d{1,14}$/)
];

const addressValidation = [
  body('addressType').isIn(['residential', 'commercial']).withMessage('Address type must be residential or commercial'),
  body('streetAddress').trim().notEmpty().withMessage('Street address is required'),
  body('apartment').optional().trim(),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
  body('isDefault').optional().isBoolean()
];

// User profile routes
router.get('/:userId', authenticate, userController.getUser);
router.put('/:userId', authenticate, updateUserValidation, userController.updateUser);
router.delete('/:userId', authenticate, userController.deleteUser);

// Address routes
router.get('/:userId/addresses', authenticate, userController.getAddresses);
router.post('/:userId/addresses', authenticate, addressValidation, userController.addAddress);
router.put('/:userId/addresses/:addressId', authenticate, userController.updateAddress);
router.delete('/:userId/addresses/:addressId', authenticate, userController.deleteAddress);
router.patch('/:userId/addresses/:addressId/default', authenticate, userController.setDefaultAddress);

// Favorites routes
router.get('/:userId/favorites', authenticate, userController.getFavorites);
router.post('/:userId/favorites/:providerId', authenticate, userController.addFavorite);
router.delete('/:userId/favorites/:providerId', authenticate, userController.removeFavorite);

// Profile picture upload
router.post(
  '/:userId/profile-picture', 
  authenticate, 
  upload.single('profilePicture'), 
  userController.uploadProfilePicture
);

module.exports = router;
