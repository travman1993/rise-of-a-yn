// 📁 src/lib/useEnergyRegen.ts
// Custom hook for real-time energy regeneration - Syncs with DB
// FIXED: Prevent constant resets, proper time tracking, safety bounds for negative energy

import { useEffect, useRef } from 'react';
import { supabase } from './supabase';

export function useEnergyRegen(
  userId: string | undefined,
  stats: any,
  onEnergyUpdate: (newEnergy: number) => void
) {
  const lastRegenTimeRef = useRef<number>(0);
  const lastEnergyRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);

  // INITIALIZE ONLY ONCE - Store server time reference
  useEffect(() => {
    if (!stats || isInitializedRef.current) return;

    // Clamp energy to valid range immediately (FIX: prevents negative energy bug)
    const clampedEnergy = Math.max(0, Math.min(stats.energy || 0, stats.max_energy || 100));

    // Parse the server's last_energy_regen timestamp
    const serverTime = stats.last_energy_regen 
      ? new Date(stats.last_energy_regen).getTime() 
      : Date.now();

    // Store the server time when we initialized
    lastRegenTimeRef.current = serverTime;
    lastEnergyRef.current = clampedEnergy;
    isInitializedRef.current = true;

    console.log('Energy system initialized:', {
      rawEnergy: stats.energy,
      clampedEnergy: clampedEnergy,
      maxEnergy: stats.max_energy,
      lastRegenTime: new Date(serverTime).toISOString(),
    });
  }, [stats]); // Watch stats for initial load, guard prevents re-runs

  // DISPLAY UPDATE - Every 1 second (client-side only, no DB calls)
  useEffect(() => {
    if (!stats || !isInitializedRef.current) return;

    const displayInterval = setInterval(() => {
      const now = Date.now();
      const millisecondsPassed = now - lastRegenTimeRef.current;
      const secondsPassed = millisecondsPassed / 1000;
      
      // 1 energy per 60 seconds (60 seconds = 1 energy)
      const energyRestored = Math.floor(secondsPassed / 60);
      const newEnergy = Math.max(0, Math.min(
        lastEnergyRef.current + energyRestored,
        stats.max_energy || 100
      ));

      // Safety check: only update if within valid range
      if (newEnergy >= 0 && newEnergy <= (stats.max_energy || 100)) {
        onEnergyUpdate(newEnergy);
      }
    }, 1000);

    return () => clearInterval(displayInterval);
  }, [stats?.max_energy, onEnergyUpdate]); // Only depend on max_energy changes

  // DATABASE SYNC - Every 60 seconds (persist to server)
  useEffect(() => {
    if (!userId || !stats || !isInitializedRef.current) return;

    const syncInterval = setInterval(async () => {
      try {
        const now = Date.now();
        const millisecondsPassed = now - lastRegenTimeRef.current;
        const secondsPassed = millisecondsPassed / 1000;
        const energyRestored = Math.floor(secondsPassed / 60);
        const newEnergy = Math.max(0, Math.min(
          lastEnergyRef.current + energyRestored,
          stats.max_energy || 100
        ));

        if (newEnergy > lastEnergyRef.current) {
          // Only sync if energy actually changed and is valid
          const safeEnergy = Math.max(0, Math.min(newEnergy, stats.max_energy || 100));
          
          await supabase
            .from('player_stats')
            .update({
              energy: safeEnergy,
              last_energy_regen: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          console.log('Energy synced to DB:', safeEnergy);
          
          // Reset tracking for next 60-second cycle
          lastRegenTimeRef.current = Date.now();
          lastEnergyRef.current = safeEnergy;
        }
      } catch (error) {
        console.error('Energy sync error:', error);
      }
    }, 60000);

    return () => clearInterval(syncInterval);
  }, [userId, stats?.max_energy]);

  // Update refs ONLY when energy is used (from hustles, etc)
  // This fires when the parent updates stats.energy after a hustle
  useEffect(() => {
    if (!isInitializedRef.current) return;

    // Clamp incoming energy to valid range
    const newEnergy = Math.max(0, Math.min(stats?.energy || 0, stats?.max_energy || 100));
    
    // Only update if energy decreased (hustle was used)
    if (newEnergy < lastEnergyRef.current) {
      console.log('Energy used:', lastEnergyRef.current, '->', newEnergy);
      lastEnergyRef.current = newEnergy;
      lastRegenTimeRef.current = Date.now(); // Reset regen timer after use
    }
  }, [stats?.energy, stats?.max_energy]);
}