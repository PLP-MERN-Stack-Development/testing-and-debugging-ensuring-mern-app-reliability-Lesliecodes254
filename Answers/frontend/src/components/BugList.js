import React from 'react';
import BugItem from './BugItem';
import './BugList.css';

const BugList = ({ bugs, onUpdate, onDelete, loading, error }) => {
  if (loading) {
    return (
      <div className="bug-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading bugs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bug-list-container">
        <div className="error-state">
          <h3>❌ Error Loading Bugs</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!bugs || bugs.length === 0) {
    return (
      <div className="bug-list-container">
        <div className="empty-state">
          <h3>🎉 No Bugs Found!</h3>
          <p>Great! There are no bugs to display. Use the form above to report a new bug.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bug-list-container">
      <h2>Bug Reports ({bugs.length})</h2>
      <div className="bug-list">
        {bugs.map(bug => (
          <BugItem
            key={bug.id}
            bug={bug}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BugList;
