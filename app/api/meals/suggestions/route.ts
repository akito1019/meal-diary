import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 5

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    // キーワードを分割して複数のワードで検索
    const keywords = query.split(/\s+/).filter(word => word.length > 0)
    
    // PostgreSQLの全文検索またはILIKE検索を使用
    let searchQuery = supabase
      .from('meals')
      .select(`
        id,
        meal_name,
        calories,
        protein,
        fat,
        carbs,
        image_url,
        recorded_at,
        meal_types (
          id,
          name
        )
      `)
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(limit)

    // キーワードごとにILIKE検索を実行
    for (const keyword of keywords) {
      searchQuery = searchQuery.ilike('meal_name', `%${keyword}%`)
    }

    const { data: meals, error } = await searchQuery

    if (error) {
      console.error('Error fetching meal suggestions:', error)
      return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
    }

    // 類似度スコアを計算（単純なマッチング数ベース）
    const scoredMeals = meals.map(meal => {
      const mealNameLower = meal.meal_name.toLowerCase()
      const queryLower = query.toLowerCase()
      
      // マッチしたキーワード数を計算
      const matchedKeywords = keywords.filter(keyword => 
        mealNameLower.includes(keyword.toLowerCase())
      ).length
      
      // 完全一致ボーナス
      const exactMatch = mealNameLower.includes(queryLower) ? 1 : 0
      
      const score = matchedKeywords + exactMatch
      
      return {
        ...meal,
        similarity_score: score
      }
    })

    // スコア順にソート
    const sortedMeals = scoredMeals
      .filter(meal => meal.similarity_score > 0)
      .sort((a, b) => b.similarity_score - a.similarity_score)

    return NextResponse.json({ suggestions: sortedMeals })
  } catch (error) {
    console.error('Error in meal suggestions GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}