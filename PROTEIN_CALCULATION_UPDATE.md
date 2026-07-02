# Protein Calculation Update

## What Was Changed

Updated the protein calculation method in `src/services/dietCalculator.js` from **percentage-based** to **body-weight-based** calculations, which is the scientifically accurate method.

## Previous Method (INCORRECT)
- Protein was calculated as a percentage of total calories
- Maintain: 30% of calories
- Lose Weight: 35% of calories  
- Gain Weight: 30% of calories

**Problem**: This method doesn't account for individual body weight and can result in inadequate or excessive protein intake.

## New Method (SCIENTIFICALLY ACCURATE)

Protein is now calculated based on **grams per kilogram of body weight (g/kg)**:

### Maintain Weight
- **1.4 g/kg body weight**
- Based on research showing 1.2-1.6 g/kg is optimal for maintenance
- Example: 70kg person = 98g protein/day

### Lose Weight (Fat Loss)
- **Lean individuals (BMI < 25)**: 2.0 g/kg
- **Overweight individuals (BMI ≥ 25)**: 1.6 g/kg
- Higher protein preserves muscle mass during calorie deficit
- Based on research showing 1.6-2.4 g/kg optimal for fat loss
- Example: 70kg lean person = 140g protein/day

### Gain Weight (Muscle Building)
- **1.8 g/kg body weight**
- Based on research showing 1.6-2.2 g/kg optimal for muscle gain
- Example: 70kg person = 126g protein/day

## Scientific Basis

These values are based on:
- International Society of Sports Nutrition position stands
- Meta-analyses from Examine.com
- Studies using IAAO (Indicator Amino Acid Oxidation) technique
- Research showing protein requirements should be based on body weight, not caloric intake

## Macro Distribution

The new calculation:
1. **Protein**: Calculated first based on body weight (g/kg)
2. **Fat**: 25-30% of total calories (depending on goal)
3. **Carbs**: Remaining calories after protein and fat

This ensures adequate protein intake regardless of total calorie target.

## Example Comparison

For a 70kg person with 2500 TDEE maintaining weight:

**Old Method**:
- Protein: 30% of 2500 cal = 188g (too high)

**New Method**:
- Protein: 70kg × 1.4 = 98g (scientifically optimal)
- More calories available for carbs and fat
- Better balanced macros

## References

- Morton RW et al., 2018, British Journal of Sports Medicine
- Examine.com Optimal Protein Intake Guide
- International Society of Sports Nutrition (ISSN) recommendations
- American College of Sports Medicine position stands
