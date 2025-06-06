'use client'

import Link from 'next/link'

interface Meal {
  id: string
  mealName: string
  mealTypeName: string
  imageUrl?: string
  calories: number
  protein: number
  fat: number
  carbs: number
  recordedAt: string
}

interface DailyMealListProps {
  date: Date
  meals: Meal[]
}

export default function DailyMealList({ date, meals }: DailyMealListProps) {
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const getTotalNutrition = () => {
    return meals.reduce(
      (total, meal) => ({
        calories: total.calories + meal.calories,
        protein: total.protein + meal.protein,
        fat: total.fat + meal.fat,
        carbs: total.carbs + meal.carbs,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    )
  }

  const total = getTotalNutrition()

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {formatDate(date)}の記録
        </h3>
        {meals.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{total.calories}</div>
              <div className="text-gray-500">kcal</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{Math.round(total.protein * 10) / 10}g</div>
              <div className="text-gray-500">P</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">{Math.round(total.fat * 10) / 10}g</div>
              <div className="text-gray-500">F</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">{Math.round(total.carbs * 10) / 10}g</div>
              <div className="text-gray-500">C</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        {meals.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">この日の記録はありません</p>
            <Link
              href="/meals/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              食事を記録する
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <Link
                key={meal.id}
                href={`/meals/${meal.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {meal.imageUrl ? (
                    <img
                      src={meal.imageUrl}
                      alt={meal.mealName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{meal.mealName}</h4>
                      <span className="text-sm text-gray-500">{formatTime(meal.recordedAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{meal.mealTypeName}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span>{meal.calories}kcal</span>
                      <span className="text-red-600">P:{Math.round(meal.protein * 10) / 10}g</span>
                      <span className="text-yellow-600">F:{Math.round(meal.fat * 10) / 10}g</span>
                      <span className="text-purple-600">C:{Math.round(meal.carbs * 10) / 10}g</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}