const { body, param, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Validation rules for creating a bug
 */
const createBugValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
  
  body('reporter')
    .trim()
    .notEmpty().withMessage('Reporter name is required'),
  
  body('assignedTo')
    .optional()
    .trim(),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
];

/**
 * Validation rules for updating a bug
 */
const updateBugValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'closed']).withMessage('Invalid status'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
  
  body('assignedTo')
    .optional()
    .trim(),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
];

/**
 * Validation rule for bug ID parameter
 */
const bugIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid bug ID format')
];

/**
 * Middleware to check validation results
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new AppError(errorMessages.join(', '), 400));
  }
  
  next();
};

module.exports = {
  createBugValidation,
  updateBugValidation,
  bugIdValidation,
  validateRequest
};
