// 📁 src/app/api/offline/route.ts
// Offline Earnings API - Calculate income while player is away

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const MAX_OFFLINE_HOURS = 8;
const OFFLINE_INCOME_PER_MIN = 10; // Base income per minute offline

// GET - Calculate offline earnings
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
      .select('last_login, cash')
      .eq('user_id', userId)
      .single();

    if (statsError) throw statsError;

    // Calculate time offline
    const now = new Date();
    const lastLogin = stats.last_login ? new Date(stats.last_login) : new Date();
    const offlineMinutes = Math.floor((now.getTime() - lastLogin.getTime()) / 1000 / 60);

    // Cap at 8 hours (480 minutes)
    const cappedOfflineMinutes = Math.min(offlineMinutes, MAX_OFFLINE_HOURS * 60);

    // Get businesses for income calculation
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('current_income')
      .eq('user_id', userId);

    if (bizError) throw bizError;

    // Calculate total offline income from all businesses
    const businessIncome = businesses?.reduce((total: number, biz: any) => {
      return total + (biz.current_income || 0);
    }, 0) || 0;

    // Total offline income = all business income * offline minutes
    const offlineIncome = Math.floor(businessIncome * cappedOfflineMinutes);

    return NextResponse.json({
      success: true,
      offlineMinutes: cappedOfflineMinutes,
      maxOfflineMinutes: MAX_OFFLINE_HOURS * 60,
      businessIncome,
      offlineIncome,
      capped: offlineMinutes > MAX_OFFLINE_HOURS * 60,
    });
  } catch (error: any) {
    console.error('Offline GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST - Claim offline earnings
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

    // Calculate time offline
    const now = new Date();
    const lastLogin = stats.last_login ? new Date(stats.last_login) : new Date();
    const offlineMinutes = Math.floor((now.getTime() - lastLogin.getTime()) / 1000 / 60);

    // Cap at 8 hours
    const cappedOfflineMinutes = Math.min(offlineMinutes, MAX_OFFLINE_HOURS * 60);

    // Get businesses
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('current_income')
      .eq('user_id', userId);

    if (bizError) throw bizError;

    // Calculate income
    const businessIncome = businesses?.reduce((total: number, biz: any) => {
      return total + (biz.current_income || 0);
    }, 0) || 0;

    const offlineIncome = Math.floor(businessIncome * cappedOfflineMinutes);

    // Update player stats
    await supabase
      .from('player_stats')
      .update({
        cash: stats.cash + offlineIncome,
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      offlineIncome,
      offlineMinutes: cappedOfflineMinutes,
      newCash: stats.cash + offlineIncome,
      message: `Earned ${offlineIncome} offline!`,
    });
  } catch (error: any) {
    console.error('Offline POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}