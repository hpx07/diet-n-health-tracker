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

  calculateMacros(tdee, goal) {
    let calories = tdee;
    let proteinPercent = 0.3;
    let carbsPercent = 0.4;
    let fatPercent = 0.3;

    switch (goal) {
      case 'lose':
        calories = tdee - 500; // 500 calorie deficit
        proteinPercent = 0.35;
        carbsPercent = 0.35;
        fatPercent = 0.3;
        break;
      case 'gain':
        calories = tdee + 500; // 500 calorie surplus
        proteinPercent = 0.3;
        carbsPercent = 0.45;
        fatPercent = 0.25;
        break;
      case 'maintain':
      default:
        calories = tdee;
        break;
    }

    return {
      calories: Math.round(calories),
      protein: Math.round((calories * proteinPercent) / 4), // 4 cal per gram
      carbs: Math.round((calories * carbsPercent) / 4),
      fat: Math.round((calories * fatPercent) / 9) // 9 cal per gram
    };
  },

  generateDietPlan(userProfile, goal) {
    const { weight, height, age, gender, activityLevel } = userProfile;
    
    const bmi = this.calculateBMI(weight, height);
    const bmr = this.calculateBMR(weight, height, age, gender);
    const tdee = this.calculateTDEE(bmr, activityLevel);
    const macros = this.calculateMacros(tdee, goal);

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
      acc.calories += entry.nutrition.calories * (entry.quantity / 100);
      acc.protein += entry.nutrition.protein * (entry.quantity / 100);
      acc.carbs += entry.nutrition.carbs * (entry.quantity / 100);
      acc.fat += entry.nutrition.fat * (entry.quantity / 100);
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return {
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fat: Math.round(totals.fat)
      },
      percentages: {
        calories: Math.round((totals.calories / targetMacros.calories) * 100),
        protein: Math.round((totals.protein / targetMacros.protein) * 100),
        carbs: Math.round((totals.carbs / targetMacros.carbs) * 100),
        fat: Math.round((totals.fat / targetMacros.fat) * 100)
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
