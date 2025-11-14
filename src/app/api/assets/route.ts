// 📁 src/app/api/assets/route.ts
// Asset Shop API - Buy, Get owned, Get cosmetic bonuses

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ALL_ASSETS } from '@/lib/assets';

// GET - Get user's owned assets or all assets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category') as 'home' | 'car' | 'chain' | 'watch' | 'shoes' | 'dog' | 'gun' | 'studio' | 'boat' | null;

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Get user's owned assets
    const { data: ownedAssets, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .eq('owned', true);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      assets: ownedAssets || [],
    });
  } catch (error: any) {
    console.error('Assets GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST - Buy an asset
export async function POST(request: NextRequest) {
  try {
    const { userId, action, assetData } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 });
    }

    if (action === 'buy') {
      return handleBuyAsset(userId, assetData);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Assets POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// BUY ASSET HANDLER
async function handleBuyAsset(userId: string, assetData: any) {
  // Validate asset exists in library
  const assetCategory = assetData.category as keyof typeof ALL_ASSETS;
  const assetLibrary = ALL_ASSETS[assetCategory];

  if (!assetLibrary) {
    return NextResponse.json({ error: 'Invalid asset category' }, { status: 400 });
  }

  const assetInLibrary = assetLibrary.find((a: any) => a.id === assetData.id);
  if (!assetInLibrary) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 400 });
  }

  // Get player stats
  const { data: stats, error: statsError } = await supabase
    .from('player_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (statsError) throw statsError;
  if (!stats) throw new Error('Player stats not found');

  // Check tier gating - must own the tier to buy that tier's assets
  if (stats.tier < assetData.tier) {
    return NextResponse.json({ 
      error: `You must be Tier ${assetData.tier} to buy this asset!` 
    }, { status: 400 });
  }

  // Check if can afford
  if (stats.cash < assetData.price) {
    return NextResponse.json({ error: 'Insufficient cash' }, { status: 400 });
  }

  // Check if already owned
  const { data: alreadyOwned } = await supabase
    .from('assets')
    .select('id')
    .eq('user_id', userId)
    .eq('asset_id', assetData.id)
    .single();

  if (alreadyOwned) {
    return NextResponse.json({ error: 'Already owned' }, { status: 400 });
  }

  // Deduct cash from player
  const newCash = stats.cash - assetData.price;
  const newXP = stats.xp + assetData.xp;
  const newRespect = stats.respect + assetData.respect;
  const newEnergy = Math.min(stats.energy + assetData.energy, stats.max_energy || 100);

  const { error: updateError } = await supabase
    .from('player_stats')
    .update({
      cash: newCash,
      xp: newXP,
      respect: newRespect,
      energy: newEnergy,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) throw updateError;

  // Add asset to user's collection
  const { data: newAsset, error: insertError } = await supabase
    .from('assets')
    .insert([
      {
        user_id: userId,
        asset_id: assetData.id,
        name: assetData.name,
        category: assetData.category,
        tier: assetData.tier,
        price: assetData.price,
        icon: assetData.icon,
        xp_bonus: assetData.xp,
        respect_bonus: assetData.respect,
        power_bonus: assetData.power,
        energy_bonus: assetData.energy,
        owned: true,
        purchased_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (insertError) throw insertError;

  return NextResponse.json({
    success: true,
    asset: newAsset,
    newCash,
    newXP,
    newRespect,
    newEnergy,
    message: `✅ Bought ${assetData.name}!\n+${assetData.xp} XP\n+${assetData.respect} Respect\n+${assetData.power} Power\n+${assetData.energy} Energy`,
  });
}