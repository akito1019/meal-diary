'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  meals?: { [key: string]: { count: number; thumbnail?: string } }
}

export default function Calendar({ selectedDate, onDateSelect, meals = {} }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  const weekDays = ['日', '月', '火', '水', '木', '金', '土']

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 md:h-16" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dateKey = formatDateKey(date)
      const isSelected = dateKey === formatDateKey(selectedDate)
      const isToday = dateKey === formatDateKey(new Date())
      const mealData = meals[dateKey]

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={`h-12 md:h-16 p-1 text-sm border border-gray-200 hover:bg-gray-50 transition-colors ${
            isSelected
              ? 'bg-green-100 border-green-300 text-green-700'
              : isToday
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'text-gray-700'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <span className="font-medium">{day}</span>
            {mealData && mealData.count > 0 && (
              <div className="flex items-center space-x-1 mt-1">
                {mealData.thumbnail ? (
                  <Image
                    src={mealData.thumbnail}
                    alt="meal"
                    width={12}
                    height={12}
                    className="w-3 h-3 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
                <span className="text-xs text-gray-500">{mealData.count}</span>
              </div>
            )}
          </div>
        </button>
      )
    }

    return days
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900">
          {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {renderCalendarDays()}
      </div>
    </div>
  )
}