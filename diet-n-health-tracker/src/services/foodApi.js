import axios from 'axios';

const OPENFOODFACTS_API = 'https://world.openfoodfacts.org/api/v2';

export const foodApiService = {
  async searchFood(query) {
    try {
      const response = await axios.get(`${OPENFOODFACTS_API}/search`, {
        params: {
          search_terms: query,
          page_size: 20,
          fields: 'product_name,brands,nutriments,serving_size,code'
        }
      });
      
      return response.data.products.map(product => ({
        id: product.code,
        name: product.product_name || 'Unknown',
        brand: product.brands || '',
        servingSize: product.serving_size || '100g',
        nutrition: {
          calories: product.nutriments['energy-kcal_100g'] || 0,
          protein: product.nutriments.proteins_100g || 0,
          carbs: product.nutriments.carbohydrates_100g || 0,
          fat: product.nutriments.fat_100g || 0,
          fiber: product.nutriments.fiber_100g || 0,
          sugar: product.nutriments.sugars_100g || 0,
          sodium: product.nutriments.sodium_100g || 0
        }
      }));
    } catch (error) {
      console.error('Food search error:', error);
      return [];
    }
  },

  async getFoodByBarcode(barcode) {
    try {
      const response = await axios.get(`${OPENFOODFACTS_API}/product/${barcode}`);
      const product = response.data.product;
      
      if (!product) return null;
      
      return {
        id: product.code,
        name: product.product_name || 'Unknown',
        brand: product.brands || '',
        servingSize: product.serving_size || '100g',
        nutrition: {
          calories: product.nutriments['energy-kcal_100g'] || 0,
          protein: product.nutriments.proteins_100g || 0,
          carbs: product.nutriments.carbohydrates_100g || 0,
          fat: product.nutriments.fat_100g || 0,
          fiber: product.nutriments.fiber_100g || 0,
          sugar: product.nutriments.sugars_100g || 0,
          sodium: product.nutriments.sodium_100g || 0
        }
      };
    } catch (error) {
      console.error('Barcode lookup error:', error);
      return null;
    }
  }
};
