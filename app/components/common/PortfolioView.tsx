'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

interface PortfolioViewProps {
  meals: Meal[]
  hasMore: boolean
  onLoadMore: () => void
  loading?: boolean
  filterMealType?: string
  onFilterChange?: (mealType: string) => void
  mealTypes?: Array<{ id: string; name: string }>
}

export default function PortfolioView({
  meals,
  hasMore,
  onLoadMore,
  loading = false,
  filterMealType = '',
  onFilterChange,
  mealTypes = []
}: PortfolioViewProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const observer = useRef<IntersectionObserver | null>(null)

  const lastMealElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore()
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore, onLoadMore])

  const handleImageError = (mealId: string) => {
    setImageErrors(prev => new Set([...prev, mealId]))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '今日'
    if (diffDays === 2) return '昨日'
    if (diffDays <= 7) return `${diffDays - 1}日前`
    
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      {mealTypes.length > 0 && onFilterChange && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange('')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filterMealType === ''
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          {mealTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onFilterChange(type.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filterMealType === type.id
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {meals.map((meal, index) => {
          const isLast = meals.length === index + 1
          return (
            <div
              key={meal.id}
              ref={isLast ? lastMealElementRef : null}
              className="group"
            >
              <Link href={`/meals/${meal.id}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="aspect-square relative overflow-hidden">
                    {meal.imageUrl && !imageErrors.has(meal.id) ? (
                      <Image
                        src={meal.imageUrl}
                        alt={meal.mealName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={() => handleImageError(meal.id)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                    
                    {/* Date badge */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {formatDate(meal.recordedAt)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                      {meal.mealName}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{meal.mealTypeName}</p>
                    
                    {/* Nutrition info */}
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{meal.calories}</div>
                        <div className="text-gray-500">kcal</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-600">{Math.round(meal.protein * 10) / 10}g</div>
                        <div className="text-gray-500">P</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* No more items message */}
      {!hasMore && meals.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">すべての記録を表示しました</p>
        </div>
      )}

      {/* Empty state */}
      {meals.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">記録がありません</h3>
          <p className="text-gray-500 mb-6">最初の食事記録を追加してみましょう</p>
          <Link
            href="/meals/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            食事を記録する
          </Link>
        </div>
      )}
    </div>
  )
}