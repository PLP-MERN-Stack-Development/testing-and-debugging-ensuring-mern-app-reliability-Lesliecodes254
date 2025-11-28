const Bug = require('../models/Bug');
const { AppError } = require('../middleware/errorHandler');
const { sanitizeInput, formatBugResponse } = require('../utils/validators');

/**
 * @desc    Get all bugs
 * @route   GET /api/bugs
 * @access  Public
 */
const getAllBugs = async (req, res, next) => {
  try {
    // Extract query parameters for filtering
    const { status, priority, sortBy = '-createdAt' } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    console.log('Fetching bugs with query:', query);

    const bugs = await Bug.find(query).sort(sortBy);

    res.status(200).json({
      success: true,
      count: bugs.length,
      data: bugs.map(formatBugResponse)
    });
  } catch (error) {
    console.error('Get all bugs error:', error);
    next(error);
  }
};

/**
 * @desc    Get single bug
 * @route   GET /api/bugs/:id
 * @access  Public
 */
const getBugById = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return next(new AppError('Bug not found', 404));
    }

    console.log('Bug found:', bug._id);

    res.status(200).json({
      success: true,
      data: formatBugResponse(bug)
    });
  } catch (error) {
    console.error('Get bug by ID error:', error);
    next(error);
  }
};

/**
 * @desc    Create new bug
 * @route   POST /api/bugs
 * @access  Public
 */
const createBug = async (req, res, next) => {
  try {
    // Sanitize inputs
    const bugData = {
      title: sanitizeInput(req.body.title),
      description: sanitizeInput(req.body.description),
      status: req.body.status || 'open',
      priority: req.body.priority || 'medium',
      reporter: sanitizeInput(req.body.reporter),
      assignedTo: req.body.assignedTo ? sanitizeInput(req.body.assignedTo) : undefined,
      tags: req.body.tags || []
    };

    console.log('Creating bug with data:', bugData);

    const bug = await Bug.create(bugData);

    console.log('Bug created successfully:', bug._id);

    res.status(201).json({
      success: true,
      data: formatBugResponse(bug)
    });
  } catch (error) {
    console.error('Create bug error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return next(new AppError(errors.join(', '), 400));
    }
    
    next(error);
  }
};

/**
 * @desc    Update bug
 * @route   PUT /api/bugs/:id
 * @access  Public
 */
const updateBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return next(new AppError('Bug not found', 404));
    }

    // Sanitize and update only provided fields
    const updates = {};
    if (req.body.title) updates.title = sanitizeInput(req.body.title);
    if (req.body.description) updates.description = sanitizeInput(req.body.description);
    if (req.body.status) updates.status = req.body.status;
    if (req.body.priority) updates.priority = req.body.priority;
    if (req.body.assignedTo !== undefined) updates.assignedTo = sanitizeInput(req.body.assignedTo);
    if (req.body.tags) updates.tags = req.body.tags;

    console.log('Updating bug:', req.params.id, 'with:', updates);

    const updatedBug = await Bug.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    console.log('Bug updated successfully:', updatedBug._id);

    res.status(200).json({
      success: true,
      data: formatBugResponse(updatedBug)
    });
  } catch (error) {
    console.error('Update bug error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return next(new AppError(errors.join(', '), 400));
    }
    
    next(error);
  }
};

/**
 * @desc    Delete bug
 * @route   DELETE /api/bugs/:id
 * @access  Public
 */
const deleteBug = async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return next(new AppError('Bug not found', 404));
    }

    console.log('Deleting bug:', req.params.id);

    await Bug.findByIdAndDelete(req.params.id);

    console.log('Bug deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Bug deleted successfully'
    });
  } catch (error) {
    console.error('Delete bug error:', error);
    next(error);
  }
};

/**
 * @desc    Get bug statistics
 * @route   GET /api/bugs/stats
 * @access  Public
 */
const getBugStats = async (req, res, next) => {
  try {
    const stats = await Bug.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Bug.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        byStatus: stats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Get bug stats error:', error);
    next(error);
  }
};

module.exports = {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats
};
