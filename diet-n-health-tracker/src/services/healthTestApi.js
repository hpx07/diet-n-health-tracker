// Common health tests with normal ranges
export const healthTestsDatabase = [
  {
    id: 'hemoglobin',
    name: 'Hemoglobin',
    category: 'Blood',
    unit: 'g/dL',
    normalRange: { male: { min: 13.5, max: 17.5 }, female: { min: 12.0, max: 15.5 } }
  },
  {
    id: 'wbc',
    name: 'White Blood Cell Count (WBC)',
    category: 'Blood',
    unit: 'cells/μL',
    normalRange: { min: 4000, max: 11000 }
  },
  {
    id: 'rbc',
    name: 'Red Blood Cell Count (RBC)',
    category: 'Blood',
    unit: 'million cells/μL',
    normalRange: { male: { min: 4.7, max: 6.1 }, female: { min: 4.2, max: 5.4 } }
  },
  {
    id: 'platelets',
    name: 'Platelet Count',
    category: 'Blood',
    unit: 'cells/μL',
    normalRange: { min: 150000, max: 450000 }
  },
  {
    id: 'glucose_fasting',
    name: 'Fasting Blood Glucose',
    category: 'Diabetes',
    unit: 'mg/dL',
    normalRange: { min: 70, max: 100 }
  },
  {
    id: 'hba1c',
    name: 'HbA1c (Glycated Hemoglobin)',
    category: 'Diabetes',
    unit: '%',
    normalRange: { min: 4.0, max: 5.6 }
  },
  {
    id: 'cholesterol_total',
    name: 'Total Cholesterol',
    category: 'Lipid Profile',
    unit: 'mg/dL',
    normalRange: { min: 0, max: 200 }
  },
  {
    id: 'ldl',
    name: 'LDL Cholesterol (Bad)',
    category: 'Lipid Profile',
    unit: 'mg/dL',
    normalRange: { min: 0, max: 100 }
  },
  {
    id: 'hdl',
    name: 'HDL Cholesterol (Good)',
    category: 'Lipid Profile',
    unit: 'mg/dL',
    normalRange: { male: { min: 40, max: 999 }, female: { min: 50, max: 999 } }
  },
  {
    id: 'triglycerides',
    name: 'Triglycerides',
    category: 'Lipid Profile',
    unit: 'mg/dL',
    normalRange: { min: 0, max: 150 }
  },
  {
    id: 'tsh',
    name: 'Thyroid Stimulating Hormone (TSH)',
    category: 'Thyroid',
    unit: 'mIU/L',
    normalRange: { min: 0.4, max: 4.0 }
  },
  {
    id: 't3',
    name: 'T3 (Triiodothyronine)',
    category: 'Thyroid',
    unit: 'ng/dL',
    normalRange: { min: 80, max: 200 }
  },
  {
    id: 't4',
    name: 'T4 (Thyroxine)',
    category: 'Thyroid',
    unit: 'μg/dL',
    normalRange: { min: 5.0, max: 12.0 }
  },
  {
    id: 'creatinine',
    name: 'Creatinine',
    category: 'Kidney',
    unit: 'mg/dL',
    normalRange: { male: { min: 0.7, max: 1.3 }, female: { min: 0.6, max: 1.1 } }
  },
  {
    id: 'bun',
    name: 'Blood Urea Nitrogen (BUN)',
    category: 'Kidney',
    unit: 'mg/dL',
    normalRange: { min: 7, max: 20 }
  },
  {
    id: 'alt',
    name: 'ALT (Alanine Aminotransferase)',
    category: 'Liver',
    unit: 'U/L',
    normalRange: { min: 7, max: 56 }
  },
  {
    id: 'ast',
    name: 'AST (Aspartate Aminotransferase)',
    category: 'Liver',
    unit: 'U/L',
    normalRange: { min: 10, max: 40 }
  },
  {
    id: 'vitamin_d',
    name: 'Vitamin D',
    category: 'Vitamins',
    unit: 'ng/mL',
    normalRange: { min: 30, max: 100 }
  },
  {
    id: 'vitamin_b12',
    name: 'Vitamin B12',
    category: 'Vitamins',
    unit: 'pg/mL',
    normalRange: { min: 200, max: 900 }
  },
  {
    id: 'iron',
    name: 'Serum Iron',
    category: 'Minerals',
    unit: 'μg/dL',
    normalRange: { male: { min: 65, max: 175 }, female: { min: 50, max: 170 } }
  },
  {
    id: 'calcium',
    name: 'Calcium',
    category: 'Minerals',
    unit: 'mg/dL',
    normalRange: { min: 8.5, max: 10.5 }
  },
  {
    id: 'blood_pressure_systolic',
    name: 'Blood Pressure (Systolic)',
    category: 'Vital Signs',
    unit: 'mmHg',
    normalRange: { min: 90, max: 120 }
  },
  {
    id: 'blood_pressure_diastolic',
    name: 'Blood Pressure (Diastolic)',
    category: 'Vital Signs',
    unit: 'mmHg',
    normalRange: { min: 60, max: 80 }
  },
  {
    id: 'heart_rate',
    name: 'Heart Rate',
    category: 'Vital Signs',
    unit: 'bpm',
    normalRange: { min: 60, max: 100 }
  }
];

export const healthTestService = {
  searchTests(query) {
    const lowerQuery = query.toLowerCase();
    return healthTestsDatabase.filter(test => 
      test.name.toLowerCase().includes(lowerQuery) ||
      test.category.toLowerCase().includes(lowerQuery)
    );
  },

  getTestById(id) {
    return healthTestsDatabase.find(test => test.id === id);
  },

  getAllCategories() {
    return [...new Set(healthTestsDatabase.map(test => test.category))];
  },

  getTestsByCategory(category) {
    return healthTestsDatabase.filter(test => test.category === category);
  },

  analyzeTestResult(testId, value, gender = 'male') {
    const test = this.getTestById(testId);
    if (!test) return null;

    const range = test.normalRange;
    let status = 'normal';
    let message = '';

    if (range.male && range.female) {
      const genderRange = gender === 'male' ? range.male : range.female;
      if (value < genderRange.min) {
        status = 'low';
        message = `Below normal range (${genderRange.min}-${genderRange.max} ${test.unit})`;
      } else if (value > genderRange.max) {
        status = 'high';
        message = `Above normal range (${genderRange.min}-${genderRange.max} ${test.unit})`;
      } else {
        message = `Within normal range (${genderRange.min}-${genderRange.max} ${test.unit})`;
      }
    } else {
      if (value < range.min) {
        status = 'low';
        message = `Below normal range (${range.min}-${range.max} ${test.unit})`;
      } else if (value > range.max) {
        status = 'high';
        message = `Above normal range (${range.min}-${range.max} ${test.unit})`;
      } else {
        message = `Within normal range (${range.min}-${range.max} ${test.unit})`;
      }
    }

    return { status, message, normalRange: range };
  }
};
