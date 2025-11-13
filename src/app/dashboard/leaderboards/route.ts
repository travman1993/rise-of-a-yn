// 📁 src/app/api/leaderboards/route.ts
// Leaderboards - Net Worth, Respect, Prestige, and more

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'wealth';
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 100);

    let query = supabase.from('users').select(
      'id, username, prestige_level, total_prestiges, created_at'
    );

    // Join with player_stats for cash
    const { data: allUsers, error } = await query.limit(limit);

    if (error) throw error;

    // Fetch stats for all users
    const userIds = allUsers.map((u: any) => u.id);
    const { data: statsData, error: statsError } = await supabase
      .from('player_stats')
      .select('user_id, cash, respect, level')
      .in('user_id', userIds);

    if (statsError) throw statsError;

    // Merge and sort
    const enriched = allUsers.map((user: any) => {
      const stats = statsData.find((s: any) => s.user_id === user.id);
      return {
        ...user,
        cash: stats?.cash || 0,
        respect: stats?.respect || 0,
        level: stats?.level || 1,
      };
    });

    let leaderboard = [];

    if (type === 'wealth') {
      leaderboard = enriched.sort((a: any, b: any) => b.cash - a.cash);
    } else if (type === 'respect') {
      leaderboard = enriched.sort((a: any, b: any) => b.respect - a.respect);
    } else if (type === 'prestige') {
      leaderboard = enriched.sort((a: any, b: any) => b.prestige_level - a.prestige_level);
    } else if (type === 'level') {
      leaderboard = enriched.sort((a: any, b: any) => b.level - a.level);
    }

    // Add rankings
    const withRank = leaderboard.map((user: any, idx: number) => ({
      rank: idx + 1,
      username: user.username,
      value: type === 'wealth' ? user.cash : type === 'respect' ? user.respect : type === 'prestige' ? user.prestige_level : user.level,
      prestigeLevel: user.prestige_level,
      level: user.level,
      cash: user.cash,
      respect: user.respect,
    }));

    return NextResponse.json({
      success: true,
      type,
      leaderboard: withRank.slice(0, limit),
    });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}