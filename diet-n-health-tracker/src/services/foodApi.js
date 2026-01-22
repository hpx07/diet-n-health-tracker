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
  { id: 'coconut-water', name: 'Coconut Water (Nariyal Pani)', category: 'Beverages', calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2, fiber: 1.1, sugar: 2.6, sodium: 0.105 }
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
