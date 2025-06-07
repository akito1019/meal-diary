'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import AppLayout from '@/app/components/layout/AppLayout'
import { MealForm } from '@/components/meals/meal-form'
import { useMeals, UpdateMealData, Meal } from '@/hooks/use-meals'
import { useToast } from '@/components/common/Toast'
import { NutritionDisplay } from '@/components/nutrition'

export default function MealDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { fetchMeal, updateMeal, deleteMeal, loading } = useMeals()
  const { showSuccess, showError } = useToast()
  const [meal, setMeal] = useState<Meal | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const loadMeal = useCallback(async () => {
    try {
      const mealData = await fetchMeal(params.id as string)
      setMeal(mealData)
    } catch (error) {
      showError('食事データの読み込みに失敗しました')
      router.push('/')
    }
  }, [fetchMeal, params.id, showError, router])

  useEffect(() => {
    if (params.id) {
      loadMeal()
    }
  }, [params.id, loadMeal])

  const handleUpdate = async (data: UpdateMealData) => {
    if (!meal) return

    try {
      const updatedMeal = await updateMeal(meal.id, data)
      setMeal(updatedMeal)
      setIsEditing(false)
      showSuccess('食事を更新しました')
    } catch (error) {
      showError('食事の更新に失敗しました')
    }
  }

  const handleDelete = async () => {
    if (!meal) return

    try {
      await deleteMeal(meal.id)
      showSuccess('食事を削除しました')
      router.push('/')
    } catch (error) {
      showError('食事の削除に失敗しました')
    }
  }

  if (loading && !meal) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!meal) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            食事が見つかりません
          </h1>
          <button
            onClick={() => router.push('/')}
            className="text-primary-600 hover:text-primary-500"
          >
            ホームに戻る
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? '食事を編集' : '食事詳細'}
          </h1>
          <div className="flex space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  編集
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  削除
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <MealForm
            initialData={{
              mealTypeId: meal.meal_type_id,
              mealName: meal.meal_name,
              calories: meal.calories,
              protein: meal.protein,
              fat: meal.fat,
              carbs: meal.carbs,
              memo: meal.memo || '',
              recordedAt: new Date(meal.recorded_at).toISOString().slice(0, 16),
              imageUrl: meal.image_url,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            submitLabel="更新"
            loading={loading}
          />
        ) : (
          <div className="space-y-6">
            {/* Image */}
            <div className="relative h-64 w-full">
              <Image
                src={meal.image_url}
                alt={meal.meal_name}
                fill
                className="object-cover rounded-lg border border-gray-300"
              />
            </div>

            {/* Basic Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    食事名
                  </label>
                  <p className="text-gray-900">{meal.meal_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    食事タイプ
                  </label>
                  <p className="text-gray-900">{meal.meal_types?.name}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    記録日時
                  </label>
                  <p className="text-gray-900">
                    {new Date(meal.recorded_at).toLocaleString('ja-JP')}
                  </p>
                </div>
              </div>
            </div>

            {/* Nutrition Info */}
            <NutritionDisplay
              protein={meal.protein || 0}
              fat={meal.fat || 0}
              carbs={meal.carbs || 0}
            />

            {/* Memo */}
            {meal.memo && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メモ
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">{meal.memo}</p>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                食事を削除しますか？
              </h3>
              <p className="text-gray-600 mb-6">
                この操作は取り消せません。本当に削除しますか？
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? '削除中...' : '削除'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}