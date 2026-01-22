import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { dietCalculator } from '../services/dietCalculator';
import './UserProfile.css';

const UserProfile = () => {
  const { userProfile, saveUserProfile } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityLevel: 'moderate',
    goal: 'maintain'
  });
  const [dietPlan, setDietPlan] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
      generateDietPlan(userProfile);
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateDietPlan = (profile) => {
    if (profile.weight && profile.height && profile.age) {
      const plan = dietCalculator.generateDietPlan(profile, profile.goal);
      setDietPlan(plan);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserProfile(formData);
    generateDietPlan(formData);
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              max="120"
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              min="50"
              max="300"
            />
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              min="20"
              max="300"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Light (exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (exercise 3-5 days/week)</option>
              <option value="active">Active (exercise 6-7 days/week)</option>
              <option value="veryActive">Very Active (intense exercise daily)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange}>
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>
        </div>

        <button type="submit" className="save-btn">Save Profile</button>
      </form>

      {dietPlan && (
        <div className="diet-plan">
          <h3>Your Personalized Diet Plan</h3>
          
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">BMI</div>
              <div className="metric-value">{dietPlan.bmi}</div>
              <div className="metric-status">{dietPlan.bmiCategory}</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">BMR</div>
              <div className="metric-value">{dietPlan.bmr}</div>
              <div className="metric-unit">cal/day</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">TDEE</div>
              <div className="metric-value">{dietPlan.tdee}</div>
              <div className="metric-unit">cal/day</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Target Calories</div>
              <div className="metric-value">{dietPlan.targetCalories}</div>
              <div className="metric-unit">cal/day</div>
            </div>
          </div>

          <div className="macros-section">
            <h4>Daily Macro Targets</h4>
            <div className="macros-grid">
              <div className="macro-item">
                <span className="macro-label">Protein</span>
                <span className="macro-value">{dietPlan.macros.protein}g</span>
              </div>
              <div className="macro-item">
                <span className="macro-label">Carbs</span>
                <span className="macro-value">{dietPlan.macros.carbs}g</span>
              </div>
              <div className="macro-item">
                <span className="macro-label">Fat</span>
                <span className="macro-value">{dietPlan.macros.fat}g</span>
              </div>
            </div>
          </div>

          <div className="recommendations">
            <h4>Recommendations</h4>
            <ul>
              {dietPlan.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
