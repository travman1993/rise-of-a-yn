// 📁 src/app/api/games/shootout/route.ts
// Shootout Mini-Game vs NPC
// Best of 5: Pull beats Reload, Reload beats Duck, Duck beats Pull

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type Move = 'pull' | 'duck' | 'reload';

function evaluateRound(playerMove: Move, bossMove: Move): 'win' | 'lose' | 'tie' {
  if (playerMove === bossMove) return 'tie';

  if (playerMove === 'pull' && bossMove === 'reload') return 'win';
  if (playerMove === 'pull' && bossMove === 'duck') return 'lose';

  if (playerMove === 'reload' && bossMove === 'duck') return 'win';
  if (playerMove === 'reload' && bossMove === 'pull') return 'lose';

  if (playerMove === 'duck' && bossMove === 'pull') return 'win';
  if (playerMove === 'duck' && bossMove === 'reload') return 'lose';

  return 'tie';
}

function generateBossMove(playerMove: Move): Move {
  const moves: Move[] = ['pull', 'duck', 'reload'];
  
  // 40% counter, 60% random
  if (Math.random() < 0.4) {
    if (playerMove === 'pull') return 'duck';
    if (playerMove === 'duck') return 'reload';
    if (playerMove === 'reload') return 'pull';
  }

  return moves[Math.floor(Math.random() * moves.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, moves, stake } = body;

    console.log('Shootout request:', { playerId, moves, stake });

    if (!playerId) {
      return NextResponse.json({ error: 'Missing playerId' }, { status: 400 });
    }

    if (!Array.isArray(moves) || moves.length !== 5) {
      return NextResponse.json({ error: `Must provide 5 moves, got ${moves?.length || 0}` }, { status: 400 });
    }

    if (!stake || stake <= 0) {
      return NextResponse.json({ error: 'Invalid stake' }, { status: 400 });
    }

    // Get player stats
    const { data: playerStats, error: statsError } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', playerId)
      .single();

    if (statsError) {
      console.error('Stats error:', statsError);
      return NextResponse.json({ error: 'Player not found' }, { status: 400 });
    }

    if (!playerStats) {
      return NextResponse.json({ error: 'Player stats missing' }, { status: 400 });
    }

    if (stake > playerStats.cash) {
      return NextResponse.json({ error: 'Insufficient cash' }, { status: 400 });
    }

    // Play 5 rounds
    let playerWins = 0;
    let bossWins = 0;
    const rounds = [];

    for (let i = 0; i < 5; i++) {
      const playerMove = moves[i];
      const bossMove = generateBossMove(playerMove);
      const result = evaluateRound(playerMove, bossMove);

      if (result === 'win') {
        playerWins++;
      } else if (result === 'lose') {
        bossWins++;
      }

      rounds.push({ playerMove, bossMove, result });
    }

    // Determine match winner
    const matchWinner = playerWins > bossWins ? 'player' : 'boss';
    let cashReward = 0;
    let respectReward = 0;

    if (matchWinner === 'player') {
      cashReward = stake;
      respectReward = 3;

      await supabase
        .from('player_stats')
        .update({
          cash: playerStats.cash + cashReward,
          respect: playerStats.respect + respectReward,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', playerId);
    } else {
      cashReward = -stake;
      respectReward = -2;

      await supabase
        .from('player_stats')
        .update({
          cash: Math.max(0, playerStats.cash + cashReward),
          respect: Math.max(0, playerStats.respect + respectReward),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', playerId);
    }

    return NextResponse.json({
      success: true,
      matchWinner,
      playerWins,
      bossWins,
      rounds,
      cashReward,
      respectReward,
      totalCash: playerStats.cash + cashReward,
    });
  } catch (error: any) {
    console.error('Shootout error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}