import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { healthTestService } from '../services/healthTestApi';
import { format } from 'date-fns';
import './TestReports.css';

const TestReports = () => {
  const { userProfile, testReports, addTestReport, deleteTestReport } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testValue, setTestValue] = useState('');
  const [testDate, setTestDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showForm, setShowForm] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = healthTestService.searchTests(searchQuery);
    setSearchResults(results);
  };

  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setSearchResults([]);
    setSearchQuery('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTest || !testValue) return;

    const analysis = healthTestService.analyzeTestResult(
      selectedTest.id,
      parseFloat(testValue),
      userProfile?.gender || 'male'
    );

    const report = {
      testId: selectedTest.id,
      testName: selectedTest.name,
      category: selectedTest.category,
      value: parseFloat(testValue),
      unit: selectedTest.unit,
      date: testDate,
      status: analysis.status,
      message: analysis.message,
      normalRange: analysis.normalRange,
      timestamp: new Date().toISOString()
    };

    await addTestReport(report);
    
    // Reset form
    setSelectedTest(null);
    setTestValue('');
    setTestDate(format(new Date(), 'yyyy-MM-dd'));
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return '#4caf50';
      case 'low': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#999';
    }
  };

  const categories = healthTestService.getAllCategories();
  const sortedReports = [...testReports].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="test-reports">
      <h2>Test Reports</h2>

      <div className="add-test-section">
        <h3>Add New Test Result</h3>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a test (e.g., Hemoglobin, Blood Sugar)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch();
            }}
            className="search-input"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="test-results">
            {searchResults.map((test) => (
              <div
                key={test.id}
                className="test-item"
                onClick={() => handleSelectTest(test)}
              >
                <div className="test-name">{test.name}</div>
                <div className="test-category">{test.category}</div>
                <div className="test-unit">Unit: {test.unit}</div>
              </div>
            ))}
          </div>
        )}

        {showForm && selectedTest && (
          <form onSubmit={handleSubmit} className="test-form">
            <div className="selected-test-info">
              <h4>{selectedTest.name}</h4>
              <p>Category: {selectedTest.category}</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Test Value ({selectedTest.unit})</label>
                <input
                  type="number"
                  step="0.01"
                  value={testValue}
                  onChange={(e) => setTestValue(e.target.value)}
                  required
                  placeholder={`Enter value in ${selectedTest.unit}`}
                />
              </div>

              <div className="form-group">
                <label>Test Date</label>
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Save Test Result</button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setSelectedTest(null);
                  setTestValue('');
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="reports-section">
        <h3>Your Test History</h3>
        
        {sortedReports.length === 0 ? (
          <p className="no-reports">No test reports yet. Add your first test result above.</p>
        ) : (
          <div className="reports-list">
            {sortedReports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div>
                    <h4>{report.testName}</h4>
                    <span className="report-category">{report.category}</span>
                  </div>
                  <button 
                    onClick={() => deleteTestReport(report.id)}
                    className="delete-btn"
                  >
                    ×
                  </button>
                </div>

                <div className="report-body">
                  <div className="report-value">
                    <span className="value-label">Result:</span>
                    <span className="value-number">{report.value} {report.unit}</span>
                  </div>

                  <div 
                    className="report-status"
                    style={{ color: getStatusColor(report.status) }}
                  >
                    <span className="status-badge" style={{ background: getStatusColor(report.status) }}>
                      {report.status.toUpperCase()}
                    </span>
                    <span className="status-message">{report.message}</span>
                  </div>

                  <div className="report-date">
                    Test Date: {format(new Date(report.date), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="categories-info">
        <h3>Available Test Categories</h3>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category} className="category-badge">
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestReports;
