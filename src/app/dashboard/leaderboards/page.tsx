// 📁 src/app/dashboard/leaderboards/page.tsx
// Global Leaderboards - Full width, clean layout

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase';
import { formatCash } from '@/lib/gameLogic';
import styles from './leaderboards.module.css';

type LeaderboardType = 'wealth' | 'respect' | 'prestige' | 'level';

interface LeaderboardEntry {
  rank: number;
  username: string;
  value: number;
  prestigeLevel: number;
  level: number;
  cash: number;
  respect: number;
}

export default function LeaderboardsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeType, setActiveType] = useState<LeaderboardType>('wealth');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    load();
  }, []);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/leaderboards/get?type=${activeType}&limit=100`);
        const data = (await res.json()) as { leaderboard: LeaderboardEntry[] };
        setLeaderboard(data.leaderboard || []);

        // Find user's rank
        if (user) {
          const username = user.email?.split('@')[0] || '';
          const userEntry = data.leaderboard?.find((entry: LeaderboardEntry) => entry.username === username);
          setUserRank(userEntry || null);
        }
      } catch (error) {
        console.error('Leaderboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadLeaderboard();
    }
  }, [activeType, user]);

  const getValueDisplay = (entry: LeaderboardEntry) => {
    if (activeType === 'wealth') return formatCash(entry.cash);
    if (activeType === 'respect') return entry.respect.toLocaleString();
    if (activeType === 'prestige') return entry.prestigeLevel;
    return entry.level;
  };

  const getLabel = (type: LeaderboardType): string => {
    const labels: Record<LeaderboardType, string> = {
      wealth: '💰 NET WORTH',
      respect: '🔥 RESPECT',
      prestige: '💎 PRESTIGE',
      level: '📈 LEVEL',
    };
    return labels[type];
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🏆 LEADERBOARDS</h1>
          <button onClick={() => router.back()} className={styles.backBtn}>
            ← BACK
          </button>
        </div>

        {/* TABS */}
        <div className={styles.tabs}>
          {(['wealth', 'respect', 'prestige', 'level'] as LeaderboardType[]).map((type) => (
            <button
              key={type}
              className={`${styles.tab} ${activeType === type ? styles.active : ''}`}
              onClick={() => setActiveType(type)}
            >
              {getLabel(type)}
            </button>
          ))}
        </div>

        {/* USER RANK */}
        {userRank && (
          <div className={styles.userRank}>
            <div className={styles.rankCard}>
              <div className={styles.rankBadge}>#{userRank.rank}</div>
              <div className={styles.rankInfo}>
                <div>
                  <p className={styles.username}>👤 {userRank.username}</p>
                  <p className={styles.value}>{getValueDisplay(userRank)}</p>
                </div>
                <p className={styles.extra}>Level {userRank.level} • {userRank.prestigeLevel}x Prestige</p>
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD */}
        <div className={styles.leaderboardWrapper}>
          {loading ? (
            <p className={styles.loading}>Loading leaderboard...</p>
          ) : leaderboard.length === 0 ? (
            <p className={styles.empty}>No entries yet</p>
          ) : (
            <div className={styles.leaderboard}>
              {leaderboard.map((entry, idx) => (
                <div key={idx} className={styles.row}>
                  <div className={styles.rank}>
                    {entry.rank === 1 && '👑'}
                    {entry.rank === 2 && '🥈'}
                    {entry.rank === 3 && '🥉'}
                    {entry.rank > 3 && `#${entry.rank}`}
                  </div>
                  <div className={styles.name}>
                    <p>{entry.username}</p>
                    <p className={styles.detail}>Lvl {entry.level} • {entry.prestigeLevel}x</p>
                  </div>
                  <div className={styles.value}>
                    {getValueDisplay(entry)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}