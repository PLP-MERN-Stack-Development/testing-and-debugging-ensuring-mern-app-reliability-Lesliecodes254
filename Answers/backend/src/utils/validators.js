/**
 * Validates bug status
 * @param {string} status - Bug status
 * @returns {boolean} - True if valid
 */
const isValidStatus = (status) => {
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  return validStatuses.includes(status);
};

/**
 * Validates bug priority
 * @param {string} priority - Bug priority
 * @returns {boolean} - True if valid
 */
const isValidPriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  return validPriorities.includes(priority);
};

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - User input
 * @returns {string} - Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 1000); // Limit length
};

/**
 * Validates email format
 * @param {string} email - Email address
 * @returns {boolean} - True if valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if a string meets minimum length requirement
 * @param {string} str - Input string
 * @param {number} minLength - Minimum length
 * @returns {boolean} - True if meets requirement
 */
const meetsMinLength = (str, minLength) => {
  return typeof str === 'string' && str.trim().length >= minLength;
};

/**
 * Formats bug data for response
 * @param {Object} bug - Bug document
 * @returns {Object} - Formatted bug data
 */
const formatBugResponse = (bug) => {
  return {
    id: bug._id,
    title: bug.title,
    description: bug.description,
    status: bug.status,
    priority: bug.priority,
    reporter: bug.reporter,
    assignedTo: bug.assignedTo,
    tags: bug.tags,
    createdAt: bug.createdAt,
    updatedAt: bug.updatedAt
  };
};

module.exports = {
  isValidStatus,
  isValidPriority,
  sanitizeInput,
  isValidEmail,
  meetsMinLength,
  formatBugResponse
};
