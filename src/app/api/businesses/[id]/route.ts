// 📁 src/app/api/businesses/route.ts
// Businesses Management API

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateCost, calculateIncome, calculateManagerCost, calculateInvestorCost } from '@/lib/gameLogic';

// GET - Fetch user's businesses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .order('tier', { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      businesses: businesses || [],
    });
  } catch (error: any) {
    console.error('Businesses GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST - Buy business or hire manager/investor
export async function POST(request: NextRequest) {
  try {
    const { action, userId, businessId, tier, name } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get player stats
    const { data: stats, error: statsError } = await supabase
      .from('player_stats')
      .select('cash, tier')
      .eq('user_id', userId)
      .single();

    if (statsError) throw statsError;

    if (action === 'buy') {
      if (!tier || !name) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }

      // Check tier access
      if (stats.tier < tier) {
        return NextResponse.json({ error: 'Unlock this tier first' }, { status: 400 });
      }

      const cost = calculateCost(10000, tier, false, false, 1);

      if (stats.cash < cost) {
        return NextResponse.json({ error: 'Insufficient cash' }, { status: 400 });
      }

      // Create business
      const { data: newBusiness, error: createError } = await supabase
        .from('businesses')
        .insert([
          {
            user_id: userId,
            name,
            tier,
            base_income: 50 * Math.pow(5, tier - 1),
            current_income: 50 * Math.pow(5, tier - 1),
            level: 1,
            manager_level: 0,
            investor_level: 0,
            manager_name: '',
            investor_name: '',
            last_collected: new Date().toISOString(),
            image_url: '🏢',
          },
        ])
        .select()
        .single();

      if (createError) throw createError;

      // Deduct cash
      await supabase
        .from('player_stats')
        .update({
          cash: stats.cash - cost,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      return NextResponse.json({
        success: true,
        business: newBusiness,
        newCash: stats.cash - cost,
        message: `Bought ${name}!`,
      });
    }

    if (action === 'hire_manager') {
      if (!businessId) {
        return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
      }

      // Get business
      const { data: business, error: bizError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('user_id', userId)
        .single();

      if (bizError) throw bizError;

      const managerCost = calculateManagerCost(business.tier, business.manager_level);

      if (stats.cash < managerCost) {
        return NextResponse.json({ error: 'Insufficient cash' }, { status: 400 });
      }

      const newManagerLevel = business.manager_level + 1;
      const newIncome = calculateIncome(
        business.base_income,
        newManagerLevel,
        business.investor_level,
        business.tier
      );

      // Update business
      await supabase
        .from('businesses')
        .update({
          manager_level: newManagerLevel,
          current_income: newIncome,
          updated_at: new Date().toISOString(),
        })
        .eq('id', businessId);

      // Deduct cash
      await supabase
        .from('player_stats')
        .update({
          cash: stats.cash - managerCost,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      return NextResponse.json({
        success: true,
        message: `Hired manager level ${newManagerLevel}!`,
        newCash: stats.cash - managerCost,
        newIncome,
      });
    }

    if (action === 'hire_investor') {
      if (!businessId) {
        return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
      }

      // Get business
      const { data: business, error: bizError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('user_id', userId)
        .single();

      if (bizError) throw bizError;

      const investorCost = calculateInvestorCost(business.tier, business.investor_level);

      if (stats.cash < investorCost) {
        return NextResponse.json({ error: 'Insufficient cash' }, { status: 400 });
      }

      const newInvestorLevel = business.investor_level + 1;
      const newIncome = calculateIncome(
        business.base_income,
        business.manager_level,
        newInvestorLevel,
        business.tier
      );

      // Update business
      await supabase
        .from('businesses')
        .update({
          investor_level: newInvestorLevel,
          current_income: newIncome,
          updated_at: new Date().toISOString(),
        })
        .eq('id', businessId);

      // Deduct cash
      await supabase
        .from('player_stats')
        .update({
          cash: stats.cash - investorCost,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      return NextResponse.json({
        success: true,
        message: `Hired investor level ${newInvestorLevel}!`,
        newCash: stats.cash - investorCost,
        newIncome,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Businesses POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT - Collect income from business
export async function PUT(request: NextRequest) {
  try {
    const { businessId, userId } = await request.json();

    if (!businessId || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Get business
    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .eq('user_id', userId)
      .single();

    if (bizError) throw bizError;

    // Get player stats
    const { data: stats, error: statsError } = await supabase
      .from('player_stats')
      .select('cash')
      .eq('user_id', userId)
      .single();

    if (statsError) throw statsError;

    const income = business.current_income || business.base_income;

    // Add income to cash
    await supabase
      .from('player_stats')
      .update({
        cash: stats.cash + income,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    // Update business last_collected
    await supabase
      .from('businesses')
      .update({
        last_collected: new Date().toISOString(),
      })
      .eq('id', businessId);

    return NextResponse.json({
      success: true,
      income,
      newCash: stats.cash + income,
      message: `Collected ${income}!`,
    });
  } catch (error: any) {
    console.error('Businesses PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}