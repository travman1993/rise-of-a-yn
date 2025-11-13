// 📁 src/app/api/games/dice/route.ts
// Street Dice - PvP Mini-Game
// Highest roll wins, loser loses bet, house takes 10%

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { playerId, targetId, betAmount } = await request.json();

    if (betAmount <= 0) {
      return NextResponse.json({ error: 'Invalid bet amount' }, { status: 400 });
    }

    // Get both players' stats
    const [playerStats, targetStats] = await Promise.all([
      supabase.from('player_stats').select('*').eq('user_id', playerId).single(),
      supabase.from('player_stats').select('*').eq('user_id', targetId).single(),
    ]);

    if (playerStats.error || targetStats.error) {
      throw new Error('Player not found');
    }

    const player = playerStats.data;
    const target = targetStats.data;

    // Validate bet within tier limits
    const TIER_LIMITS: Record<number, number> = {
      1: 10000,
      2: 100000,
      3: 1000000,
      4: 10000000,
      5: 100000000,
    };

    const playerLimit = TIER_LIMITS[player.tier] || 10000;
    const targetLimit = TIER_LIMITS[target.tier] || 10000;

    if (betAmount > player.cash || betAmount > playerLimit) {
      return NextResponse.json({ error: 'Bet exceeds limit' }, { status: 400 });
    }

    if (betAmount > target.cash || betAmount > targetLimit) {
      return NextResponse.json({ error: 'Target cannot cover bet' }, { status: 400 });
    }

    // Roll dice
    let playerRoll = Math.floor(Math.random() * 6) + 1;
    let targetRoll = Math.floor(Math.random() * 6) + 1;

    // Keep rerolling on ties
    while (playerRoll === targetRoll) {
      playerRoll = Math.floor(Math.random() * 6) + 1;
      targetRoll = Math.floor(Math.random() * 6) + 1;
    }

    const houseCut = Math.floor(betAmount * 0.1);
    const winnings = betAmount - houseCut;
    let winner: 'player' | 'target';

    if (playerRoll > targetRoll) {
      winner = 'player';
      // Player wins
      await supabase
        .from('player_stats')
        .update({
          cash: player.cash + winnings,
          respect: player.respect + 2,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', playerId);

      // Target loses
      await supabase
        .from('player_stats')
        .update({
          cash: target.cash - betAmount,
          respect: Math.max(0, target.respect - 1),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', targetId);
    } else {
      winner = 'target';
      // Target wins
      await supabase
        .from('player_stats')
        .update({
          cash: target.cash + winnings,
          respect: target.respect + 2,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', targetId);

      // Player loses
      await supabase
        .from('player_stats')
        .update({
          cash: player.cash - betAmount,
          respect: Math.max(0, player.respect - 1),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', playerId);
    }

    return NextResponse.json({
      success: true,
      winner,
      playerRoll,
      targetRoll,
      betAmount,
      houseCut,
      winnings,
    });
  } catch (error: any) {
    console.error('Dice error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}