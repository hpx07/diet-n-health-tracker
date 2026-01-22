import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { format } from 'date-fns';
import './HealthGoals.css';

const HealthGoals = () => {
  const { healthGoals, addHealthGoal, updateHealthGoal, deleteHealthGoal } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '',
    unit: '',
    targetDate: '',
    category: 'weight'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addHealthGoal({
      ...formData,
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue),
      createdAt: new Date().toISOString(),
      completed: false
    });
    setFormData({
      title: '',
      description: '',
      targetValue: '',
      currentValue: '',
      unit: '',
      targetDate: '',
      category: 'weight'
    });
    setShowForm(false);
  };

  const handleUpdateProgress = async (goalId, newValue) => {
    const goal = healthGoals.find(g => g.id === goalId);
    const progress = ((newValue / goal.targetValue) * 100).toFixed(1);
    const completed = newValue >= goal.targetValue;
    
    await updateHealthGoal(goalId, {
      currentValue: parseFloat(newValue),
      progress: parseFloat(progress),
      completed,
      lastUpdated: new Date().toISOString()
    });
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return '#4caf50';
    if (progress >= 75) return '#8bc34a';
    if (progress >= 50) return '#ffc107';
    if (progress >= 25) return '#ff9800';
    return '#f44336';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      weight: '⚖️',
      fitness: '💪',
      nutrition: '🥗',
      health: '❤️',
      habit: '✨'
    };
    return icons[category] || '🎯';
  };

  return (
    <div className="health-goals">
      <div className="goals-header">
        <h2>Health Goals</h2>
        <button onClick={() => setShowForm(!showForm)} className="add-goal-btn">
          {showForm ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="goal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Goal Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Lose 10kg"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="weight">Weight</option>
                <option value="fitness">Fitness</option>
                <option value="nutrition">Nutrition</option>
                <option value="health">Health</option>
                <option value="habit">Habit</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your goal..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Current Value</label>
              <input
                type="number"
                step="0.1"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Target Value</label>
              <input
                type="number"
                step="0.1"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
                placeholder="e.g., kg, km, days"
              />
            </div>

            <div className="form-group">
              <label>Target Date</label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">Create Goal</button>
        </form>
      )}

      <div className="goals-list">
        {healthGoals.length === 0 ? (
          <div className="no-goals">
            <p>No goals yet. Create your first health goal to get started!</p>
          </div>
        ) : (
          <div className="goals-grid">
            {healthGoals.map((goal) => {
              const progress = ((goal.currentValue / goal.targetValue) * 100).toFixed(1);
              const isCompleted = goal.completed || progress >= 100;

              return (
                <div key={goal.id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
                  <div className="goal-header">
                    <div className="goal-title-row">
                      <span className="goal-icon">{getCategoryIcon(goal.category)}</span>
                      <h3>{goal.title}</h3>
                    </div>
                    <button
                      onClick={() => deleteHealthGoal(goal.id)}
                      className="delete-btn"
                    >
                      ×
                    </button>
                  </div>

                  {goal.description && (
                    <p className="goal-description">{goal.description}</p>
                  )}

                  <div className="goal-progress">
                    <div className="progress-info">
                      <span className="current-value">
                        {goal.currentValue} {goal.unit}
                      </span>
                      <span className="target-value">
                        / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          background: getProgressColor(progress)
                        }}
                      />
                    </div>
                    <div className="progress-percentage">{progress}% Complete</div>
                  </div>

                  <div className="goal-update">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Update progress"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateProgress(goal.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="update-input"
                    />
                    <span className="update-hint">Press Enter to update</span>
                  </div>

                  <div className="goal-footer">
                    <span className="goal-category">{goal.category}</span>
                    <span className="goal-deadline">
                      Due: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  {isCompleted && (
                    <div className="completion-badge">
                      ✓ Completed!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthGoals;
