export interface NutritionData {
  protein: number;
  carbs: number;
  fat: number;
}

export interface CalorieCalculationResult {
  calories: number;
  proteinCalories: number;
  carbsCalories: number;
  fatCalories: number;
  breakdown: {
    protein: {
      grams: number;
      calories: number;
      percentage: number;
    };
    carbs: {
      grams: number;
      calories: number;
      percentage: number;
    };
    fat: {
      grams: number;
      calories: number;
      percentage: number;
    };
  };
}

export const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9
} as const;

export function calculateCalories(nutrition: NutritionData): CalorieCalculationResult {
  const proteinCalories = nutrition.protein * CALORIES_PER_GRAM.protein;
  const carbsCalories = nutrition.carbs * CALORIES_PER_GRAM.carbs;
  const fatCalories = nutrition.fat * CALORIES_PER_GRAM.fat;
  
  const totalCalories = proteinCalories + carbsCalories + fatCalories;

  return {
    calories: Math.round(totalCalories),
    proteinCalories: Math.round(proteinCalories),
    carbsCalories: Math.round(carbsCalories),
    fatCalories: Math.round(fatCalories),
    breakdown: {
      protein: {
        grams: nutrition.protein,
        calories: Math.round(proteinCalories),
        percentage: totalCalories > 0 ? Math.round((proteinCalories / totalCalories) * 100) : 0
      },
      carbs: {
        grams: nutrition.carbs,
        calories: Math.round(carbsCalories),
        percentage: totalCalories > 0 ? Math.round((carbsCalories / totalCalories) * 100) : 0
      },
      fat: {
        grams: nutrition.fat,
        calories: Math.round(fatCalories),
        percentage: totalCalories > 0 ? Math.round((fatCalories / totalCalories) * 100) : 0
      }
    }
  };
}

export function estimatePortionCalories(
  baseCalories: number,
  portionMultiplier: number
): number {
  return Math.round(baseCalories * portionMultiplier);
}

export function estimateNutritionFromCalories(
  targetCalories: number,
  macroPercentages: {
    protein: number;
    carbs: number;
    fat: number;
  }
): NutritionData {
  const proteinCalories = targetCalories * (macroPercentages.protein / 100);
  const carbsCalories = targetCalories * (macroPercentages.carbs / 100);
  const fatCalories = targetCalories * (macroPercentages.fat / 100);

  return {
    protein: Math.round((proteinCalories / CALORIES_PER_GRAM.protein) * 10) / 10,
    carbs: Math.round((carbsCalories / CALORIES_PER_GRAM.carbs) * 10) / 10,
    fat: Math.round((fatCalories / CALORIES_PER_GRAM.fat) * 10) / 10
  };
}

export const COMMON_FOOD_MACROS = {
  rice: { protein: 15, carbs: 75, fat: 10 },
  bread: { protein: 15, carbs: 70, fat: 15 },
  chicken: { protein: 70, carbs: 5, fat: 25 },
  fish: { protein: 65, carbs: 5, fat: 30 },
  vegetables: { protein: 20, carbs: 70, fat: 10 },
  fruits: { protein: 5, carbs: 90, fat: 5 },
  nuts: { protein: 15, carbs: 15, fat: 70 },
  dairy: { protein: 30, carbs: 30, fat: 40 }
} as const;