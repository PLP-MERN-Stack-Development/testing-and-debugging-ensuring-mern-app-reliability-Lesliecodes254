const express = require('express');
const router = express.Router();
const {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats
} = require('../controllers/bugController');

const {
  createBugValidation,
  updateBugValidation,
  bugIdValidation,
  validateRequest
} = require('../middleware/validation');

// Stats route (must be before :id route)
router.get('/stats', getBugStats);

// Main CRUD routes
router.route('/')
  .get(getAllBugs)
  .post(createBugValidation, validateRequest, createBug);

router.route('/:id')
  .get(bugIdValidation, validateRequest, getBugById)
  .put(bugIdValidation, updateBugValidation, validateRequest, updateBug)
  .delete(bugIdValidation, validateRequest, deleteBug);

module.exports = router;
