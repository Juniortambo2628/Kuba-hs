const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// Validation rules
const createReviewValidation = [
  body('bookingId').isUUID().withMessage('Valid booking ID is required'),
  body('providerId').isUUID().withMessage('Valid provider ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
  body('serviceQuality').optional().isInt({ min: 1, max: 5 }),
  body('communication').optional().isInt({ min: 1, max: 5 }),
  body('timeliness').optional().isInt({ min: 1, max: 5 }),
  body('professionalism').optional().isInt({ min: 1, max: 5 })
];

const updateReviewValidation = [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().notEmpty(),
  body('serviceQuality').optional().isInt({ min: 1, max: 5 }),
  body('communication').optional().isInt({ min: 1, max: 5 }),
  body('timeliness').optional().isInt({ min: 1, max: 5 }),
  body('professionalism').optional().isInt({ min: 1, max: 5 })
];

const responseValidation = [
  body('response').trim().notEmpty().withMessage('Response is required')
];

const flagValidation = [
  body('reason').trim().notEmpty().withMessage('Reason is required')
];

// Public routes
router.get('/providers/:providerId', reviewController.getProviderReviews);
router.get('/providers/:providerId/statistics', reviewController.getProviderStatistics);
router.get('/:reviewId', reviewController.getReview);

// Protected routes (authentication required)
router.use(authenticate);

// Customer review routes
router.post('/', createReviewValidation, reviewController.createReview);
router.get('/customer/my-reviews', reviewController.getCustomerReviews);
router.put('/:reviewId', updateReviewValidation, reviewController.updateReview);
router.delete('/:reviewId', reviewController.deleteReview);

// Provider response routes
router.post('/:reviewId/response', responseValidation, reviewController.addProviderResponse);
router.put('/:reviewId/response', responseValidation, reviewController.updateProviderResponse);

// Flag review
router.post('/:reviewId/flag', flagValidation, reviewController.flagReview);

module.exports = router;
