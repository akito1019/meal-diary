'use client';

import { calculateCalories, CalorieCalculationResult } from '@/utils/nutrition';
import { useMemo } from 'react';

interface NutritionDisplayProps {
  protein: number;
  carbs: number;
  fat: number;
  showBreakdown?: boolean;
  className?: string;
}

export default function NutritionDisplay({
  protein,
  carbs,
  fat,
  showBreakdown = false,
  className = ''
}: NutritionDisplayProps) {
  const calculation: CalorieCalculationResult = useMemo(() => {
    return calculateCalories({ protein, carbs, fat });
  }, [protein, carbs, fat]);

  if (showBreakdown) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{calculation.calories}</div>
            <div className="text-sm text-gray-500">総カロリー</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-blue-600">{protein.toFixed(1)}g</div>
            <div className="text-sm text-gray-500">タンパク質</div>
            <div className="text-xs text-gray-400">{calculation.breakdown.protein.calories}kcal</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-green-600">{carbs.toFixed(1)}g</div>
            <div className="text-sm text-gray-500">炭水化物</div>
            <div className="text-xs text-gray-400">{calculation.breakdown.carbs.calories}kcal</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-yellow-600">{fat.toFixed(1)}g</div>
            <div className="text-sm text-gray-500">脂質</div>
            <div className="text-xs text-gray-400">{calculation.breakdown.fat.calories}kcal</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>マクロ栄養素の割合</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="h-full flex">
              <div 
                className="bg-blue-500"
                style={{ width: `${calculation.breakdown.protein.percentage}%` }}
                title={`タンパク質 ${calculation.breakdown.protein.percentage}%`}
              />
              <div 
                className="bg-green-500"
                style={{ width: `${calculation.breakdown.carbs.percentage}%` }}
                title={`炭水化物 ${calculation.breakdown.carbs.percentage}%`}
              />
              <div 
                className="bg-yellow-500"
                style={{ width: `${calculation.breakdown.fat.percentage}%` }}
                title={`脂質 ${calculation.breakdown.fat.percentage}%`}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>P: {calculation.breakdown.protein.percentage}%</span>
            <span>C: {calculation.breakdown.carbs.percentage}%</span>
            <span>F: {calculation.breakdown.fat.percentage}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{calculation.calories}</div>
        <div className="text-xs text-gray-500">kcal</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{protein.toFixed(1)}</div>
        <div className="text-xs text-gray-500">タンパク質(g)</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{carbs.toFixed(1)}</div>
        <div className="text-xs text-gray-500">炭水化物(g)</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{fat.toFixed(1)}</div>
        <div className="text-xs text-gray-500">脂質(g)</div>
      </div>
    </div>
  );
}