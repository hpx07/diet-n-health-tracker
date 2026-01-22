import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { format } from 'date-fns';
import './DailyChecklist.css';

const DailyChecklist = () => {
  const { dailyChecklists, addDailyChecklist, updateChecklist, deleteChecklist } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState('');

  const todayChecklist = dailyChecklists.find(c => c.date === selectedDate);

  const handleCreateChecklist = async () => {
    await addDailyChecklist({
      date: selectedDate,
      items: [],
      createdAt: new Date().toISOString()
    });
  };

  const handleAddItem = async () => {
    if (!newItem.trim() || !todayChecklist) return;

    const updatedItems = [
      ...todayChecklist.items,
      {
        id: Date.now().toString(),
        text: newItem,
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];

    await updateChecklist(todayChecklist.id, { items: updatedItems });
    setNewItem('');
    setShowForm(false);
  };

  const handleToggleItem = async (itemId) => {
    if (!todayChecklist) return;

    const updatedItems = todayChecklist.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    await updateChecklist(todayChecklist.id, { items: updatedItems });
  };

  const handleDeleteItem = async (itemId) => {
    if (!todayChecklist) return;

    const updatedItems = todayChecklist.items.filter(item => item.id !== itemId);
    await updateChecklist(todayChecklist.id, { items: updatedItems });
  };

  const completedCount = todayChecklist?.items.filter(item => item.completed).length || 0;
  const totalCount = todayChecklist?.items.length || 0;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const generateDailyReport = () => {
    if (!todayChecklist) return '';

    const completed = todayChecklist.items.filter(i => i.completed);
    const pending = todayChecklist.items.filter(i => !i.completed);

    let report = `Daily Report - ${format(new Date(selectedDate), 'MMMM dd, yyyy')}\n\n`;
    report += `Completion Rate: ${completionPercentage.toFixed(1)}% (${completedCount}/${totalCount})\n\n`;
    
    if (completed.length > 0) {
      report += `✅ Completed Tasks (${completed.length}):\n`;
      completed.forEach((item, index) => {
        report += `${index + 1}. ${item.text}\n`;
      });
      report += '\n';
    }

    if (pending.length > 0) {
      report += `⏳ Pending Tasks (${pending.length}):\n`;
      pending.forEach((item, index) => {
        report += `${index + 1}. ${item.text}\n`;
      });
    }

    return report;
  };

  const handleDownloadReport = () => {
    const report = generateDailyReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-report-${selectedDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="daily-checklist">
      <div className="checklist-header">
        <h2>Daily Checklist</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />
      </div>

      {!todayChecklist ? (
        <div className="no-checklist">
          <p>No checklist for this date</p>
          <button onClick={handleCreateChecklist} className="create-btn">
            Create Checklist
          </button>
        </div>
      ) : (
        <>
          <div className="checklist-summary">
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-value">{completedCount}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat">
                <span className="stat-value">{totalCount - completedCount}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat">
                <span className="stat-value">{completionPercentage.toFixed(0)}%</span>
                <span className="stat-label">Progress</span>
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="checklist-actions">
            <button onClick={() => setShowForm(!showForm)} className="add-item-btn">
              {showForm ? 'Cancel' : '+ Add Item'}
            </button>
            {totalCount > 0 && (
              <button onClick={handleDownloadReport} className="report-btn">
                📊 Generate Report
              </button>
            )}
          </div>

          {showForm && (
            <div className="add-item-form">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                placeholder="Enter checklist item..."
                className="item-input"
                autoFocus
              />
              <button onClick={handleAddItem} className="save-item-btn">
                Add
              </button>
            </div>
          )}

          <div className="checklist-items">
            {todayChecklist.items.length === 0 ? (
              <p className="no-items">No items yet. Add your first task!</p>
            ) : (
              todayChecklist.items.map((item) => (
                <div key={item.id} className={`checklist-item ${item.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleItem(item.id)}
                    className="item-checkbox"
                  />
                  <span className="item-text">{item.text}</span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="delete-item-btn"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DailyChecklist;
