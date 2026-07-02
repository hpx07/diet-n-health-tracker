/**
 * Diet Calculator Service
 * 
 * Protein calculations based on scientific research:
 * - Maintenance: 1.2-1.6 g/kg body weight (using 1.4 g/kg)
 * - Fat Loss: 1.6-2.4 g/kg (using 2.0 g/kg for lean, 1.6 g/kg for overweight)
 * - Muscle Gain: 1.6-2.2 g/kg (using 1.8 g/kg)
 * 
 * Sources: International Society of Sports Nutrition, Examine.com meta-analyses
 * 
 * Note: Protein is calculated based on body weight (g/kg), NOT as a percentage
 * of calories, which is the scientifically accurate method.
 */

export const dietCalculator = {
  calculateBMI(weight, height) {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  },

  getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  },

  calculateBMR(weight, height, age, gender) {
    // Mifflin-St Jeor Equation
    // weight in kg, height in cm
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  },

  calculateTDEE(bmr, activityLevel) {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    return bmr * (multipliers[activityLevel] || 1.2);
  },

  calculateMacros(tdee, goal, weight, bmi) {
    let calories = tdee;
    let proteinGramsPerKg = 1.6; // Default for muscle gain/fat loss
    let fatPercent = 0.25; // 25% of calories from fat

    switch (goal) {
      case 'lose':
        calories = tdee - 500; // 500 calorie deficit
        // Higher protein for fat loss to preserve muscle (1.6-2.4 g/kg)
        // Use 2.0 g/kg for optimal muscle preservation during deficit
        proteinGramsPerKg = bmi >= 25 ? 1.6 : 2.0; // Lower for overweight, higher for lean
        fatPercent = 0.25;
        break;
      case 'gain':
        calories = tdee + 500; // 500 calorie surplus
        // Optimal for muscle gain (1.6-2.2 g/kg)
        proteinGramsPerKg = 1.8;
        fatPercent = 0.25;
        break;
      case 'maintain':
      default:
        calories = tdee;
        // Maintenance (1.2-1.6 g/kg)
        proteinGramsPerKg = 1.4;
        fatPercent = 0.30;
        break;
    }

    // Calculate protein based on body weight (scientifically accurate)
    const proteinGrams = Math.round(weight * proteinGramsPerKg);
    const proteinCalories = proteinGrams * 4;

    // Calculate fat based on percentage of total calories
    const fatGrams = Math.round((calories * fatPercent) / 9);
    const fatCalories = fatGrams * 9;

    // Remaining calories go to carbs
    const carbCalories = calories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);

    return {
      calories: Math.round(calories),
      protein: proteinGrams,
      carbs: Math.max(carbGrams, 0), // Ensure non-negative
      fat: fatGrams
    };
  },

  generateDietPlan(userProfile, goal) {
    // Profile values come from form inputs and may be strings
    const weight = Number(userProfile.weight);
    const height = Number(userProfile.height);
    const age = Number(userProfile.age);
    const { gender, activityLevel } = userProfile;

    const bmi = this.calculateBMI(weight, height);
    const bmr = this.calculateBMR(weight, height, age, gender);
    const tdee = this.calculateTDEE(bmr, activityLevel);
    const macros = this.calculateMacros(tdee, goal, weight, bmi);

    return {
      bmi: bmi.toFixed(1),
      bmiCategory: this.getBMICategory(bmi),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: macros.calories,
      macros: macros,
      recommendations: this.getDietRecommendations(bmi, goal)
    };
  },

  getDietRecommendations(bmi, goal) {
    const recommendations = [];

    if (bmi < 18.5) {
      recommendations.push('Focus on nutrient-dense, calorie-rich foods');
      recommendations.push('Include healthy fats like nuts, avocados, and olive oil');
      recommendations.push('Eat frequent, smaller meals throughout the day');
    } else if (bmi >= 30) {
      recommendations.push('Focus on whole, unprocessed foods');
      recommendations.push('Increase vegetable and lean protein intake');
      recommendations.push('Limit refined carbs and added sugars');
      recommendations.push('Practice portion control');
    } else {
      recommendations.push('Maintain a balanced diet with variety');
      recommendations.push('Stay hydrated with 8-10 glasses of water daily');
      recommendations.push('Include fruits and vegetables in every meal');
    }

    if (goal === 'lose') {
      recommendations.push('Create a moderate calorie deficit');
      recommendations.push('Prioritize protein to preserve muscle mass');
      recommendations.push('Include fiber-rich foods for satiety');
    } else if (goal === 'gain') {
      recommendations.push('Eat in a slight calorie surplus');
      recommendations.push('Focus on strength training alongside diet');
      recommendations.push('Include complex carbs for energy');
    }

    return recommendations;
  },

  analyzeDailyIntake(entries, targetMacros) {
    const totals = entries.reduce((acc, entry) => {
      if (!entry.nutrition) return acc;
      const multiplier = (Number(entry.quantity) || 100) / 100;
      acc.calories += (entry.nutrition.calories || 0) * multiplier;
      acc.protein += (entry.nutrition.protein || 0) * multiplier;
      acc.carbs += (entry.nutrition.carbs || 0) * multiplier;
      acc.fat += (entry.nutrition.fat || 0) * multiplier;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const percentOf = (value, target) =>
      target > 0 ? Math.round((value / target) * 100) : 0;

    return {
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fat: Math.round(totals.fat)
      },
      percentages: {
        calories: percentOf(totals.calories, targetMacros.calories),
        protein: percentOf(totals.protein, targetMacros.protein),
        carbs: percentOf(totals.carbs, targetMacros.carbs),
        fat: percentOf(totals.fat, targetMacros.fat)
      },
      remaining: {
        calories: targetMacros.calories - Math.round(totals.calories),
        protein: targetMacros.protein - Math.round(totals.protein),
        carbs: targetMacros.carbs - Math.round(totals.carbs),
        fat: targetMacros.fat - Math.round(totals.fat)
      }
    };
  }
};
