'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Meal {
  id: string
  user_id: string
  meal_type_id: string
  image_url: string
  meal_name: string
  calories: number | null
  protein: number | null
  fat: number | null
  carbs: number | null
  memo: string | null
  recorded_at: string
  created_at: string
  updated_at: string
  meal_types?: {
    id: string
    name: string
  }
}

export interface CreateMealData {
  meal_type_id: string
  image_url: string
  meal_name: string
  calories?: number
  protein?: number
  fat?: number
  carbs?: number
  memo?: string
  recorded_at?: string
}

export interface UpdateMealData {
  meal_type_id?: string
  meal_name?: string
  calories?: number
  protein?: number
  fat?: number
  carbs?: number
  memo?: string
  recorded_at?: string
}

export function useMeals() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchMeals = useCallback(async (params?: {
    date?: string
    mealTypeId?: string
    limit?: number
    offset?: number
  }) => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      if (params?.date) searchParams.append('date', params.date)
      if (params?.mealTypeId) searchParams.append('meal_type_id', params.mealTypeId)
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.offset) searchParams.append('offset', params.offset.toString())

      const response = await fetch(`/api/meals?${searchParams}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch meals')
      }

      return data.meals as Meal[]
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch meals'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMeal = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/meals/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch meal')
      }

      return data.meal as Meal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch meal'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createMeal = useCallback(async (mealData: CreateMealData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create meal')
      }

      return data.meal as Meal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create meal'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateMeal = useCallback(async (id: string, mealData: UpdateMealData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/meals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update meal')
      }

      return data.meal as Meal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update meal'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteMeal = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/meals/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete meal')
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete meal'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadImage = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      return data as { url: string; path: string }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    fetchMeals,
    fetchMeal,
    createMeal,
    updateMeal,
    deleteMeal,
    uploadImage,
  }
}