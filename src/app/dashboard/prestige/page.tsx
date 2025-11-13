// 📁 src/app/dashboard/prestige/page.tsx
// Prestige - Restart with Harder Economics + Permanent Bonuses

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPlayerStats, updatePlayerStats } from '@/lib/supabase';
import { formatCash } from '@/lib/gameLogic';
import { canPrestige, getPrestigeState, calculatePrestigeReset, getPrestigeName, describePrestige } from '@/lib/prestige';
import { PRESTIGE_CONFIG } from '@/lib/types';
import styles from './prestige.module.css';

export default function PrestigePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const playerStats = await getPlayerStats(currentUser.id);
        setStats(playerStats);
      }
    };
    load();
  }, []);

  const handlePrestige = async () => {
    if (!stats) return;

    if (!canPrestige(stats.tier, stats.level, stats.cash)) {
      alert('Requirements not met');
      return;
    }

    setConfirming(true);

    try {
      const prestigeReward = calculatePrestigeReset(stats, stats.prestige_level || 0);

      // Update player with new stats
      await updatePlayerStats(stats.user_id, {
        cash: prestigeReward.cash,
        xp: prestigeReward.xp,
        respect: prestigeReward.respect,
        level: 1,
        tier: 1,
        prestige_level: prestigeReward.totalPrestiges,
        total_prestiges: prestigeReward.totalPrestiges,
        updated_at: new Date().toISOString(),
      });

      // Show prestige animation
      setTimeout(() => {
        alert(`✨ PRESTIGE #${prestigeReward.totalPrestiges}!\n\nRestarting at Tier 1 with ${getPrestigeName(prestigeReward.totalPrestiges)} status.\n\nKeep 10% Respect: +${prestigeReward.respect}`);
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Prestige error:', error);
      alert('Prestige failed');
    } finally {
      setConfirming(false);
    }
  };

  if (!stats) return <div>Loading...</div>;

  const canPress = canPrestige(stats.tier, stats.level, stats.cash);
  const prestigeReward = calculatePrestigeReset(stats, stats.prestige_level || 0);
  const nextPrestigeState = getPrestigeState((stats.prestige_level || 0) + 1);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>💎 PRESTIGE</h1>

      {/* CURRENT STATUS */}
      <div className={styles.panel}>
        <h2>Current Status</h2>
        <div className={styles.stat}>
          <span>Tier:</span>
          <span className={styles.value}>{stats.tier}</span>
        </div>
        <div className={styles.stat}>
          <span>Level:</span>
          <span className={styles.value}>{stats.level}</span>
        </div>
        <div className={styles.stat}>
          <span>Cash:</span>
          <span className={styles.value}>{formatCash(stats.cash)}</span>
        </div>
        <div className={styles.stat}>
          <span>Respect:</span>
          <span className={styles.value}>{stats.respect}</span>
        </div>
        <div className={styles.stat}>
          <span>Prestiges:</span>
          <span className={styles.value}>{stats.prestige_level || 0}</span>
        </div>
      </div>

      {/* REQUIREMENTS */}
      <div className={`${styles.panel} ${canPress ? styles.ready : styles.locked}`}>
        <h2>⚡ Requirements</h2>
        <div className={styles.requirement}>
          <span>Tier 5</span>
          <span className={stats.tier === 5 ? styles.met : styles.notMet}>{stats.tier === 5 ? '✅' : '❌'}</span>
        </div>
        <div className={styles.requirement}>
          <span>Level 80+</span>
          <span className={stats.level >= 80 ? styles.met : styles.notMet}>{stats.level >= 80 ? '✅' : '❌'}</span>
        </div>
        <div className={styles.requirement}>
          <span>$1 Billion Cash</span>
          <span className={stats.cash >= 1000000000 ? styles.met : styles.notMet}>
            {stats.cash >= 1000000000 ? '✅' : '❌'}
          </span>
        </div>
      </div>

      {/* REWARDS */}
      <div className={styles.panel}>
        <h2>🎁 Rewards</h2>
        <div className={styles.rewardBox}>
          <p className={styles.bigText}>
            Start with {formatCash(prestigeReward.cash)} + {prestigeReward.xp} XP
          </p>
          <p className={styles.subText}>Keep 10% Respect: +{prestigeReward.respect}</p>
          <p className={styles.subText}>Prestige Icon: {getPrestigeName(prestigeReward.totalPrestiges)}</p>
        </div>
      </div>

      {/* MULTIPLIERS */}
      <div className={styles.panel}>
        <h2>📊 New Prestige Multipliers</h2>
        <div className={styles.multipliers}>
          <div>
            <span>Price Inflation:</span>
            <span className={styles.value}>+{((nextPrestigeState.priceInflation - 1) * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span>Reward Reduction:</span>
            <span className={styles.value}>−{((1 - nextPrestigeState.rewardReduction) * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span>Power Bonus:</span>
            <span className={styles.value}>+{(nextPrestigeState.powerBonus * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span>XP Bonus:</span>
            <span className={styles.value}>+{(nextPrestigeState.xpBonus * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className={styles.info}>
        <p>
          {getPrestigeName(prestigeReward.totalPrestiges)} Status Unlocked! Everything resets to Tier 1, but you keep permanent bonuses and can climb faster with harder economics.
        </p>
      </div>

      {/* ACTION BUTTON */}
      <div className={styles.actions}>
        {canPress ? (
          <button onClick={handlePrestige} disabled={confirming} className={styles.prestigeBtn}>
            {confirming ? 'PRESTIGING...' : '🚀 PRESTIGE NOW'}
          </button>
        ) : (
          <button disabled className={styles.lockedBtn}>
            Requirements Not Met
          </button>
        )}
        <button onClick={() => router.back()} className={styles.backBtn}>
          BACK
        </button>
      </div>
    </div>
  );
}