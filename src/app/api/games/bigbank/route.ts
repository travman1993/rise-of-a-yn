// 📁 src/app/api/games/bigbank/route.ts
// Big Bank Take Little Bank - PvP Mini-Game
// Players bet 5-25% of bank, winner takes 10% of loser's bank

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculatePower } from '@/lib/gameLogic';

export async function POST(request: NextRequest) {
  try {
    const { playerId, targetId, betPercentage } = await request.json();

    // Validate bet range
    if (betPercentage < 5 || betPercentage > 25) {
      return NextResponse.json({ error: 'Bet must be 5-25% of bank' }, { status: 400 });
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

    // Calculate bet amount
    const betAmount = Math.floor(player.cash * (betPercentage / 100));
    if (betAmount > player.cash) {
      return NextResponse.json({ error: 'Insufficient cash' }, { status: 400 });
    }

    // Get cosmetics for power bonus
    const [playerCosmetics, targetCosmetics] = await Promise.all([
      supabase.from('cosmetics').select('power_bonus').eq('user_id', playerId).eq('owned', true),
      supabase.from('cosmetics').select('power_bonus').eq('user_id', targetId).eq('owned', true),
    ]);

    const playerCosmeticBonus = playerCosmetics.data?.reduce((sum, c) => sum + c.power_bonus, 0) || 0;
    const targetCosmeticBonus = targetCosmetics.data?.reduce((sum, c) => sum + c.power_bonus, 0) || 0;

    // Calculate power with RNG
    const playerPower = calculatePower(player.cash, player.respect, playerCosmeticBonus, 0);
    const targetPower = calculatePower(target.cash, target.respect, targetCosmeticBonus, 0);

    const playerFinalPower = playerPower + (Math.random() * 0.2 - 0.1) * playerPower;
    const targetFinalPower = targetPower + (Math.random() * 0.2 - 0.1) * targetPower;

    let winner: 'player' | 'target' | 'tie';
    if (playerFinalPower > targetFinalPower) {
      winner = 'player';
    } else if (targetFinalPower > playerFinalPower) {
      winner = 'target';
    } else {
      winner = player.cash > target.cash ? 'player' : 'target';
    }

    const winnerTakesAmount = Math.floor(betAmount * 0.1);

    // Update loser
    if (winner === 'player') {
      await supabase
        .from('player_stats')
        .update({
          cash: target.cash - winnerTakesAmount,
          respect: Math.max(0, target.respect - 2),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', targetId);

      // Update winner
      await supabase
        .from('player_stats')
        .update({
          cash: player.cash + winnerTakesAmount,
          respect: player.respect + 3,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', playerId);
    } else {
      await supabase
        .from('player_stats')
        .update({
          cash: player.cash - winnerTakesAmount,
          respect: Math.max(0, player.respect - 2),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', playerId);

      // Update winner
      await supabase
        .from('player_stats')
        .update({
          cash: target.cash + winnerTakesAmount,
          respect: target.respect + 3,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', targetId);
    }

    return NextResponse.json({
      success: true,
      winner,
      playerPower: Math.floor(playerFinalPower),
      targetPower: Math.floor(targetFinalPower),
      amountTransferred: winnerTakesAmount,
    });
  } catch (error: any) {
    console.error('Big Bank error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}