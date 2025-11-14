// 📁 src/app/dashboard/leaderboards/page.tsx
// FIXED Leaderboards - Shows actual leaders with real data

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPlayerStats } from '@/lib/supabase';
import { formatCash } from '@/lib/gameLogic';
import styles from './leaderboards.module.css';

type LeaderboardType = 'wealth' | 'respect' | 'prestige' | 'level';

interface LeaderboardEntry {
  rank: number;
  username: string;
  userId: string;
  value: number;
  prestigeLevel: number;
  level: number;
  cash: number;
  respect: number;
  tier: number;
}

export default function LeaderboardsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeType, setActiveType] = useState<LeaderboardType>('wealth');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  // Load current user
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

  // Load leaderboard
  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        console.log(`[Leaderboard] Fetching ${activeType} leaderboard...`);
        
        const res = await fetch(`/api/leaderboards/get?type=${activeType}&limit=100`);
        
        if (!res.ok) {
          console.error('[Leaderboard] API error:', res.status, res.statusText);
          const errorData = await res.json();
          console.error('[Leaderboard] Error details:', errorData);
          setLeaderboard([]);
          return;
        }

        const data = await res.json();
        
        console.log('[Leaderboard] API Response:', data);
        console.log('[Leaderboard] Leaderboard entries:', data.leaderboard?.length);
        
        if (data.leaderboard && data.leaderboard.length > 0) {
          setLeaderboard(data.leaderboard);

          // Find current user's rank
          if (user) {
            const username = user.email?.split('@')[0] || '';
            console.log('[Leaderboard] Looking for user:', username);
            
            const userEntry = data.leaderboard.find(
              (entry: LeaderboardEntry) => entry.username === username
            );
            
            if (userEntry) {
              console.log('[Leaderboard] Found user rank:', userEntry.rank);
              setUserRank(userEntry);
            } else {
              console.log('[Leaderboard] User not in top 100');
              setUserRank(null);
            }
          }
        } else {
          console.warn('[Leaderboard] No entries returned');
          setLeaderboard([]);
        }
      } catch (error) {
        console.error('[Leaderboard] Error loading:', error);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [activeType, user]);

  const getValueDisplay = (entry: LeaderboardEntry) => {
    if (activeType === 'wealth') return formatCash(entry.cash);
    if (activeType === 'respect') return entry.respect.toLocaleString();
    if (activeType === 'prestige') return `${entry.prestigeLevel}x`;
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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* HEADER */}
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

        {/* USER'S RANK */}
        {userRank && (
          <div className={styles.userRankSection}>
            <h3 className={styles.userRankTitle}>👤 YOUR RANK</h3>
            <div className={styles.rankCard}>
              <div className={styles.rankBadge}>{getRankIcon(userRank.rank)}</div>
              <div className={styles.rankInfo}>
                <div className={styles.rankDetails}>
                  <p className={styles.username}>#{userRank.rank} - {userRank.username}</p>
                  <p className={styles.rankExtra}>Tier {userRank.tier} • Level {userRank.level} • {userRank.prestigeLevel}x Prestige</p>
                </div>
                <div className={styles.rankValue}>
                  {getValueDisplay(userRank)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD */}
        <div className={styles.leaderboardWrapper}>
          {loading ? (
            <p className={styles.loading}>Loading leaderboard...</p>
          ) : leaderboard.length === 0 ? (
            <p className={styles.empty}>No players on leaderboard yet. Be the first!</p>
          ) : (
            <div className={styles.leaderboard}>
              {leaderboard.map((entry, idx) => (
                <div 
                  key={`${entry.userId}-${idx}`} 
                  className={`${styles.row} ${userRank?.userId === entry.userId ? styles.currentUser : ''}`}
                >
                  <div className={styles.rank}>
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className={styles.name}>
                    <p>{entry.username}</p>
                    <p className={styles.detail}>Tier {entry.tier} • Lvl {entry.level} • {entry.prestigeLevel}x</p>
                  </div>
                  <div className={styles.value}>
                    {getValueDisplay(entry)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STATS INFO */}
        <div className={styles.statsInfo}>
          <p className={styles.infoText}>
            📊 Leaderboards update in real-time as players progress. 
            Climb the ranks and prove you're the ultimate mogul!
          </p>
        </div>
      </div>
    </div>
  );
}