// 📁 src/app/api/boss/route.ts
// Boss Fight API

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculatePower } from '@/lib/gameLogic';

interface BossConfig {
  tier: number;
  name: string;
  powerRequired: number;
  cashReward: number;
  xpReward: number;
  respectReward: number;
}

const BOSSES: Record<number, BossConfig> = {
  1: {
    tier: 1,
    name: 'Neighborhood OG',
    powerRequired: 5000,
    cashReward: 5000,
    xpReward: 500,
    respectReward: 50,
  },
  2: {
    tier: 2,
    name: 'Block Captain',
    powerRequired: 25000,
    cashReward: 25000,
    xpReward: 2000,
    respectReward: 150,
  },
  3: {
    tier: 3,
    name: 'City Controller',
    powerRequired: 100000,
    cashReward: 100000,
    xpReward: 8000,
    respectReward: 400,
  },
  4: {
    tier: 4,
    name: 'State Kingpin',
    powerRequired: 500000,
    cashReward: 500000,
    xpReward: 40000,
    respectReward: 1500,
  },
  5: {
    tier: 5,
    name: 'Global Don',
    powerRequired: 2000000,
    cashReward: 2000000,
    xpReward: 200000,
    respectReward: 5000,
  },
};

// GET - Get boss info for current tier
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get player stats
    const { data: stats, error: statsError } = await supabase
      .from('player_stats')
      .select('tier, cash, respect, level')
      .eq('user_id', userId)
      .single();

    if (statsError) throw statsError;

    const currentTier = stats.tier || 1;
    const nextTier = Math.min(currentTier + 1, 5);
    const boss = BOSSES[nextTier];

    if (!boss) {
      return NextResponse.json({ error: 'Max tier reached' }, { status: 400 });
    }

    // Calculate player power
    const power = calculatePower(stats.cash, stats.respect, 0, 0);

    return NextResponse.json({
      success: true,
      boss,
      playerPower: power,
      canFight: power >= boss.powerRequired,
      currentTier,
    });
  } catch (error: any) {
    console.error('Boss GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST - Fight boss
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get player stats
    const { data: stats, error: statsError } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError) throw statsError;

    const currentTier = stats.tier || 1;
    const nextTier = Math.min(currentTier + 1, 5);
    const boss = BOSSES[nextTier];

    if (!boss) {
      return NextResponse.json({ error: 'Max tier reached' }, { status: 400 });
    }

    // Calculate power
    const playerPower = calculatePower(stats.cash, stats.respect, 0, 0);

    if (playerPower < boss.powerRequired) {
      return NextResponse.json({ error: 'Not strong enough' }, { status: 400 });
    }

    // Simulate fight with RNG
    const luck = Math.random() * 0.2 - 0.1; // ±10% variance
    const bossPower = boss.powerRequired * (1 + luck);
    const playerFinalPower = playerPower * (1 + (Math.random() * 0.2 - 0.1)); // ±10%

    const playerWins = playerFinalPower > bossPower;

    if (playerWins) {
      // Update player stats - promote to next tier
      await supabase
        .from('player_stats')
        .update({
          tier: nextTier,
          cash: stats.cash + boss.cashReward,
          xp: stats.xp + boss.xpReward,
          respect: stats.respect + boss.respectReward,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      return NextResponse.json({
        success: true,
        result: 'WIN',
        message: `You defeated ${boss.name}! Promoted to Tier ${nextTier}!`,
        rewards: {
          cash: boss.cashReward,
          xp: boss.xpReward,
          respect: boss.respectReward,
        },
        newTier: nextTier,
      });
    } else {
      // Lose - lose some cash
      const penalty = Math.floor(stats.cash * 0.05); // Lose 5% cash

      await supabase
        .from('player_stats')
        .update({
          cash: Math.max(100, stats.cash - penalty),
          respect: Math.max(0, stats.respect - 10),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      return NextResponse.json({
        success: true,
        result: 'LOSE',
        message: `You lost to ${boss.name}! Lost ${penalty} cash and 10 respect.`,
        penalty,
      });
    }
  } catch (error: any) {
    console.error('Boss POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}