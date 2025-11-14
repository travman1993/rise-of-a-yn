// 📁 src/app/api/businesses/route.ts (NOT [id]/route.ts - IMPORTANT!)
// Businesses Management API - CORRECTED

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

// POST - Buy business, Collect, Upgrade, Hire managers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, businessId, tier, businessData } = body;

    console.log('📥 API Request:', { action, userId, tier, businessId });

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get player stats
    const { data: stats, error: statsError } = await supabase
      .from('player_stats')
      .select('cash, tier')
      .eq('user_id', userId)
      .single();

    if (statsError) {
      console.error('❌ Stats error:', statsError);
      throw statsError;
    }

    console.log('✅ Player stats:', { cash: stats.cash, tier: stats.tier });

    // ============================================
    // ACTION: BUY BUSINESS
    // ============================================
    if (action === 'buy') {
      console.log('🛍️ BUY ACTION - businessData:', businessData);

      if (!tier || !businessData) {
        console.error('❌ Missing tier or businessData');
        return NextResponse.json({ error: 'Missing tier or businessData' }, { status: 400 });
      }

      // Check tier access
      if (stats.tier < tier) {
        console.error(`❌ Player is Tier ${stats.tier}, trying to buy Tier ${tier}`);
        return NextResponse.json({ error: `Unlock Tier ${tier} first. You are Tier ${stats.tier}` }, { status: 400 });
      }

      const cost = businessData.baseCost;
      console.log(`💰 Business cost: ${cost}, Player cash: ${stats.cash}`);

      if (stats.cash < cost) {
        console.error(`❌ Not enough cash. Need ${cost}, have ${stats.cash}`);
        return NextResponse.json({ error: `Insufficient cash. Need $${cost}, have $${stats.cash}` }, { status: 400 });
      }

      // ✅ FIX: Don't use .single() - handle no records gracefully
      console.log(`🔍 Checking if already owns: ${businessData.name}`);
      
      const { data: existing, error: checkError } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', userId)
        .eq('name', businessData.name);

      if (checkError) {
        console.error('❌ Check existing error:', checkError);
        throw checkError;
      }

      console.log(`Found existing records:`, existing);

      if (existing && existing.length > 0) {
        console.error('❌ Already owns this business');
        return NextResponse.json({ error: 'You already own this business' }, { status: 400 });
      }

      // Create business
      console.log('➕ Creating new business:', {
        name: businessData.name,
        tier: tier,
        baseIncome: businessData.baseIncome,
        baseSpeed: businessData.baseSpeed,
      });

      const { data: newBusiness, error: createError } = await supabase
        .from('businesses')
        .insert([
          {
            user_id: userId,
            name: businessData.name,
            icon: businessData.icon,
            tier: tier,
            base_income: businessData.baseIncome,
            current_income: businessData.baseIncome,
            base_speed: businessData.baseSpeed,
            upgrade_level: 0,
            speed_manager_level: 0,
            income_manager_level: 0,
            last_collected: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error('❌ Create business error:', createError);
        throw createError;
      }

      console.log('✅ Business created:', newBusiness.id);

      // Deduct cash
      const { error: updateError } = await supabase
        .from('player_stats')
        .update({
          cash: stats.cash - cost,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('❌ Update stats error:', updateError);
        throw updateError;
      }

      console.log('✅ Cash deducted:', cost);

      return NextResponse.json({
        success: true,
        business: newBusiness,
        newCash: stats.cash - cost,
        message: `Bought ${businessData.name}!`,
      });
    }

    // ============================================
    // ACTION: COLLECT FROM BUSINESS
    // ============================================
    if (action === 'collect') {
      if (!businessId) {
        return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('user_id', userId)
        .single();

      if (!business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 400 });
      }

      // Calculate current income
      let income = business.base_income * Math.pow(2, business.upgrade_level);
      let managerBonus = 1 + (business.income_manager_level * 0.2);
      const currentIncome = Math.floor(income * managerBonus);

      // Calculate current speed
      let speed = business.base_speed / Math.pow(2, business.upgrade_level);
      if (business.speed_manager_level > 0) {
        speed = speed / business.speed_manager_level;
      }
      const currentSpeed = Math.max(5, speed);

      // Check if ready
      const now = new Date();
      const lastCollected = new Date(business.last_collected);
      const secondsPassed = (now.getTime() - lastCollected.getTime()) / 1000;

      if (secondsPassed < currentSpeed) {
        const timeRemaining = Math.max(0, currentSpeed - secondsPassed);
        return NextResponse.json(
          {
            error: 'Not ready to collect',
            timeRemaining,
          },
          { status: 400 }
        );
      }

      // Get player stats for cash update
      const { data: playerStats } = await supabase
        .from('player_stats')
        .select('cash')
        .eq('user_id', userId)
        .single();

      // Add income
      await supabase
        .from('player_stats')
        .update({
          cash: playerStats.cash + currentIncome,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      // Update last_collected
      await supabase
        .from('businesses')
        .update({
          last_collected: new Date().toISOString(),
        })
        .eq('id', businessId);

      return NextResponse.json({
        success: true,
        income: currentIncome,
        newCash: playerStats.cash + currentIncome,
      });
    }

    // ============================================
    // ACTION: UPGRADE
    // ============================================
    if (action === 'upgrade') {
      if (!businessId) {
        return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('user_id', userId)
        .single();

      const upgradeCost = Math.floor(
        business.base_income * 1.5 * Math.pow(1.5, business.upgrade_level)
      );

      if (stats.cash < upgradeCost) {
        return NextResponse.json({ error: 'Insufficient cash' }, { status: 400 });
      }

      const newUpgradeLevel = business.upgrade_level + 1;
      let newIncome = business.base_income * Math.pow(2, newUpgradeLevel);
      let managerBonus = 1 + business.income_manager_level * 0.2;
      const currentIncome = Math.floor(newIncome * managerBonus);

      await supabase
        .from('businesses')
        .update({
          upgrade_level: newUpgradeLevel,
          current_income: currentIncome,
        })
        .eq('id', businessId);

      await supabase
        .from('player_stats')
        .update({
          cash: stats.cash - upgradeCost,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      return NextResponse.json({
        success: true,
        newCash: stats.cash - upgradeCost,
        message: `Upgraded!`,
      });
    }

    // ============================================
    // ACTION: BUY SPEED MANAGER
    // ============================================
    if (action === 'buy_speed_manager') {
      if (!businessId) {
        return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('user_id', userId)
        .single();

      const tierBaseCost = 5000 * Math.pow(10, business.tier - 1);
      const managerCost = Math.floor(tierBaseCost * Math.pow(2, business.speed_manager_level));

      if (stats.cash < managerCost) {
        return NextResponse.json({ error: 'Insufficient cash' }, { status: 400 });
      }

      await supabase
        .from('businesses')
        .update({
          speed_manager_level: business.speed_manager_level + 1,
        })
        .eq('id', businessId);

      await supabase
        .from('player_stats')
        .update({
          cash: stats.cash - managerCost,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      return NextResponse.json({
        success: true,
        newCash: stats.cash - managerCost,
      });
    }

    // ============================================
    // ACTION: BUY INCOME MANAGER
    // ============================================
    if (action === 'buy_income_manager') {
      if (!businessId) {
        return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('user_id', userId)
        .single();

      const tierBaseCost = 5000 * Math.pow(10, business.tier - 1);
      const managerCost = Math.floor(tierBaseCost * Math.pow(2, business.income_manager_level));

      if (stats.cash < managerCost) {
        return NextResponse.json({ error: 'Insufficient cash' }, { status: 400 });
      }

      const newManagerLevel = business.income_manager_level + 1;
      let newIncome = business.base_income * Math.pow(2, business.upgrade_level);
      let managerBonus = 1 + newManagerLevel * 0.2;
      const currentIncome = Math.floor(newIncome * managerBonus);

      await supabase
        .from('businesses')
        .update({
          income_manager_level: newManagerLevel,
          current_income: currentIncome,
        })
        .eq('id', businessId);

      await supabase
        .from('player_stats')
        .update({
          cash: stats.cash - managerCost,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      return NextResponse.json({
        success: true,
        newCash: stats.cash - managerCost,
      });
    }

    console.error('❌ Invalid action:', action);
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('❌ Businesses POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 400 });
  }
}