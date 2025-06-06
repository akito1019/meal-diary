import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { mealTypeIds } = body;

    if (!Array.isArray(mealTypeIds)) {
      return NextResponse.json({ error: 'mealTypeIds must be an array' }, { status: 400 });
    }

    const { data: existingTypes } = await supabase
      .from('meal_types')
      .select('id')
      .eq('user_id', user.id);

    if (!existingTypes) {
      return NextResponse.json({ error: 'No meal types found' }, { status: 404 });
    }

    const existingIds = existingTypes.map(type => type.id);
    const isValidIds = mealTypeIds.every(id => existingIds.includes(id));

    if (!isValidIds || mealTypeIds.length !== existingIds.length) {
      return NextResponse.json({ error: 'Invalid meal type IDs' }, { status: 400 });
    }

    const updates = mealTypeIds.map((id, index) => ({
      id,
      user_id: user.id,
      display_order: index
    }));

    const updatePromises = updates.map(({ id, display_order }) =>
      supabase
        .from('meal_types')
        .update({ display_order })
        .eq('id', id)
        .eq('user_id', user.id)
    );

    const results = await Promise.all(updatePromises);
    const hasError = results.some(result => result.error);

    if (hasError) {
      return NextResponse.json({ error: 'Failed to update display order' }, { status: 500 });
    }

    const { data: updatedTypes } = await supabase
      .from('meal_types')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order');

    return NextResponse.json(updatedTypes);
  } catch (error) {
    console.error('Error in PUT /api/meal-types/reorder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}