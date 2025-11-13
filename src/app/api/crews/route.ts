// 📁 src/app/api/crews/route.ts
// Crews Management API

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch crew info or list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const crewId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (crewId) {
      // Get specific crew
      const { data: crew, error } = await supabase
        .from('crews')
        .select('*')
        .eq('id', crewId)
        .single();

      if (error) throw error;

      // Get crew members
      const { data: members, error: membersError } = await supabase
        .from('crew_members')
        .select('user_id, role, joined_at')
        .eq('crew_id', crewId);

      if (membersError) throw membersError;

      return NextResponse.json({
        success: true,
        crew,
        members,
        memberCount: members?.length || 0,
      });
    }

    if (userId) {
      // Get user's crew
      const { data: membership, error } = await supabase
        .from('crew_members')
        .select('crew_id, role')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!membership) {
        return NextResponse.json({ success: true, crew: null });
      }

      // Get crew details
      const { data: crew, error: crewError } = await supabase
        .from('crews')
        .select('*')
        .eq('id', membership.crew_id)
        .single();

      if (crewError) throw crewError;

      return NextResponse.json({
        success: true,
        crew,
        role: membership.role,
      });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Crews GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// POST - Create or join crew
export async function POST(request: NextRequest) {
  try {
    const { action, userId, crewName, crewTag, crewId } = await request.json();

    if (action === 'create') {
      if (!userId || !crewName || !crewTag) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }

      // Check if user already in crew
      const { data: existing } = await supabase
        .from('crew_members')
        .select('crew_id')
        .eq('user_id', userId)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'Already in a crew' }, { status: 400 });
      }

      // Create crew
      const { data: newCrew, error: crewError } = await supabase
        .from('crews')
        .insert([
          {
            name: crewName,
            tag: crewTag,
            leader_id: userId,
            member_count: 1,
            level: 1,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (crewError) throw crewError;

      // Add creator as member
      const { error: memberError } = await supabase
        .from('crew_members')
        .insert([
          {
            crew_id: newCrew.id,
            user_id: userId,
            role: 'leader',
            joined_at: new Date().toISOString(),
          },
        ]);

      if (memberError) throw memberError;

      return NextResponse.json({
        success: true,
        crew: newCrew,
        message: `Crew "${crewName}" created!`,
      });
    }

    if (action === 'join') {
      if (!userId || !crewId) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }

      // Check if user already in crew
      const { data: existing } = await supabase
        .from('crew_members')
        .select('crew_id')
        .eq('user_id', userId)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'Already in a crew' }, { status: 400 });
      }

      // Get crew
      const { data: crew, error: crewError } = await supabase
        .from('crews')
        .select('member_count')
        .eq('id', crewId)
        .single();

      if (crewError) throw crewError;

      if (crew.member_count >= 50) {
        return NextResponse.json({ error: 'Crew is full' }, { status: 400 });
      }

      // Add member
      const { error: memberError } = await supabase
        .from('crew_members')
        .insert([
          {
            crew_id: crewId,
            user_id: userId,
            role: 'member',
            joined_at: new Date().toISOString(),
          },
        ]);

      if (memberError) throw memberError;

      // Increment crew member count
      await supabase
        .from('crews')
        .update({ member_count: crew.member_count + 1 })
        .eq('id', crewId);

      return NextResponse.json({
        success: true,
        message: 'Joined crew!',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Crews POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Leave crew
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get user's crew
    const { data: membership, error: memberError } = await supabase
      .from('crew_members')
      .select('crew_id, role')
      .eq('user_id', userId)
      .single();

    if (memberError) throw memberError;

    const { crew_id, role } = membership;

    // If leader, disband crew
    if (role === 'leader') {
      // Delete all members
      await supabase.from('crew_members').delete().eq('crew_id', crew_id);

      // Delete crew
      await supabase.from('crews').delete().eq('id', crew_id);

      return NextResponse.json({
        success: true,
        message: 'Crew disbanded',
      });
    }

    // Otherwise, just remove member
    await supabase.from('crew_members').delete().eq('user_id', userId);

    // Decrement crew member count
    const { data: crew } = await supabase
      .from('crews')
      .select('member_count')
      .eq('id', crew_id)
      .single();

    await supabase
      .from('crews')
      .update({ member_count: Math.max(0, (crew?.member_count || 1) - 1) })
      .eq('id', crew_id);

    return NextResponse.json({
      success: true,
      message: 'Left crew',
    });
  } catch (error: any) {
    console.error('Crews DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}