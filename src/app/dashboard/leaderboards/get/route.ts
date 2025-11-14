// 📁 src/app/api/leaderboards/get/route.ts
// FIXED Leaderboards API - Properly joins users and player_stats

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'wealth';
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 100);

    console.log(`[Leaderboard API] Fetching ${type} leaderboard with limit ${limit}`);

    // Get all users with their stats
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(limit);

    if (usersError) {
      console.error('Users error:', usersError);
      throw usersError;
    }

    if (!users || users.length === 0) {
      console.log('[Leaderboard API] No users found');
      return NextResponse.json({
        success: true,
        type,
        leaderboard: [],
      });
    }

    console.log(`[Leaderboard API] Found ${users.length} users`);

    // Get stats for all users
    const userIds = users.map((u: any) => u.id);
    const { data: statsData, error: statsError } = await supabase
      .from('player_stats')
      .select('user_id, cash, respect, level, tier, prestige_level')
      .in('user_id', userIds);

    if (statsError) {
      console.error('Stats error:', statsError);
      throw statsError;
    }

    console.log(`[Leaderboard API] Found ${statsData?.length || 0} player stats`);

    // Merge data
    const enriched = users
      .map((user: any) => {
        const stats = statsData?.find((s: any) => s.user_id === user.id);
        const username = user.email?.split('@')[0] || 'Unknown';
        
        return {
          username,
          userId: user.id,
          prestigeLevel: stats?.prestige_level || 0,
          level: stats?.level || 1,
          cash: stats?.cash || 0,
          respect: stats?.respect || 0,
          tier: stats?.tier || 1,
        };
      })
      .filter((u: any) => u.cash > 0 || u.respect > 0); // Only show players with stats

    console.log(`[Leaderboard API] Enriched ${enriched.length} users`);

    // Sort by type
    let sorted = [];

    if (type === 'wealth') {
      sorted = enriched.sort((a: any, b: any) => b.cash - a.cash);
    } else if (type === 'respect') {
      sorted = enriched.sort((a: any, b: any) => b.respect - a.respect);
    } else if (type === 'prestige') {
      sorted = enriched.sort((a: any, b: any) => b.prestigeLevel - a.prestigeLevel);
    } else if (type === 'level') {
      sorted = enriched.sort((a: any, b: any) => b.level - a.level);
    }

    // Add rankings
    const leaderboard = sorted.map((user: any, idx: number) => ({
      rank: idx + 1,
      username: user.username,
      userId: user.userId,
      value: 
        type === 'wealth' 
          ? user.cash 
          : type === 'respect' 
          ? user.respect 
          : type === 'prestige' 
          ? user.prestigeLevel 
          : user.level,
      prestigeLevel: user.prestigeLevel,
      level: user.level,
      cash: user.cash,
      respect: user.respect,
      tier: user.tier,
    }));

    const result = leaderboard.slice(0, limit);
    
    console.log(`[Leaderboard API] Returning top ${result.length} entries`);
    console.log('[Leaderboard API] Top 3:', result.slice(0, 3).map(e => ({ rank: e.rank, name: e.username, value: e.value })));

    return NextResponse.json({
      success: true,
      type,
      leaderboard: result,
      totalEntries: leaderboard.length,
    });
  } catch (error: any) {
    console.error('[Leaderboard API] Error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error,
    }, { status: 400 });
  }
}