// 📁 src/app/api/auth/route.ts
// Authentication API endpoints

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, username } = await request.json();

    if (action === 'signup') {
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

      return NextResponse.json({ success: true, userId });
    }

    if (action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return NextResponse.json({ success: true, user: data.user });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}