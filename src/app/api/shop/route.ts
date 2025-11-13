// 📁 src/app/api/shop/route.ts
// Shop API - Buy cosmetics

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Get cosmetics or user's owned cosmetics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Get user's owned cosmetics
      const { data: cosmetics, error } = await supabase
        .from('cosmetics')
        .select('*')
        .eq('user_id', userId)
        .eq('owned', true);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        cosmetics: cosmetics || [],
      });
    }

    // Get all cosmetics for shop
    const { data: allCosmetics, error } = await supabase
      .from('cosmetics')
      .select('*')
      .eq('owned', false)
      .limit(100);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      cosmetics: allCosmetics || [],
    });
  } catch (error: any) {
    console.error('Shop GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST - Buy cosmetic
export async function POST(request: NextRequest) {
  try {
    const { userId, cosmeticId } = await request.json();

    if (!userId || !cosmeticId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Get cosmetic
    const { data: cosmetic, error: cosmeticError } = await supabase
      .from('cosmetics')
      .select('*')
      .eq('id', cosmeticId)
      .single();

    if (cosmeticError) throw cosmeticError;

    // Get player stats
    const { data: stats, error: statsError } = await supabase
      .from('player_stats')
      .select('cash, respect')
      .eq('user_id', userId)
      .single();

    if (statsError) throw statsError;

    // Check if can afford
    if (stats.cash < cosmetic.price) {
      return NextResponse.json({ error: 'Insufficient cash' }, { status: 400 });
    }

    // Check if already owned
    const { data: owned } = await supabase
      .from('cosmetics')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', cosmetic.item_id)
      .single();

    if (owned) {
      return NextResponse.json({ error: 'Already owned' }, { status: 400 });
    }

    // Deduct cash
    await supabase
      .from('player_stats')
      .update({
        cash: stats.cash - cosmetic.price,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    // Add cosmetic to user
    const { data: newCosmetic, error: addError } = await supabase
      .from('cosmetics')
      .insert([
        {
          user_id: userId,
          item_id: cosmetic.item_id,
          name: cosmetic.name,
          category: cosmetic.category,
          power_bonus: cosmetic.power_bonus,
          respect_bonus: cosmetic.respect_bonus,
          price: cosmetic.price,
          image_url: cosmetic.image_url,
          owned: true,
          purchased_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (addError) throw addError;

    return NextResponse.json({
      success: true,
      cosmetic: newCosmetic,
      newCash: stats.cash - cosmetic.price,
      message: `Bought ${cosmetic.name}!`,
    });
  } catch (error: any) {
    console.error('Shop POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}