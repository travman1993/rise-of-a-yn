// 📁 src/lib/supabase.ts
// Supabase client setup for RISE OF A YN

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// AUTH FUNCTIONS
export async function signUp(email: string, password: string, username: string) {
  try {
    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error('No user ID returned');

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert([
      {
        id: userId,
        email,
        username,
        prestige_level: 0,
        total_prestiges: 0,
      },
    ]);

    if (profileError) throw profileError;

    // Create player stats
    const { error: statsError } = await supabase.from('player_stats').insert([
      {
        user_id: userId,
        cash: 1000,
        xp: 0,
        respect: 0,
        level: 1,
        tier: 1,
        energy: 100,
        max_energy: 100,
      },
    ]);

    if (statsError) throw statsError;

    return { success: true, userId };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// GET USER PROFILE
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}

// GET PLAYER STATS
export async function getPlayerStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get player stats error:', error);
    return null;
  }
}

// UPDATE PLAYER STATS
export async function updatePlayerStats(userId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update player stats error:', error);
    throw error;
  }
}

// GET BUSINESSES
export async function getBusinesses(userId: string) {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get businesses error:', error);
    return [];
  }
}

// CREATE BUSINESS
export async function createBusiness(userId: string, business: any) {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .insert([{ user_id: userId, ...business }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create business error:', error);
    throw error;
  }
}

// UPDATE BUSINESS
export async function updateBusiness(businessId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update business error:', error);
    throw error;
  }
}

// GET ASSETS
export async function getAssets(userId: string) {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get assets error:', error);
    return [];
  }
}

// BUY ASSET
export async function buyAsset(userId: string, assetId: string) {
  try {
    const { data, error } = await supabase
      .from('assets')
      .update({ owned: true, purchased_at: new Date().toISOString() })
      .eq('id', assetId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Buy asset error:', error);
    throw error;
  }
}

// HIRE MANAGER
export async function hireManager(businessId: string) {
  try {
    const { data: business, error: fetchError } = await supabase
      .from('businesses')
      .select('manager_level')
      .eq('id', businessId)
      .single();

    if (fetchError) throw fetchError;

    const newLevel = (business.manager_level || 0) + 1;

    const { data, error } = await supabase
      .from('businesses')
      .update({ manager_level: newLevel })
      .eq('id', businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Hire manager error:', error);
    throw error;
  }
}

// HIRE INVESTOR
export async function hireInvestor(businessId: string) {
  try {
    const { data: business, error: fetchError } = await supabase
      .from('businesses')
      .select('investor_level')
      .eq('id', businessId)
      .single();

    if (fetchError) throw fetchError;

    const newLevel = (business.investor_level || 0) + 1;

    const { data, error } = await supabase
      .from('businesses')
      .update({ investor_level: newLevel })
      .eq('id', businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Hire investor error:', error);
    throw error;
  }
}

// GET LEADERBOARD
export async function getLeaderboard(type: 'wealth' | 'respect' | 'prestige', limit: number = 10) {
  try {
    let query = supabase.from('users').select('username, prestige_level');

    if (type === 'wealth') {
      query = query.order('total_wealth', { ascending: false });
    } else if (type === 'respect') {
      query = query.order('total_respect', { ascending: false });
    } else {
      query = query.order('prestige_level', { ascending: false });
    }

    const { data, error } = await query.limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return [];
  }
}