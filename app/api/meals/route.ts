import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const mealTypeId = searchParams.get('meal_type_id')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    let query = supabase
      .from('meals')
      .select(`
        *,
        meal_types (
          id,
          name
        )
      `)
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      query = query
        .gte('recorded_at', startDate.toISOString())
        .lt('recorded_at', endDate.toISOString())
    }

    if (mealTypeId) {
      query = query.eq('meal_type_id', mealTypeId)
    }

    const { data: meals, error } = await query

    if (error) {
      console.error('Error fetching meals:', error)
      return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 })
    }

    return NextResponse.json({ meals })
  } catch (error) {
    console.error('Error in meals GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      meal_type_id,
      image_url,
      meal_name,
      calories,
      protein,
      fat,
      carbs,
      memo,
      recorded_at
    } = body

    // Validation
    if (!meal_type_id || !image_url || !meal_name) {
      return NextResponse.json(
        { error: 'meal_type_id, image_url, and meal_name are required' },
        { status: 400 }
      )
    }

    // Verify meal type belongs to user
    const { data: mealType, error: mealTypeError } = await supabase
      .from('meal_types')
      .select('id')
      .eq('id', meal_type_id)
      .eq('user_id', user.id)
      .single()

    if (mealTypeError || !mealType) {
      return NextResponse.json(
        { error: 'Invalid meal type' },
        { status: 400 }
      )
    }

    const { data: meal, error } = await supabase
      .from('meals')
      .insert({
        user_id: user.id,
        meal_type_id,
        image_url,
        meal_name,
        calories: calories || null,
        protein: protein || null,
        fat: fat || null,
        carbs: carbs || null,
        memo: memo || null,
        recorded_at: recorded_at || new Date().toISOString()
      })
      .select(`
        *,
        meal_types (
          id,
          name
        )
      `)
      .single()

    if (error) {
      console.error('Error creating meal:', error)
      return NextResponse.json({ error: 'Failed to create meal' }, { status: 500 })
    }

    return NextResponse.json({ meal }, { status: 201 })
  } catch (error) {
    console.error('Error in meals POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}