const express = require('express');
const { body } = require('express-validator');
const providerController = require('../controllers/providerController');
const { authenticate, authorize } = require('../middleware/authenticate');
const multer = require('multer');

const router = express.Router();

// Configure multer for document uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Validation rules
const registerProviderValidation = [
  body('businessName').trim().notEmpty().withMessage('Business name is required'),
  body('description').optional().trim(),
  body('serviceRadius').optional().isInt({ min: 1, max: 100 }),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 })
];

const addServiceValidation = [
  body('serviceId').isUUID().withMessage('Valid service ID is required'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
  body('pricingType').isIn(['fixed', 'hourly', 'quote']).withMessage('Invalid pricing type'),
  body('description').optional().trim()
];

const availabilityValidation = [
  body('schedule').isArray().withMessage('Schedule must be an array'),
  body('schedule.*.dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Invalid day of week'),
  body('schedule.*.startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format'),
  body('schedule.*.endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format'),
  body('schedule.*.isAvailable').isBoolean()
];

const verifyProviderValidation = [
  body('status').isIn(['verified', 'rejected']).withMessage('Status must be verified or rejected'),
  body('notes').optional().trim()
];

// Public routes
router.get('/search', providerController.searchProviders);
router.get('/:providerId', providerController.getProvider);
router.get('/:providerId/services', providerController.getServices);
router.get('/:providerId/availability', providerController.getAvailability);

// Protected routes - Provider registration and management
router.post('/register', authenticate, registerProviderValidation, providerController.registerProvider);
router.put('/:providerId', authenticate, providerController.updateProvider);

// Service offerings
router.post('/:providerId/services', authenticate, addServiceValidation, providerController.addService);
router.put('/:providerId/services/:serviceId', authenticate, providerController.updateService);
router.delete('/:providerId/services/:serviceId', authenticate, providerController.removeService);

// Availability
router.put('/:providerId/availability', authenticate, availabilityValidation, providerController.updateAvailability);

// Documents
router.get('/:providerId/documents', authenticate, providerController.getDocuments);
router.post(
  '/:providerId/documents',
  authenticate,
  upload.single('document'),
  providerController.uploadDocument
);

// Earnings
router.get('/:providerId/earnings', authenticate, providerController.getEarnings);

// Admin routes
router.post(
  '/:providerId/verify',
  authenticate,
  authorize('admin'),
  verifyProviderValidation,
  providerController.verifyProvider
);

module.exports = router;
