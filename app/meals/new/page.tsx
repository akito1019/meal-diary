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
  const { showToast } = useToast()

  const handleSubmit = async (data: CreateMealData) => {
    try {
      await createMeal(data)
      showToast('食事を記録しました', 'success')
      router.push('/')
    } catch (error) {
      showToast('食事の記録に失敗しました', 'error')
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