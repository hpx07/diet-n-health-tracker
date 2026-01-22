import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { foodApiService } from '../services/foodApi';
import { dietCalculator } from '../services/dietCalculator';
import { format } from 'date-fns';
import './DietTracker.css';

const DietTracker = () => {
  const { userProfile, dietEntries, addDietEntry, deleteDietEntry } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState('breakfast');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const todayEntries = dietEntries.filter(entry => 
    entry.date === selectedDate
  );

  const dietPlan = userProfile ? dietCalculator.generateDietPlan(userProfile, userProfile.goal) : null;
  const dailyAnalysis = dietPlan ? dietCalculator.analyzeDailyIntake(todayEntries, dietPlan.macros) : null;

  // Get categories from food API
  const categories = ['all', ...foodApiService.getCategories()];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setShowSuggestions(false);
    
    let results;
    if (selectedCategory === 'all') {
      results = await foodApiService.searchFood(searchQuery);
    } else {
      // Filter by category
      const categoryResults = foodApiService.getIndianFoodsByCategory(selectedCategory);
      const lowerQuery = searchQuery.toLowerCase();
      results = categoryResults
        .filter(food => food.name.toLowerCase().includes(lowerQuery))
        .map(food => ({
          id: food.id,
          name: food.name,
          brand: 'Indian Food Database',
          servingSize: '100g',
          nutrition: {
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            fiber: food.fiber,
            sugar: food.sugar,
            sodium: food.sodium
          }
        }));
    }
    
    setSearchResults(results);
    setSearching(false);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Show suggestions as user types
    if (value.trim().length >= 2) {
      const allFoods = foodApiService.getIndianFoodsByCategory(
        selectedCategory === 'all' ? null : selectedCategory
      );
      const lowerValue = value.toLowerCase();
      const matchedSuggestions = allFoods
        .filter(food => food.name.toLowerCase().includes(lowerValue))
        .slice(0, 5)
        .map(food => food.name);
      
      setSuggestions(matchedSuggestions);
      setShowSuggestions(matchedSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // Automatically search when suggestion is clicked
    setTimeout(() => {
      const searchBtn = document.querySelector('.search-btn');
      if (searchBtn) searchBtn.click();
    }, 100);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
    
    // If category is selected (not 'all'), show all foods in that category
    if (category !== 'all') {
      const categoryFoods = foodApiService.getIndianFoodsByCategory(category);
      const results = categoryFoods.map(food => ({
        id: food.id,
        name: food.name,
        brand: 'Indian Food Database',
        servingSize: '100g',
        nutrition: {
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: food.fiber,
          sugar: food.sugar,
          sodium: food.sodium
        }
      }));
      setSearchResults(results);
    }
  };

  const handleAddEntry = async () => {
    if (!selectedFood) return;

    const entry = {
      date: selectedDate,
      mealType,
      foodName: selectedFood.name,
      brand: selectedFood.brand,
      quantity,
      nutrition: selectedFood.nutrition,
      timestamp: new Date().toISOString()
    };

    await addDietEntry(entry);
    setSelectedFood(null);
    setSearchQuery('');
    setSearchResults([]);
    setQuantity(100);
  };

  return (
    <div className="diet-tracker">
      <div className="tracker-header">
        <h2>Diet Tracker</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />
      </div>

      {dailyAnalysis && (
        <div className="daily-summary">
          <div className="summary-card">
            <div className="summary-label">Calories</div>
            <div className="summary-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(dailyAnalysis.percentages.calories, 100)}%` }}
                />
              </div>
              <div className="progress-text">
                {dailyAnalysis.totals.calories} / {dietPlan.macros.calories} cal
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Protein</div>
            <div className="summary-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill protein" 
                  style={{ width: `${Math.min(dailyAnalysis.percentages.protein, 100)}%` }}
                />
              </div>
              <div className="progress-text">
                {dailyAnalysis.totals.protein}g / {dietPlan.macros.protein}g
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Carbs</div>
            <div className="summary-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill carbs" 
                  style={{ width: `${Math.min(dailyAnalysis.percentages.carbs, 100)}%` }}
                />
              </div>
              <div className="progress-text">
                {dailyAnalysis.totals.carbs}g / {dietPlan.macros.carbs}g
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Fat</div>
            <div className="summary-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill fat" 
                  style={{ width: `${Math.min(dailyAnalysis.percentages.fat, 100)}%` }}
                />
              </div>
              <div className="progress-text">
                {dailyAnalysis.totals.fat}g / {dietPlan.macros.fat}g
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="add-food-section">
        <h3>Add Food Entry</h3>
        
        <div className="category-filter">
          <label>Category:</label>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category === 'all' ? '🍽️ All' : 
                 category === 'Dairy' ? '🥛 Dairy' :
                 category === 'Grains' ? '🌾 Grains' :
                 category === 'Pulses' ? '🫘 Pulses' :
                 category === 'Vegetables' ? '🥬 Vegetables' :
                 category === 'Fruits' ? '🍎 Fruits' :
                 category === 'Meat' ? '🍗 Meat' :
                 category === 'Seafood' ? '🐟 Seafood' :
                 category === 'Eggs' ? '🥚 Eggs' :
                 category === 'Snacks' ? '🍿 Snacks' :
                 category === 'Sweets' ? '🍬 Sweets' :
                 category === 'Beverages' ? '☕ Beverages' : category}
              </button>
            ))}
          </div>
          {selectedCategory !== 'all' && (
            <p className="category-hint">
              💡 Showing all {selectedCategory.toLowerCase()} items. Search to filter further.
            </p>
          )}
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder={`Search ${selectedCategory === 'all' ? 'all foods' : selectedCategory.toLowerCase()}...`}
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="search-input"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    🔍 {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleSearch} disabled={searching} className="search-btn">
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((food) => (
              <div
                key={food.id}
                className={`food-item ${selectedFood?.id === food.id ? 'selected' : ''}`}
                onClick={() => setSelectedFood(food)}
              >
                <div className="food-name">{food.name}</div>
                {food.brand && <div className="food-brand">{food.brand}</div>}
                <div className="food-nutrition">
                  {food.nutrition.calories} cal | P: {food.nutrition.protein}g | C: {food.nutrition.carbs}g | F: {food.nutrition.fat}g
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedFood && (
          <div className="add-entry-form">
            <div className="form-row">
              <div className="form-group">
                <label>Meal Type</label>
                <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity (g)</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                />
              </div>
            </div>

            <button onClick={handleAddEntry} className="add-btn">Add to Diary</button>
          </div>
        )}
      </div>

      <div className="entries-section">
        <h3>Today's Entries</h3>
        {todayEntries.length === 0 ? (
          <p className="no-entries">No entries for this date</p>
        ) : (
          <div className="entries-list">
            {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => {
              const mealEntries = todayEntries.filter(e => e.mealType === meal);
              if (mealEntries.length === 0) return null;

              return (
                <div key={meal} className="meal-group">
                  <h4>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
                  {mealEntries.map(entry => (
                    <div key={entry.id} className="entry-item">
                      <div className="entry-info">
                        <div className="entry-name">{entry.foodName}</div>
                        {entry.brand && <div className="entry-brand">{entry.brand}</div>}
                        <div className="entry-quantity">{entry.quantity}g</div>
                      </div>
                      <div className="entry-nutrition">
                        <span>{Math.round(entry.nutrition.calories * entry.quantity / 100)} cal</span>
                        <span>P: {Math.round(entry.nutrition.protein * entry.quantity / 100)}g</span>
                        <span>C: {Math.round(entry.nutrition.carbs * entry.quantity / 100)}g</span>
                        <span>F: {Math.round(entry.nutrition.fat * entry.quantity / 100)}g</span>
                      </div>
                      <button 
                        onClick={() => deleteDietEntry(entry.id)} 
                        className="delete-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DietTracker;
