const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bug title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Bug description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  reporter: {
    type: String,
    required: [true, 'Reporter name is required'],
    trim: true
  },
  assignedTo: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
bugSchema.index({ status: 1, priority: -1, createdAt: -1 });

// Pre-save middleware to update the updatedAt field
bugSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;
