'use client'

import { useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import ViewToggle from './components/common/ViewToggle'
import Calendar from './components/common/Calendar'
import MonthlySummary from './components/common/MonthlySummary'
import DailyMealList from './components/common/DailyMealList'
import PortfolioView from './components/common/PortfolioView'

export default function Home() {
  const [currentView, setCurrentView] = useState<'calendar' | 'portfolio'>('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [portfolioFilter, setPortfolioFilter] = useState('')
  const [portfolioLoading, setPortfolioLoading] = useState(false)

  // Mock data for demonstration
  const mockMeals = {
    '2025-06-06': {
      count: 3,
      thumbnail: '/api/placeholder/40/40'
    },
    '2025-06-05': {
      count: 2,
      thumbnail: '/api/placeholder/40/40'
    }
  }

  const mockDailyMeals = [
    {
      id: '1',
      mealName: 'チキンサラダ',
      mealTypeName: '昼食',
      imageUrl: '/api/placeholder/150/150',
      calories: 350,
      protein: 25,
      fat: 15,
      carbs: 20,
      recordedAt: new Date().toISOString()
    },
    {
      id: '2',
      mealName: 'プロテインスムージー',
      mealTypeName: '間食',
      calories: 200,
      protein: 30,
      fat: 5,
      carbs: 10,
      recordedAt: new Date().toISOString()
    }
  ]

  const mockSummary = {
    totalMeals: 45,
    averageCalories: 1850,
    averageProtein: 85.5,
    averageFat: 65.2,
    averageCarbs: 180.3
  }

  // Mock portfolio data
  const mockPortfolioMeals = Array.from({ length: 20 }, (_, i) => ({
    id: `portfolio-${i + 1}`,
    mealName: i % 3 === 0 ? 'チキンサラダ' : i % 3 === 1 ? 'プロテインスムージー' : 'サーモン弁当',
    mealTypeName: i % 4 === 0 ? '朝食' : i % 4 === 1 ? '昼食' : i % 4 === 2 ? '夕食' : '間食',
    imageUrl: `/api/placeholder/300/300?${i}`,
    calories: 200 + (i * 50),
    protein: 15 + (i * 2),
    fat: 8 + i,
    carbs: 20 + (i * 3),
    recordedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
  }))

  const mockMealTypes = [
    { id: '1', name: '朝食' },
    { id: '2', name: '昼食' },
    { id: '3', name: '夕食' },
    { id: '4', name: '間食' }
  ]

  const handlePortfolioLoadMore = () => {
    setPortfolioLoading(true)
    // Simulate loading more data
    setTimeout(() => {
      setPortfolioLoading(false)
    }, 1000)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header with view toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            食事記録
          </h1>
          <ViewToggle
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        </div>

        {currentView === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                meals={mockMeals}
              />
            </div>
            
            {/* Daily meal list */}
            <div>
              <DailyMealList
                date={selectedDate}
                meals={mockDailyMeals}
              />
            </div>
          </div>
        ) : (
          <PortfolioView
            meals={mockPortfolioMeals}
            hasMore={true}
            onLoadMore={handlePortfolioLoadMore}
            loading={portfolioLoading}
            filterMealType={portfolioFilter}
            onFilterChange={setPortfolioFilter}
            mealTypes={mockMealTypes}
          />
        )}

        {/* Monthly summary */}
        {currentView === 'calendar' && (
          <MonthlySummary
            month={selectedDate}
            summary={mockSummary}
          />
        )}
      </div>
    </AppLayout>
  )
}