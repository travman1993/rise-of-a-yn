// 📁 src/app/api/auth/logout/route.ts
// Logout endpoint

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}