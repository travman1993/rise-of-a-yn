// 📁 src/lib/useEnergyRegen.ts
// Custom hook for real-time energy regeneration - Syncs with DB

import { useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { calculateEnergyRegen } from './energy';

export function useEnergyRegen(
  userId: string | undefined,
  stats: any,
  onEnergyUpdate: (newEnergy: number) => void
) {
  const lastSyncRef = useRef<number>(0);
  const lastEnergyRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);

  // INITIALIZE ON MOUNT - Get real time from DB
  useEffect(() => {
    if (!stats || isInitializedRef.current) return;

    const lastRegenTime = stats.last_energy_regen 
      ? new Date(stats.last_energy_regen).getTime() 
      : Date.now();

    lastSyncRef.current = lastRegenTime;
    lastEnergyRef.current = Math.min(stats.energy, stats.max_energy);
    isInitializedRef.current = true;
  }, [stats]);

  // DISPLAY UPDATE - Every 1 second
  useEffect(() => {
    if (!stats || !isInitializedRef.current) return;

    const displayInterval = setInterval(() => {
      const now = Date.now();
      const secondsPassed = (now - lastSyncRef.current) / 1000;
      
      // 1 energy per 60 seconds
      const energyRestored = Math.floor(secondsPassed / 60);
      const newEnergy = Math.max(0, Math.min(
        lastEnergyRef.current + energyRestored,
        stats.max_energy
      ));

      onEnergyUpdate(newEnergy);
    }, 1000);

    return () => clearInterval(displayInterval);
  }, [stats, onEnergyUpdate]);

  // DATABASE SYNC - Every 60 seconds
  useEffect(() => {
    if (!userId || !stats || !isInitializedRef.current) return;

    const syncInterval = setInterval(async () => {
      try {
        const now = Date.now();
        const secondsPassed = (now - lastSyncRef.current) / 1000;
        const energyRestored = Math.floor(secondsPassed / 60);
        const newEnergy = Math.max(0, Math.min(
          lastEnergyRef.current + energyRestored,
          stats.max_energy
        ));

        // Update database
        await supabase
          .from('player_stats')
          .update({
            energy: newEnergy,
            last_energy_regen: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        // Reset sync timer
        lastSyncRef.current = Date.now();
        lastEnergyRef.current = newEnergy;
      } catch (error) {
        console.error('Energy sync error:', error);
      }
    }, 60000);

    return () => clearInterval(syncInterval);
  }, [userId, stats]);

  // Update ref when energy changes from outside (hustle, etc)
  useEffect(() => {
    if (!isInitializedRef.current) return;
    lastEnergyRef.current = Math.max(0, stats?.energy || 0);
    lastSyncRef.current = Date.now();
  }, [stats?.energy]);
}