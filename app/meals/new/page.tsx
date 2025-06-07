'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/app/components/layout/AppLayout'
import { MealForm } from '@/components/meals/meal-form'
import { useMeals, CreateMealData } from '@/hooks/use-meals'
import { useToast } from '@/components/common/Toast'

export default function NewMealPage() {
  const router = useRouter()
  const { createMeal, loading } = useMeals()
  const { showSuccess, showError } = useToast()

  const handleSubmit = async (data: CreateMealData) => {
    try {
      await createMeal(data)
      showSuccess('食事を記録しました')
      router.push('/')
    } catch (error) {
      showError('食事の記録に失敗しました')
    }
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          食事を記録する
        </h1>
        
        <MealForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </AppLayout>
  )
}