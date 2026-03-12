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
    
    // Validate form data
    const errors = [];
    
    if (!formData.name.trim()) {
      errors.push('Name is required');
    }
    
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      errors.push('Age must be between 1 and 120 years');
    }
    
    if (!formData.height || formData.height < 50 || formData.height > 300) {
      errors.push('Height must be between 50 and 300 cm');
    }
    
    if (!formData.weight || formData.weight < 20 || formData.weight > 300) {
      errors.push('Weight must be between 20 and 300 kg');
    }
    
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      // You could show these errors to the user
      return;
    }
    
    try {
      saveUserProfile(formData);
      generateDietPlan(formData);
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
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
              placeholder="Your name"
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
              placeholder="Years"
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
              placeholder="cm"
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
              placeholder="kg"
              required
              min="20"
              max="300"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light (1-3 days/wk)</option>
              <option value="moderate">Moderate (3-5 days/wk)</option>
              <option value="active">Active (6-7 days/wk)</option>
              <option value="veryActive">Very Active (daily)</option>
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
