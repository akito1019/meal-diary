import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: meal, error } = await supabase
      .from('meals')
      .select(`
        *,
        meal_types (
          id,
          name
        )
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    return NextResponse.json({ meal })
  } catch (error) {
    console.error('Error in meal GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      meal_type_id,
      meal_name,
      calories,
      protein,
      fat,
      carbs,
      memo,
      recorded_at
    } = body

    // Verify meal belongs to user
    const { data: existingMeal, error: existingError } = await supabase
      .from('meals')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (existingError || !existingMeal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    // If meal_type_id is being updated, verify it belongs to user
    if (meal_type_id) {
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
    }

    const { data: meal, error } = await supabase
      .from('meals')
      .update({
        ...(meal_type_id && { meal_type_id }),
        ...(meal_name && { meal_name }),
        ...(calories !== undefined && { calories }),
        ...(protein !== undefined && { protein }),
        ...(fat !== undefined && { fat }),
        ...(carbs !== undefined && { carbs }),
        ...(memo !== undefined && { memo }),
        ...(recorded_at && { recorded_at }),
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select(`
        *,
        meal_types (
          id,
          name
        )
      `)
      .single()

    if (error) {
      console.error('Error updating meal:', error)
      return NextResponse.json({ error: 'Failed to update meal' }, { status: 500 })
    }

    return NextResponse.json({ meal })
  } catch (error) {
    console.error('Error in meal PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify meal belongs to user and get image URL for cleanup
    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .select('image_url')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (mealError || !meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    // Delete the meal record
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting meal:', error)
      return NextResponse.json({ error: 'Failed to delete meal' }, { status: 500 })
    }

    // TODO: Clean up image from storage if needed
    // This could be done in a background job or here
    if (meal.image_url) {
      try {
        const imagePath = meal.image_url.split('/').pop()
        if (imagePath) {
          await supabase.storage
            .from('meal-images')
            .remove([`${user.id}/${imagePath}`])
        }
      } catch (storageError) {
        console.warn('Failed to delete image from storage:', storageError)
        // Don't fail the entire operation if image cleanup fails
      }
    }

    return NextResponse.json({ message: 'Meal deleted successfully' })
  } catch (error) {
    console.error('Error in meal DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}