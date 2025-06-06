'use client'

interface MonthlySummaryProps {
  month: Date
  summary: {
    totalMeals: number
    averageCalories: number
    averageProtein: number
    averageFat: number
    averageCarbs: number
  }
}

export default function MonthlySummary({ month, summary }: MonthlySummaryProps) {
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  const formatNumber = (num: number) => {
    return Math.round(num * 10) / 10
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {month.getFullYear()}年{monthNames[month.getMonth()]}の記録
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{summary.totalMeals}</div>
          <div className="text-sm text-gray-500">記録数</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{formatNumber(summary.averageCalories)}</div>
          <div className="text-sm text-gray-500">平均カロリー</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{formatNumber(summary.averageProtein)}g</div>
          <div className="text-sm text-gray-500">平均タンパク質</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{formatNumber(summary.averageFat)}g</div>
          <div className="text-sm text-gray-500">平均脂質</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{formatNumber(summary.averageCarbs)}g</div>
          <div className="text-sm text-gray-500">平均炭水化物</div>
        </div>
      </div>
    </div>
  )
}