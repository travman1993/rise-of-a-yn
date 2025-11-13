// 📁 src/app/dashboard/boss/page.tsx
// Boss Fight - Cinematic tier progression

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPlayerStats, updatePlayerStats } from '@/lib/supabase';
import { formatCash, calculatePower } from '@/lib/gameLogic';
import styles from './boss.module.css';

interface BossInfo {
  tier: number;
  name: string;
  powerRequired: number;
  cashReward: number;
  xpReward: number;
  respectReward: number;
}

interface BossResult {
  result: 'WIN' | 'LOSE';
  message: string;
  rewards?: { cash: number; xp: number; respect: number };
  penalty?: number;
  newTier?: number;
}

export default function BossPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [boss, setBoss] = useState<BossInfo | null>(null);
  const [playerPower, setPlayerPower] = useState(0);
  const [canFight, setCanFight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fighting, setFighting] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [result, setResult] = useState<BossResult | null>(null);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const playerStats = await getPlayerStats(currentUser.id);
        setStats(playerStats);
        loadBossInfo(currentUser.id, playerStats);
      }
    };
    load();
  }, []);

  const loadBossInfo = async (userId: string, playerStats: any) => {
    try {
      const res = await fetch(`/api/boss?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setBoss(data.boss);
        setPlayerPower(data.playerPower);
        setCanFight(data.canFight);
      }
    } catch (error) {
      console.error('Load boss error:', error);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (!fighting) return;

    if (countdown === 0) {
      handleFight();
      return;
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [fighting, countdown]);

  const handleStartFight = () => {
    if (!canFight) {
      alert('Not strong enough!');
      return;
    }

    setFighting(true);
    setCountdown(10);
  };

  const handleFight = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch('/api/boss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
        setFighting(false);

        // Update local stats
        if (data.result === 'WIN') {
          const updated = await getPlayerStats(user.id);
          setStats(updated);
        }
      } else {
        alert(data.error);
        setFighting(false);
      }
    } catch (error) {
      console.error('Fight error:', error);
      alert('Fight failed');
      setFighting(false);
    } finally {
      setLoading(false);
    }
  };

  if (!stats || !boss)
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>Loading boss info...</div>
      </div>
    );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🔫 BOSS FIGHT</h1>
          <button onClick={() => router.back()} className={styles.backBtn}>
            ← BACK
          </button>
        </div>

        {!result ? (
          <>
            {/* BOSS INFO */}
            <div className={styles.bossCard}>
              <div className={styles.bossIcon}>👹</div>
              <h2 className={styles.bossName}>{boss.name}</h2>
              <p className={styles.bossDesc}>Tier {boss.tier} Boss</p>

              <div className={styles.bossStats}>
                <div className={styles.stat}>
                  <span className={styles.label}>Power Required</span>
                  <span className={styles.value}>{boss.powerRequired.toLocaleString()}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Your Power</span>
                  <span className={`${styles.value} ${canFight ? styles.ready : styles.weak}`}>
                    {playerPower.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={styles.rewards}>
                <h3>🏆 Rewards for Winning:</h3>
                <p>💰 {formatCash(boss.cashReward)}</p>
                <p>🧠 {boss.xpReward} XP</p>
                <p>🔥 {boss.respectReward} Respect</p>
                <p>⬆️ Promoted to Tier {boss.tier}</p>
              </div>
            </div>

            {/* COUNTDOWN */}
            {fighting && (
              <div className={styles.countdownOverlay}>
                <div className={styles.countdownBox}>
                  <p className={styles.countdownText}>FIGHT STARTS IN</p>
                  <p className={styles.countdownNumber}>{countdown}</p>
                </div>
              </div>
            )}

            {/* FIGHT BUTTON */}
            <button
              onClick={handleStartFight}
              disabled={!canFight || fighting || loading}
              className={styles.fightBtn}
            >
              {!canFight ? '🔒 NOT READY' : fighting ? '⏳ STARTING...' : '⚔️ FIGHT BOSS'}
            </button>
          </>
        ) : (
          <>
            {/* RESULT */}
            <div className={`${styles.resultCard} ${result.result === 'WIN' ? styles.victory : styles.defeat}`}>
              <p className={styles.resultTitle}>
                {result.result === 'WIN' ? '🏆 VICTORY!' : '💀 DEFEAT'}
              </p>

              <p className={styles.resultMessage}>{result.message}</p>

              {result.result === 'WIN' && result.rewards && (
                <div className={styles.rewardsDisplay}>
                  <h4>💎 You Earned:</h4>
                  <p>💰 +{formatCash(result.rewards.cash)}</p>
                  <p>🧠 +{result.rewards.xp} XP</p>
                  <p>🔥 +{result.rewards.respect} Respect</p>
                  <p className={styles.tierUp}>⬆️ Tier {result.newTier} Unlocked!</p>
                </div>
              )}

              {result.result === 'LOSE' && (
                <div className={styles.penaltyDisplay}>
                  <h4>⚠️ Penalties:</h4>
                  <p>💸 Lost {formatCash(result.penalty || 0)}</p>
                  <p>🔥 Lost 10 Respect</p>
                </div>
              )}

              <button
                onClick={() => {
                  setResult(null);
                  loadBossInfo(user.id, stats);
                }}
                className={styles.continueBtn}
              >
                {result.result === 'WIN' ? '✓ Continue' : '🔄 Try Again'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}