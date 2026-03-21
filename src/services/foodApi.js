import axios from 'axios';

// USDA FoodData Central API (better quality data)
const USDA_API_KEY = 'DEMO_KEY'; // Free demo key, you can get your own at https://fdc.nal.usda.gov/api-key-signup.html
const USDA_API = 'https://api.nal.usda.gov/fdc/v1';

// Built-in Indian Food Database (as primary source for Indian foods)
const indianFoodDatabase = [
  // Dairy Products
  { id: 'milk-whole', name: 'Milk (Whole)', category: 'Dairy', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5.1, sodium: 0.04 },
  { id: 'milk-toned', name: 'Milk (Toned)', category: 'Dairy', calories: 58, protein: 3.0, carbs: 4.8, fat: 3.0, fiber: 0, sugar: 4.8, sodium: 0.04 },
  { id: 'milk-skimmed', name: 'Milk (Skimmed)', category: 'Dairy', calories: 35, protein: 3.4, carbs: 5.0, fat: 0.1, fiber: 0, sugar: 5.0, sodium: 0.04 },
  { id: 'curd-plain', name: 'Curd/Dahi (Plain)', category: 'Dairy', calories: 60, protein: 3.5, carbs: 4.7, fat: 3.0, fiber: 0, sugar: 4.7, sodium: 0.05 },
  { id: 'paneer', name: 'Paneer (Cottage Cheese)', category: 'Dairy', calories: 265, protein: 18.3, carbs: 1.2, fat: 20.8, fiber: 0, sugar: 1.2, sodium: 0.2 },
  { id: 'ghee', name: 'Ghee (Clarified Butter)', category: 'Dairy', calories: 900, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 0 },
  { id: 'butter', name: 'Butter', category: 'Dairy', calories: 717, protein: 0.9, carbs: 0.1, fat: 81.1, fiber: 0, sugar: 0.1, sodium: 0.7 },
  
  // Rice & Grains
  { id: 'rice-white-cooked', name: 'Rice (White, Cooked)', category: 'Grains', calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 0.001 },
  { id: 'rice-brown-cooked', name: 'Rice (Brown, Cooked)', category: 'Grains', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, fiber: 1.8, sugar: 0.4, sodium: 0.005 },
  { id: 'rice-basmati-cooked', name: 'Basmati Rice (Cooked)', category: 'Grains', calories: 121, protein: 3.5, carbs: 25.2, fat: 0.4, fiber: 0.6, sugar: 0, sodium: 0.001 },
  { id: 'wheat-flour', name: 'Wheat Flour (Atta)', category: 'Grains', calories: 341, protein: 12.1, carbs: 69.4, fat: 1.7, fiber: 11.2, sugar: 0.4, sodium: 0.002 },
  { id: 'roti-plain', name: 'Roti/Chapati (Plain)', category: 'Grains', calories: 297, protein: 11.0, carbs: 51.0, fat: 7.0, fiber: 7.0, sugar: 0.5, sodium: 0.4 },
  { id: 'paratha-plain', name: 'Paratha (Plain)', category: 'Grains', calories: 320, protein: 6.5, carbs: 42.0, fat: 13.0, fiber: 3.0, sugar: 1.0, sodium: 0.5 },
  { id: 'poha', name: 'Poha (Flattened Rice)', category: 'Grains', calories: 158, protein: 2.0, carbs: 35.0, fat: 0.5, fiber: 1.5, sugar: 0.2, sodium: 0.3 },
  { id: 'upma', name: 'Upma (Semolina)', category: 'Grains', calories: 150, protein: 3.5, carbs: 28.0, fat: 3.0, fiber: 2.0, sugar: 1.0, sodium: 0.4 },
  
  // Lentils & Pulses (Dal)
  { id: 'dal-toor-cooked', name: 'Toor Dal (Cooked)', category: 'Pulses', calories: 118, protein: 6.2, carbs: 20.0, fat: 0.7, fiber: 5.0, sugar: 0.5, sodium: 0.01 },
  { id: 'dal-moong-cooked', name: 'Moong Dal (Cooked)', category: 'Pulses', calories: 105, protein: 7.0, carbs: 19.0, fat: 0.4, fiber: 7.6, sugar: 2.0, sodium: 0.01 },
  { id: 'dal-masoor-cooked', name: 'Masoor Dal (Cooked)', category: 'Pulses', calories: 116, protein: 9.0, carbs: 20.0, fat: 0.4, fiber: 7.9, sugar: 1.8, sodium: 0.01 },
  { id: 'dal-chana-cooked', name: 'Chana Dal (Cooked)', category: 'Pulses', calories: 120, protein: 8.9, carbs: 21.0, fat: 0.6, fiber: 7.6, sugar: 2.0, sodium: 0.01 },
  { id: 'rajma-cooked', name: 'Rajma (Kidney Beans, Cooked)', category: 'Pulses', calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5, fiber: 6.4, sugar: 0.3, sodium: 0.01 },
  { id: 'chole-cooked', name: 'Chole (Chickpeas, Cooked)', category: 'Pulses', calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, sugar: 4.8, sodium: 0.01 },
  
  // Vegetables
  { id: 'potato-boiled', name: 'Potato (Boiled)', category: 'Vegetables', calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1, fiber: 1.8, sugar: 0.9, sodium: 0.006 },
  { id: 'tomato', name: 'Tomato', category: 'Vegetables', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 0.005 },
  { id: 'onion', name: 'Onion', category: 'Vegetables', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.2, sodium: 0.004 },
  { id: 'spinach', name: 'Spinach (Palak)', category: 'Vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 0.079 },
  { id: 'cauliflower', name: 'Cauliflower (Gobi)', category: 'Vegetables', calories: 25, protein: 1.9, carbs: 5.0, fat: 0.3, fiber: 2.0, sugar: 1.9, sodium: 0.03 },
  { id: 'carrot', name: 'Carrot (Gajar)', category: 'Vegetables', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 0.069 },
  { id: 'peas', name: 'Green Peas (Matar)', category: 'Vegetables', calories: 81, protein: 5.4, carbs: 14.5, fat: 0.4, fiber: 5.7, sugar: 5.7, sodium: 0.005 },
  { id: 'okra', name: 'Okra (Bhindi)', category: 'Vegetables', calories: 33, protein: 1.9, carbs: 7.5, fat: 0.2, fiber: 3.2, sugar: 1.5, sodium: 0.007 },
  
  // Fruits
  { id: 'banana', name: 'Banana (Kela)', category: 'Fruits', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, sugar: 12.2, sodium: 0.001 },
  { id: 'apple', name: 'Apple (Seb)', category: 'Fruits', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4, sugar: 10.4, sodium: 0.001 },
  { id: 'mango', name: 'Mango (Aam)', category: 'Fruits', calories: 60, protein: 0.8, carbs: 15.0, fat: 0.4, fiber: 1.6, sugar: 13.7, sodium: 0.001 },
  { id: 'orange', name: 'Orange (Santra)', category: 'Fruits', calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, sugar: 9.4, sodium: 0 },
  { id: 'papaya', name: 'Papaya (Papita)', category: 'Fruits', calories: 43, protein: 0.5, carbs: 10.8, fat: 0.3, fiber: 1.7, sugar: 7.8, sodium: 0.008 },
  { id: 'guava', name: 'Guava (Amrud)', category: 'Fruits', calories: 68, protein: 2.6, carbs: 14.3, fat: 1.0, fiber: 5.4, sugar: 8.9, sodium: 0.002 },
  
  // Meat & Protein
  { id: 'chicken-breast', name: 'Chicken Breast (Cooked)', category: 'Meat', calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 0.074 },
  { id: 'chicken-curry', name: 'Chicken Curry', category: 'Meat', calories: 180, protein: 18.0, carbs: 5.0, fat: 10.0, fiber: 1.0, sugar: 2.0, sodium: 0.5 },
  { id: 'mutton-curry', name: 'Mutton Curry', category: 'Meat', calories: 250, protein: 20.0, carbs: 4.0, fat: 17.0, fiber: 1.0, sugar: 2.0, sodium: 0.5 },
  { id: 'fish-curry', name: 'Fish Curry', category: 'Seafood', calories: 150, protein: 18.0, carbs: 3.0, fat: 7.0, fiber: 0.5, sugar: 1.5, sodium: 0.4 },
  { id: 'egg-boiled', name: 'Egg (Boiled)', category: 'Eggs', calories: 155, protein: 12.6, carbs: 1.1, fat: 10.6, fiber: 0, sugar: 1.1, sodium: 0.124 },
  { id: 'egg-omelette', name: 'Omelette', category: 'Eggs', calories: 154, protein: 10.9, carbs: 0.6, fat: 11.7, fiber: 0, sugar: 0.4, sodium: 0.3 },
  
  // Snacks & Street Food
  { id: 'samosa', name: 'Samosa', category: 'Snacks', calories: 262, protein: 3.5, carbs: 24.0, fat: 17.0, fiber: 2.0, sugar: 1.0, sodium: 0.5 },
  { id: 'pakora', name: 'Pakora', category: 'Snacks', calories: 280, protein: 5.0, carbs: 25.0, fat: 18.0, fiber: 2.5, sugar: 2.0, sodium: 0.4 },
  { id: 'vada-pav', name: 'Vada Pav', category: 'Snacks', calories: 286, protein: 6.0, carbs: 38.0, fat: 12.0, fiber: 3.0, sugar: 3.0, sodium: 0.6 },
  { id: 'dosa-plain', name: 'Dosa (Plain)', category: 'Snacks', calories: 168, protein: 3.8, carbs: 28.0, fat: 4.0, fiber: 1.5, sugar: 1.0, sodium: 0.3 },
  { id: 'idli', name: 'Idli', category: 'Snacks', calories: 58, protein: 2.0, carbs: 12.0, fat: 0.3, fiber: 0.5, sugar: 0.5, sodium: 0.2 },
  { id: 'puri', name: 'Puri', category: 'Snacks', calories: 330, protein: 5.0, carbs: 35.0, fat: 19.0, fiber: 2.0, sugar: 1.0, sodium: 0.4 },
  
  // Sweets
  { id: 'gulab-jamun', name: 'Gulab Jamun', category: 'Sweets', calories: 175, protein: 3.0, carbs: 25.0, fat: 7.0, fiber: 0.5, sugar: 20.0, sodium: 0.05 },
  { id: 'jalebi', name: 'Jalebi', category: 'Sweets', calories: 150, protein: 1.0, carbs: 28.0, fat: 4.0, fiber: 0.2, sugar: 25.0, sodium: 0.02 },
  { id: 'rasgulla', name: 'Rasgulla', category: 'Sweets', calories: 186, protein: 4.0, carbs: 32.0, fat: 4.0, fiber: 0, sugar: 30.0, sodium: 0.05 },
  { id: 'ladoo', name: 'Ladoo (Besan)', category: 'Sweets', calories: 420, protein: 8.0, carbs: 55.0, fat: 18.0, fiber: 3.0, sugar: 35.0, sodium: 0.1 },
  
  // Beverages
  { id: 'tea-milk-sugar', name: 'Tea (with Milk & Sugar)', category: 'Beverages', calories: 30, protein: 0.8, carbs: 5.5, fat: 0.7, fiber: 0, sugar: 5.0, sodium: 0.01 },
  { id: 'coffee-milk-sugar', name: 'Coffee (with Milk & Sugar)', category: 'Beverages', calories: 35, protein: 1.0, carbs: 6.0, fat: 0.8, fiber: 0, sugar: 5.5, sodium: 0.01 },
  { id: 'lassi-sweet', name: 'Lassi (Sweet)', category: 'Beverages', calories: 110, protein: 3.0, carbs: 18.0, fat: 2.5, fiber: 0, sugar: 16.0, sodium: 0.05 },
  { id: 'lassi-plain', name: 'Lassi (Plain)', category: 'Beverages', calories: 60, protein: 3.5, carbs: 5.0, fat: 3.0, fiber: 0, sugar: 5.0, sodium: 0.05 },
  { id: 'coconut-water', name: 'Coconut Water (Nariyal Pani)', category: 'Beverages', calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2, fiber: 1.1, sugar: 2.6, sodium: 0.105 },

  // Punjabi Main Dishes
{ id: 'sarson-ka-saag', name: 'Sarson Ka Saag', category: 'Vegetables', calories: 180, protein: 6.0, carbs: 12.0, fat: 12.0, fiber: 5.0, sugar: 2.0, sodium: 0.45 },
{ id: 'makki-di-roti', name: 'Makki Di Roti', category: 'Grains', calories: 330, protein: 7.0, carbs: 54.0, fat: 9.0, fiber: 6.0, sugar: 1.0, sodium: 0.4 },
{ id: 'dal-makhani', name: 'Dal Makhani', category: 'Pulses', calories: 220, protein: 9.0, carbs: 20.0, fat: 12.0, fiber: 6.0, sugar: 2.0, sodium: 0.6 },
{ id: 'rajma-masala', name: 'Rajma Masala', category: 'Pulses', calories: 190, protein: 9.5, carbs: 24.0, fat: 7.0, fiber: 7.0, sugar: 2.5, sodium: 0.5 },
{ id: 'kadhi-pakora', name: 'Punjabi Kadhi Pakora', category: 'Pulses', calories: 200, protein: 7.0, carbs: 18.0, fat: 11.0, fiber: 3.0, sugar: 3.0, sodium: 0.6 },

// Punjabi Non-Vegetarian
{ id: 'butter-chicken', name: 'Butter Chicken', category: 'Meat', calories: 240, protein: 18.0, carbs: 6.0, fat: 17.0, fiber: 1.0, sugar: 3.0, sodium: 0.7 },
{ id: 'chicken-tikka', name: 'Chicken Tikka', category: 'Meat', calories: 195, protein: 27.0, carbs: 2.0, fat: 8.0, fiber: 0, sugar: 1.0, sodium: 0.6 },
{ id: 'tandoori-chicken', name: 'Tandoori Chicken', category: 'Meat', calories: 180, protein: 28.0, carbs: 1.0, fat: 7.0, fiber: 0, sugar: 0.5, sodium: 0.65 },
{ id: 'mutton-keema', name: 'Mutton Keema', category: 'Meat', calories: 290, protein: 22.0, carbs: 4.0, fat: 22.0, fiber: 1.0, sugar: 1.5, sodium: 0.6 },

// Punjabi Breads
{ id: 'butter-naan', name: 'Butter Naan', category: 'Grains', calories: 320, protein: 8.0, carbs: 45.0, fat: 11.0, fiber: 2.0, sugar: 3.0, sodium: 0.6 },
{ id: 'tandoori-roti', name: 'Tandoori Roti', category: 'Grains', calories: 260, protein: 9.0, carbs: 48.0, fat: 4.0, fiber: 5.0, sugar: 1.0, sodium: 0.4 },
{ id: 'missi-roti', name: 'Missi Roti', category: 'Grains', calories: 300, protein: 10.0, carbs: 46.0, fat: 9.0, fiber: 6.0, sugar: 1.2, sodium: 0.45 },

// Punjabi Dairy & Sides
{ id: 'butter-white', name: 'White Butter (Makhan)', category: 'Dairy', calories: 720, protein: 0.5, carbs: 0.1, fat: 81.0, fiber: 0, sugar: 0.1, sodium: 0.6 },
{ id: 'paneer-bhurji', name: 'Paneer Bhurji', category: 'Dairy', calories: 260, protein: 14.0, carbs: 8.0, fat: 18.0, fiber: 2.0, sugar: 3.0, sodium: 0.5 },

// Punjabi Snacks & Street Food
{ id: 'amritsari-kulcha', name: 'Amritsari Kulcha', category: 'Snacks', calories: 340, protein: 9.0, carbs: 50.0, fat: 12.0, fiber: 3.0, sugar: 2.0, sodium: 0.6 },
{ id: 'chole-kulche', name: 'Chole Kulche', category: 'Snacks', calories: 280, protein: 10.0, carbs: 40.0, fat: 9.0, fiber: 6.0, sugar: 3.0, sodium: 0.55 },
{ id: 'paneer-pakora', name: 'Paneer Pakora', category: 'Snacks', calories: 310, protein: 10.0, carbs: 22.0, fat: 20.0, fiber: 2.5, sugar: 2.0, sodium: 0.5 },

// Punjabi Sweets
{ id: 'kheer', name: 'Rice Kheer', category: 'Sweets', calories: 160, protein: 4.0, carbs: 22.0, fat: 6.0, fiber: 0.5, sugar: 15.0, sodium: 0.1 },
{ id: 'pinni', name: 'Pinni', category: 'Sweets', calories: 480, protein: 9.0, carbs: 40.0, fat: 32.0, fiber: 3.0, sugar: 25.0, sodium: 0.1 },
{ id: 'atta-halwa', name: 'Atta Halwa', category: 'Sweets', calories: 390, protein: 6.0, carbs: 48.0, fat: 18.0, fiber: 2.0, sugar: 28.0, sodium: 0.12 },

// Punjabi Beverages
{ id: 'lassi-salted', name: 'Lassi (Salted)', category: 'Beverages', calories: 65, protein: 3.5, carbs: 4.5, fat: 3.0, fiber: 0, sugar: 4.0, sodium: 0.25 },
{ id: 'chaas', name: 'Chaas (Buttermilk)', category: 'Beverages', calories: 40, protein: 2.0, carbs: 3.0, fat: 1.5, fiber: 0, sugar: 3.0, sodium: 0.15 },

// =======================
// GYM & FITNESS FOODS
// =======================

// High-Protein Vegetarian
{ id: 'tofu', name: 'Tofu', category: 'Protein', calories: 76, protein: 8.0, carbs: 1.9, fat: 4.8, fiber: 0.3, sugar: 0.3, sodium: 0.007 },
{ id: 'soy-chunks', name: 'Soy Chunks', category: 'Protein', calories: 345, protein: 52.0, carbs: 33.0, fat: 0.5, fiber: 13.0, sugar: 7.0, sodium: 0.02 },
{ id: 'boiled-chickpeas', name: 'Boiled Chickpeas', category: 'Protein', calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, sugar: 4.8, sodium: 0.01 },
{ id: 'sprouts-mixed', name: 'Mixed Sprouts', category: 'Protein', calories: 105, protein: 7.5, carbs: 18.0, fat: 0.8, fiber: 4.0, sugar: 2.0, sodium: 0.01 },
{ id: 'low-fat-paneer', name: 'Low Fat Paneer', category: 'Protein', calories: 145, protein: 20.0, carbs: 3.0, fat: 6.0, fiber: 0, sugar: 1.5, sodium: 0.15 },

// High-Protein Non-Veg
{ id: 'egg-whites', name: 'Egg Whites', category: 'Protein', calories: 52, protein: 11.0, carbs: 0.7, fat: 0.2, fiber: 0, sugar: 0.7, sodium: 0.166 },
{ id: 'chicken-boiled', name: 'Chicken (Boiled)', category: 'Protein', calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 0.074 },
{ id: 'chicken-grilled', name: 'Chicken (Grilled)', category: 'Protein', calories: 170, protein: 30.0, carbs: 0, fat: 4.0, fiber: 0, sugar: 0, sodium: 0.08 },
{ id: 'fish-grilled', name: 'Grilled Fish', category: 'Protein', calories: 140, protein: 22.0, carbs: 0, fat: 5.0, fiber: 0, sugar: 0, sodium: 0.06 },
{ id: 'tuna', name: 'Tuna (Canned in Water)', category: 'Protein', calories: 116, protein: 26.0, carbs: 0, fat: 1.0, fiber: 0, sugar: 0, sodium: 0.3 },

// Complex Carbohydrates
{ id: 'oats', name: 'Oats', category: 'Grains', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, sugar: 0.9, sodium: 0.002 },
{ id: 'sweet-potato', name: 'Sweet Potato (Boiled)', category: 'Grains', calories: 90, protein: 2.0, carbs: 21.0, fat: 0.1, fiber: 3.3, sugar: 6.5, sodium: 0.036 },
{ id: 'quinoa', name: 'Quinoa (Cooked)', category: 'Grains', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 0.007 },
{ id: 'brown-bread', name: 'Brown Bread', category: 'Grains', calories: 247, protein: 13.0, carbs: 41.0, fat: 4.2, fiber: 7.0, sugar: 6.0, sodium: 0.49 },
{ id: 'millet-roti', name: 'Millet Roti (Bajra/Jowar)', category: 'Grains', calories: 290, protein: 8.0, carbs: 55.0, fat: 5.0, fiber: 8.0, sugar: 1.5, sodium: 0.01 },

// Healthy Fats
{ id: 'almonds', name: 'Almonds', category: 'Healthy Fats', calories: 579, protein: 21.0, carbs: 22.0, fat: 50.0, fiber: 12.5, sugar: 4.4, sodium: 0.001 },
{ id: 'walnuts', name: 'Walnuts', category: 'Healthy Fats', calories: 654, protein: 15.0, carbs: 14.0, fat: 65.0, fiber: 6.7, sugar: 2.6, sodium: 0.002 },
{ id: 'peanut-butter', name: 'Peanut Butter (Natural)', category: 'Healthy Fats', calories: 588, protein: 25.0, carbs: 20.0, fat: 50.0, fiber: 6.0, sugar: 9.0, sodium: 0.4 },
{ id: 'flax-seeds', name: 'Flax Seeds', category: 'Healthy Fats', calories: 534, protein: 18.0, carbs: 29.0, fat: 42.0, fiber: 27.0, sugar: 1.5, sodium: 0.03 },
{ id: 'chia-seeds', name: 'Chia Seeds', category: 'Healthy Fats', calories: 486, protein: 17.0, carbs: 42.0, fat: 31.0, fiber: 34.0, sugar: 0, sodium: 0.016 },

// Gym-Friendly Vegetables
{ id: 'broccoli', name: 'Broccoli', category: 'Vegetables', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 0.033 },
{ id: 'bell-pepper', name: 'Bell Pepper', category: 'Vegetables', calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3, fiber: 2.1, sugar: 4.2, sodium: 0.004 },
{ id: 'zucchini', name: 'Zucchini', category: 'Vegetables', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1.0, sugar: 2.5, sodium: 0.008 },

// Pre / Post Workout
{ id: 'banana-peanut-butter', name: 'Banana with Peanut Butter', category: 'Snacks', calories: 210, protein: 6.0, carbs: 27.0, fat: 9.0, fiber: 3.0, sugar: 14.0, sodium: 0.12 },
{ id: 'protein-smoothie', name: 'Protein Smoothie (Milk + Banana)', category: 'Beverages', calories: 180, protein: 12.0, carbs: 22.0, fat: 4.0, fiber: 2.5, sugar: 16.0, sodium: 0.15 },
{ id: 'boiled-eggs-snack', name: 'Boiled Eggs (2)', category: 'Snacks', calories: 155, protein: 13.0, carbs: 1.1, fat: 11.0, fiber: 0, sugar: 1.1, sodium: 0.124 },
// =======================
// DAILY ROUTINE FOODS
// =======================

// Breakfast & Light Meals
{ id: 'vegetable-oats', name: 'Vegetable Oats', category: 'Grains', calories: 180, protein: 6.0, carbs: 30.0, fat: 4.0, fiber: 4.0, sugar: 2.0, sodium: 0.3 },
{ id: 'vegetable-omelette', name: 'Vegetable Omelette', category: 'Eggs', calories: 170, protein: 12.0, carbs: 4.0, fat: 12.0, fiber: 1.0, sugar: 2.0, sodium: 0.35 },
{ id: 'besan-chilla', name: 'Besan Chilla', category: 'Snacks', calories: 220, protein: 9.0, carbs: 22.0, fat: 10.0, fiber: 4.0, sugar: 2.0, sodium: 0.4 },
{ id: 'vegetable-sandwich', name: 'Vegetable Sandwich (Brown Bread)', category: 'Snacks', calories: 210, protein: 7.0, carbs: 34.0, fat: 6.0, fiber: 5.0, sugar: 4.0, sodium: 0.45 },
{ id: 'curd-fruit-bowl', name: 'Curd with Fruits', category: 'Dairy', calories: 120, protein: 4.0, carbs: 16.0, fat: 3.0, fiber: 2.0, sugar: 12.0, sodium: 0.05 },

// Daily Lunch Items
{ id: 'plain-rice', name: 'Plain Rice', category: 'Grains', calories: 130, protein: 2.5, carbs: 28.0, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 0.001 },
{ id: 'vegetable-pulao', name: 'Vegetable Pulao', category: 'Grains', calories: 180, protein: 4.0, carbs: 32.0, fat: 4.5, fiber: 3.0, sugar: 2.0, sodium: 0.4 },
{ id: 'curd-rice', name: 'Curd Rice', category: 'Grains', calories: 150, protein: 4.0, carbs: 22.0, fat: 4.0, fiber: 1.0, sugar: 3.0, sodium: 0.35 },
{ id: 'veg-khichdi', name: 'Vegetable Khichdi', category: 'Grains', calories: 160, protein: 6.0, carbs: 26.0, fat: 3.5, fiber: 4.0, sugar: 1.5, sodium: 0.3 },
{ id: 'plain-dal', name: 'Plain Dal', category: 'Pulses', calories: 120, protein: 7.0, carbs: 20.0, fat: 2.0, fiber: 5.0, sugar: 1.5, sodium: 0.3 },

// Sabzi / Vegetables (Daily Home Style)
{ id: 'lauki-sabzi', name: 'Lauki Sabzi', category: 'Vegetables', calories: 60, protein: 1.5, carbs: 7.0, fat: 2.5, fiber: 2.0, sugar: 3.0, sodium: 0.25 },
{ id: 'tori-sabzi', name: 'Tori Sabzi', category: 'Vegetables', calories: 70, protein: 1.8, carbs: 8.0, fat: 3.0, fiber: 2.2, sugar: 3.5, sodium: 0.25 },
{ id: 'cabbage-sabzi', name: 'Cabbage Sabzi', category: 'Vegetables', calories: 90, protein: 2.0, carbs: 10.0, fat: 4.0, fiber: 3.0, sugar: 3.0, sodium: 0.3 },
{ id: 'beans-sabzi', name: 'Green Beans Sabzi', category: 'Vegetables', calories: 80, protein: 2.5, carbs: 10.0, fat: 3.0, fiber: 3.5, sugar: 2.5, sodium: 0.25 },

// Evening Snacks (Office / Home)
{ id: 'roasted-makhana', name: 'Roasted Makhana', category: 'Snacks', calories: 110, protein: 4.0, carbs: 17.0, fat: 3.0, fiber: 3.0, sugar: 0.5, sodium: 0.2 },
{ id: 'roasted-peanuts', name: 'Roasted Peanuts', category: 'Snacks', calories: 170, protein: 7.0, carbs: 6.0, fat: 14.0, fiber: 2.5, sugar: 1.0, sodium: 0.2 },
{ id: 'corn-chat', name: 'Boiled Corn Chaat', category: 'Snacks', calories: 140, protein: 4.0, carbs: 26.0, fat: 2.5, fiber: 3.5, sugar: 3.0, sodium: 0.35 },
{ id: 'fruit-salad', name: 'Mixed Fruit Salad', category: 'Fruits', calories: 95, protein: 1.5, carbs: 22.0, fat: 0.5, fiber: 3.0, sugar: 16.0, sodium: 0.01 },

// Dinner Items
{ id: 'veg-curry', name: 'Mixed Vegetable Curry', category: 'Vegetables', calories: 140, protein: 4.0, carbs: 14.0, fat: 7.0, fiber: 4.0, sugar: 4.0, sodium: 0.4 },
{ id: 'egg-curry', name: 'Egg Curry', category: 'Eggs', calories: 190, protein: 13.0, carbs: 6.0, fat: 13.0, fiber: 1.0, sugar: 3.0, sodium: 0.45 },
{ id: 'chicken-stir-fry', name: 'Chicken Stir Fry', category: 'Meat', calories: 200, protein: 26.0, carbs: 4.0, fat: 9.0, fiber: 1.0, sugar: 2.0, sodium: 0.5 },
{ id: 'paneer-curry-light', name: 'Paneer Curry (Light)', category: 'Dairy', calories: 220, protein: 14.0, carbs: 8.0, fat: 15.0, fiber: 2.0, sugar: 3.0, sodium: 0.45 },

// Late Night / Light Options
{ id: 'turmeric-milk', name: 'Turmeric Milk', category: 'Beverages', calories: 90, protein: 3.5, carbs: 6.0, fat: 4.0, fiber: 0, sugar: 5.0, sodium: 0.05 },
{ id: 'warm-milk', name: 'Warm Milk', category: 'Beverages', calories: 60, protein: 3.2, carbs: 4.8, fat: 3.0, fiber: 0, sugar: 4.8, sodium: 0.04 },
{ id: 'herbal-tea', name: 'Herbal Tea', category: 'Beverages', calories: 5, protein: 0, carbs: 1.0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }

];

export const foodApiService = {
  async searchFood(query) {
    const results = [];
    const lowerQuery = query.toLowerCase().trim();

    // First, search in Indian food database
    const indianResults = indianFoodDatabase.filter(food => 
      food.name.toLowerCase().includes(lowerQuery) ||
      food.category.toLowerCase().includes(lowerQuery)
    );

    // Format Indian food results
    indianResults.forEach(food => {
      results.push({
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
      });
    });

    // Return Indian food results (USDA API disabled to avoid rate limits)
    // You can enable USDA by getting a free API key from https://fdc.nal.usda.gov/api-key-signup.html

    // Remove duplicates and return
    const uniqueResults = results.filter((food, index, self) =>
      index === self.findIndex(f => f.name.toLowerCase() === food.name.toLowerCase())
    );

    return uniqueResults.slice(0, 20);
  },

  async getFoodByBarcode(barcode) {
    // Barcode search not available in USDA, return null
    return null;
  },

  // Get all Indian foods by category
  getIndianFoodsByCategory(category) {
    if (!category) return indianFoodDatabase;
    
    return indianFoodDatabase.filter(food => 
      food.category.toLowerCase() === category.toLowerCase()
    );
  },

  // Get all categories
  getCategories() {
    return [...new Set(indianFoodDatabase.map(food => food.category))];
  },

  // Search only in Indian database
  searchIndianFood(query) {
    const lowerQuery = query.toLowerCase().trim();
    
    return indianFoodDatabase
      .filter(food => 
        food.name.toLowerCase().includes(lowerQuery) ||
        food.category.toLowerCase().includes(lowerQuery)
      )
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
};
