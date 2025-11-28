import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import { getAllBugs, createBug, updateBug, deleteBug } from './services/bugService';
import './App.css';

function App() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [showForm, setShowForm] = useState(true);

  // Fetch bugs on component mount and when filters change
  useEffect(() => {
    fetchBugs();
  }, [filter]);

  const fetchBugs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching bugs with filters:', filter);
      const response = await getAllBugs(filter);
      console.log('Bugs fetched successfully:', response.count);
      setBugs(response.data);
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBug = async (bugData) => {
    try {
      console.log('Creating bug:', bugData);
      const response = await createBug(bugData);
      console.log('Bug created:', response.data.id);
      
      // Add new bug to the list
      setBugs(prevBugs => [response.data, ...prevBugs]);
      
      // Show success message
      alert('Bug reported successfully!');
    } catch (err) {
      console.error('Error creating bug:', err);
      throw err;
    }
  };

  const handleUpdateBug = async (id, updates) => {
    try {
      console.log('Updating bug:', id, updates);
      const response = await updateBug(id, updates);
      console.log('Bug updated:', response.data.id);
      
      // Update bug in the list
      setBugs(prevBugs =>
        prevBugs.map(bug => bug.id === id ? response.data : bug)
      );
    } catch (err) {
      console.error('Error updating bug:', err);
      alert('Failed to update bug: ' + err.message);
    }
  };

  const handleDeleteBug = async (id) => {
    try {
      console.log('Deleting bug:', id);
      await deleteBug(id);
      console.log('Bug deleted successfully');
      
      // Remove bug from the list
      setBugs(prevBugs => prevBugs.filter(bug => bug.id !== id));
      
      alert('Bug deleted successfully!');
    } catch (err) {
      console.error('Error deleting bug:', err);
      alert('Failed to delete bug: ' + err.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilter({ status: '', priority: '' });
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="app-header">
          <h1>🐛 Bug Tracker</h1>
          <p>Track and manage software bugs efficiently</p>
        </header>

        <main className="app-main">
          <section className="form-section">
            <div className="section-header">
              <h2>Report New Bug</h2>
              <button 
                className="toggle-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Hide Form' : 'Show Form'}
              </button>
            </div>
            
            {showForm && (
              <BugForm onSubmit={handleCreateBug} />
            )}
          </section>

          <section className="list-section">
            <div className="filters">
              <h3>Filter Bugs</h3>
              <div className="filter-group">
                <label htmlFor="status-filter">Status:</label>
                <select
                  id="status-filter"
                  name="status"
                  value={filter.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <label htmlFor="priority-filter">Priority:</label>
                <select
                  id="priority-filter"
                  name="priority"
                  value={filter.priority}
                  onChange={handleFilterChange}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>

                <button className="btn-clear" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </div>

            <BugList
              bugs={bugs}
              loading={loading}
              error={error}
              onUpdate={handleUpdateBug}
              onDelete={handleDeleteBug}
            />
          </section>
        </main>

        <footer className="app-footer">
          <p>MERN Bug Tracker © 2024 | Built with Testing & Debugging Best Practices</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
