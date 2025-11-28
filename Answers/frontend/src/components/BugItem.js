import React, { useState } from 'react';
import './BugItem.css';

const BugItem = ({ bug, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getPriorityClass = (priority) => {
    const classes = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      critical: 'priority-critical'
    };
    return classes[priority] || '';
  };

  const getStatusClass = (status) => {
    const classes = {
      open: 'status-open',
      'in-progress': 'status-in-progress',
      resolved: 'status-resolved',
      closed: 'status-closed'
    };
    return classes[status] || '';
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onUpdate(bug.id, { status: newStatus });
    } catch (error) {
      console.error('Status update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        await onDelete(bug.id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bug-item ${getStatusClass(bug.status)}`}>
      <div className="bug-header">
        <div className="bug-title-section">
          <h3 className="bug-title">{bug.title}</h3>
          <div className="bug-badges">
            <span className={`badge priority-badge ${getPriorityClass(bug.priority)}`}>
              {bug.priority}
            </span>
            <span className={`badge status-badge ${getStatusClass(bug.status)}`}>
              {bug.status}
            </span>
          </div>
        </div>
        <button
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="bug-details">
          <div className="bug-description">
            <strong>Description:</strong>
            <p>{bug.description}</p>
          </div>

          <div className="bug-meta">
            <div className="meta-item">
              <strong>Reporter:</strong> {bug.reporter}
            </div>
            {bug.assignedTo && (
              <div className="meta-item">
                <strong>Assigned To:</strong> {bug.assignedTo}
              </div>
            )}
            <div className="meta-item">
              <strong>Created:</strong> {formatDate(bug.createdAt)}
            </div>
            <div className="meta-item">
              <strong>Updated:</strong> {formatDate(bug.updatedAt)}
            </div>
          </div>

          {bug.tags && bug.tags.length > 0 && (
            <div className="bug-tags">
              <strong>Tags:</strong>
              {bug.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="bug-actions">
            <div className="status-actions">
              <label>Update Status:</label>
              <select
                value={bug.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdating}
                className="status-select"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <button
              className="btn-delete"
              onClick={handleDelete}
              disabled={isUpdating}
            >
              Delete Bug
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugItem;
