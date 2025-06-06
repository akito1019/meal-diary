import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, display_order } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (display_order !== undefined) updateData.display_order = display_order;

    const { data, error } = await supabase
      .from('meal_types')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating meal type:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Meal type not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/meal-types/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: mealType } = await supabase
      .from('meal_types')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!mealType) {
      return NextResponse.json({ error: 'Meal type not found' }, { status: 404 });
    }

    const { data: meals } = await supabase
      .from('meals')
      .select('id')
      .eq('meal_type_id', id)
      .limit(1);

    if (meals && meals.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete meal type with associated meals' 
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('meal_types')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting meal type:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { error: reorderError } = await supabase
      .from('meal_types')
      .update({ display_order: supabase.sql`display_order - 1` })
      .eq('user_id', user.id)
      .gt('display_order', mealType.display_order);

    if (reorderError) {
      console.error('Error reordering meal types:', reorderError);
    }

    return NextResponse.json({ message: 'Meal type deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/meal-types/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}