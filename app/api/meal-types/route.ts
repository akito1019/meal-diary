import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('meal_types')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order');

    if (error) {
      console.error('Error fetching meal types:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/meal-types:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data: existingTypes } = await supabase
      .from('meal_types')
      .select('display_order')
      .eq('user_id', user.id)
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder = existingTypes && existingTypes.length > 0 
      ? existingTypes[0].display_order + 1 
      : 0;

    const { data, error } = await supabase
      .from('meal_types')
      .insert({
        user_id: user.id,
        name,
        display_order: nextOrder
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating meal type:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/meal-types:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}