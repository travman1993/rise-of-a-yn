// 📁 src/app/api/leaderboards/route.ts
// Leaderboards - Net Worth, Respect, Prestige, and more

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'wealth';
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 100);

    // Get all users with their stats
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, prestige_level')
      .limit(limit);

    if (usersError) throw usersError;

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        type,
        leaderboard: [],
      });
    }

    // Get stats for all users
    const userIds = users.map((u: any) => u.id);
    const { data: statsData, error: statsError } = await supabase
      .from('player_stats')
      .select('user_id, cash, respect, level, tier')
      .in('user_id', userIds);

    if (statsError) throw statsError;

    // Merge data
    const enriched = users.map((user: any) => {
      const stats = statsData?.find((s: any) => s.user_id === user.id);
      return {
        username: user.username || 'Unknown',
        prestigeLevel: user.prestige_level || 0,
        level: stats?.level || 1,
        cash: stats?.cash || 0,
        respect: stats?.respect || 0,
        tier: stats?.tier || 1,
      };
    });

    // Sort by type
    let leaderboard = [];

    if (type === 'wealth') {
      leaderboard = enriched.sort((a: any, b: any) => b.cash - a.cash);
    } else if (type === 'respect') {
      leaderboard = enriched.sort((a: any, b: any) => b.respect - a.respect);
    } else if (type === 'prestige') {
      leaderboard = enriched.sort((a: any, b: any) => b.prestigeLevel - a.prestigeLevel);
    } else if (type === 'level') {
      leaderboard = enriched.sort((a: any, b: any) => b.level - a.level);
    }

    // Add rankings
    const withRank = leaderboard.map((user: any, idx: number) => ({
      rank: idx + 1,
      username: user.username,
      value: type === 'wealth' ? user.cash : type === 'respect' ? user.respect : type === 'prestige' ? user.prestigeLevel : user.level,
      prestigeLevel: user.prestigeLevel,
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