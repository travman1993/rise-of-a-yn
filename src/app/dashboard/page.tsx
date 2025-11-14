// 📁 src/app/dashboard/page.tsx
// FIXED - Main game dashboard with energy regen timer and asset cards

'use client';

import { useOfflineEarnings } from '@/lib/useOfflineEarnings';
import { OfflineEarningsModal } from '@/components/OfflineEarningsModal';
import { AssetCard } from '@/components/AssetCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, getPlayerStats, updatePlayerStats, getBusinesses, getAssets } from '@/lib/supabase';
import { calculateLevel, formatCash } from '@/lib/gameLogic';
import { calculateEnergyRegen, formatTimeRemaining } from '@/lib/energy';
import { useEnergyRegen } from '@/lib/useEnergyRegen';
import styles from './dashboard.module.css';
import { HustleCard } from '@/components/HustleCard';
import { HUSTLES } from '@/lib/tierData';

interface AssetWithCount {
  id: string;
  name: string;
  tier: number;
  icon: string;
  count: number;
  type: 'home' | 'car';
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [assets, setAssets] = useState<AssetWithCount[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [energyTimer, setEnergyTimer] = useState<string>('Full');
  const [hustleLoading, setHustleLoading] = useState(false);

  // LOAD PLAYER DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/');
          return;
        }

        const playerStats = await getPlayerStats(currentUser.id);
        const playerBusinesses = await getBusinesses(currentUser.id);
        const playerAssets = await getAssets(currentUser.id);

        setUser(currentUser);
        setStats(playerStats);
        setBusinesses(playerBusinesses);

        // Process assets: group by name and count duplicates
        const assetMap = new Map<string, AssetWithCount>();
        playerAssets.forEach((asset: any) => {
          const key = asset.id;
          if (assetMap.has(key)) {
            const existing = assetMap.get(key)!;
            existing.count += 1;
          } else {
            assetMap.set(key, {
              id: asset.id,
              name: asset.name,
              tier: asset.tier,
              icon: asset.image_url || '📦',
              count: 1,
              type: asset.asset_type,
            });
          }
        });

        // Sort by tier (highest first), then by name
        const sortedAssets = Array.from(assetMap.values()).sort((a, b) => {
          if (a.tier !== b.tier) return b.tier - a.tier;
          return a.name.localeCompare(b.name);
        });

        setAssets(sortedAssets);
      } catch (error) {
        console.error('Load error:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // USE ENERGY REGEN HOOK - Auto-updates energy every 60 seconds
  useEnergyRegen(user?.id, stats, (newEnergy) => {
    setStats((prev: any) => ({ ...prev, energy: newEnergy }));
  });

  const handleExecuteHustle = async (hustle: any) => {
    if (!stats || stats.energy < hustle.energy) {
      alert('Not enough energy!');
      return;
    }
  
    setHustleLoading(true);
    try {
      const hustleReward = hustle.reward;
      const xpReward = hustle.xp;
  
      const updated = await updatePlayerStats(stats.user_id, {
        cash: stats.cash + hustleReward,
        xp: stats.xp + xpReward,
        energy: Math.max(0, stats.energy - hustle.energy),
        last_energy_regen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
  
      setStats(updated);
  
      // Show success message
      alert(`✅ ${hustle.name} Complete!\n+${hustleReward} Cash\n+${xpReward} XP`);
    } catch (error) {
      console.error('Hustle error:', error);
      alert('Hustle failed!');
    } finally {
      setHustleLoading(false);
    }
  };

  // ENERGY TIMER - Updates display every second
  useEffect(() => {
    if (!stats) return;

    const interval = setInterval(() => {
      const lastRegen = stats.last_energy_regen || new Date().toISOString();
      const { timeUntilFull } = calculateEnergyRegen(
        lastRegen,
        stats.max_energy,
        stats.energy
      );

      setEnergyTimer(formatTimeRemaining(timeUntilFull));
    }, 1000);

    return () => clearInterval(interval);
  }, [stats]);

  const {
    showEarningsModal,
    earningsData,
    loading: earningsLoading,
    claimEarnings,
    closeModal,
  } = useOfflineEarnings(user?.id, (data) => {
    setStats((prev: any) => ({ ...prev, cash: data.newCash }));
  });

  // HUSTLE - TAP TO EARN
  const handleHustle = async () => {
    if (!stats || stats.energy < 10) {
      alert('Not enough energy! Restore: ' + energyTimer);
      return;
    }

    const hustleReward = Math.floor(stats.tier * 500);
    const xpReward = Math.floor(stats.tier * 10);

    try {
      const updated = await updatePlayerStats(stats.user_id, {
        cash: stats.cash + hustleReward,
        xp: stats.xp + xpReward,
        energy: stats.energy - 10,
        last_energy_regen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      setStats(updated);
    } catch (error) {
      console.error('Hustle error:', error);
    }
  };

  // COLLECT FROM BUSINESSES
  const handleCollectBusiness = async (businessId: string) => {
    const business = businesses.find((b) => b.id === businessId);
    if (!business) return;

    const income = business.current_income || business.base_income;

    try {
      const updated = await updatePlayerStats(stats.user_id, {
        cash: stats.cash + income,
        updated_at: new Date().toISOString(),
      });

      setStats(updated);

      // Update business last_collected
      await fetch(`/api/businesses/${businessId}`, {
        method: 'PUT',
        body: JSON.stringify({ last_collected: new Date().toISOString() }),
      });

      setBusinesses(
        businesses.map((b) =>
          b.id === businessId ? { ...b, last_collected: new Date().toISOString() } : b
        )
      );
    } catch (error) {
      console.error('Collect error:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>LOADING GAME...</div>
      </div>
    );
  }

  const level = calculateLevel(stats?.xp || 0, businesses.length);
  const nextLevelXP = Math.floor(250 * Math.pow(level + 1, 2) * (1 + (stats?.tier || 1) * 0.25));

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <h1 className={styles.title}>RISE OF A YN</h1>
        <div className={styles.userInfo}>
          <span>{user?.email}</span>
          <button
            onClick={() => {
              router.push('/');
            }}
            className={styles.logoutBtn}
          >
            EXIT
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className={styles.main}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <button
              className={`${styles.navBtn} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 OVERVIEW
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === 'hustle' ? styles.active : ''}`}
              onClick={() => setActiveTab('hustle')}
            >
              💪 HUSTLE
            </button>
            <Link href="/dashboard/businesses" className={styles.navBtn}>
              🏢 BUSINESSES
            </Link>
            <Link href="/dashboard/shop" className={styles.navBtn}>
              🛍️ SHOP
            </Link>
            <Link href="/dashboard/minigames" className={styles.navBtn}>
              🎲 GAMES
            </Link>
            <Link href="/dashboard/leaderboards" className={styles.navBtn}>
              🏆 LEADERBOARDS
            </Link>
            <Link href="/dashboard/crews" className={styles.navBtn}>
              👥 CREWS
            </Link>
            <Link href="/dashboard/prestige" className={styles.navBtn}>
              💎 PRESTIGE
            </Link>
            <Link href="/dashboard/boss" className={styles.navBtn}>
              🔫 BOSS
            </Link>
          </nav>
        </aside>

        {/* CONTENT */}
        <main className={styles.content}>
          {/* STATS BAR */}
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.label}>CASH</span>
              <span style={{ color: '#ffd700' }}>{formatCash(stats?.cash || 0)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>LEVEL</span>
              <span style={{ color: '#00d4ff' }}>{level}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>XP</span>
              <span style={{ color: '#7c3aed' }}>{stats?.xp || 0} / {nextLevelXP}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>RESPECT</span>
              <span style={{ color: '#ff6b6b' }}>{stats?.respect || 0}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>TIER</span>
              <span style={{ color: '#ffd700' }}>{stats?.tier || 1}</span>
            </div>
          </div>

          {/* TABS CONTENT */}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className={styles.tabContent}>
              <div>
                <h2 style={{ color: '#ffd700', marginBottom: '16px' }}>GAME STATUS</h2>
                <div className={styles.grid}>
                  <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
                    <h3 style={{ color: '#ffd700', margin: '0 0 8px' }}>📈 LEVEL</h3>
                    <p style={{ fontSize: '32px', fontWeight: '900', margin: '10px 0', color: '#ffd700' }}>{level}</p>
                    <p style={{ color: '#a0aec0', fontSize: '12px' }}>
                      {stats?.xp || 0} / {nextLevelXP} XP
                    </p>
                  </div>

                  <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
                    <h3 style={{ color: '#ffd700', margin: '0 0 8px' }}>💰 NET WORTH</h3>
                    <p style={{ fontSize: '28px', fontWeight: '900', margin: '10px 0', color: '#ffd700' }}>
                      {formatCash(stats?.cash || 0)}
                    </p>
                    <p style={{ color: '#a0aec0', fontSize: '12px' }}>Total wealth</p>
                  </div>

                  <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
                    <h3 style={{ color: '#ffd700', margin: '0 0 8px' }}>🏢 BUSINESSES</h3>
                    <p style={{ fontSize: '32px', fontWeight: '900', margin: '10px 0', color: '#00d4ff' }}>
                      {businesses.length}
                    </p>
                    <p style={{ color: '#a0aec0', fontSize: '12px' }}>Owned properties</p>
                  </div>

                  <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
                    <h3 style={{ color: '#ffd700', margin: '0 0 8px' }}>⚡ ENERGY</h3>
                    <p style={{ fontSize: '32px', fontWeight: '900', margin: '10px 0', color: '#ff6b6b' }}>
                      {stats?.energy || 0}
                    </p>
                    <p style={{ color: '#a0aec0', fontSize: '12px' }}>
                      Full in: {energyTimer}
                    </p>
                  </div>
                </div>
              </div>

              {/* ASSETS SECTION */}
              {assets.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                  <h2 style={{ color: '#ffd700', marginBottom: '16px' }}>🏆 YOUR ASSETS</h2>
                  <p style={{ color: '#b3b3b3', marginBottom: '16px' }}>
                    {assets.length} unique asset{assets.length !== 1 ? 's' : ''} ({assets.reduce((sum, a) => sum + a.count, 0)} total)
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                    {assets.map((asset) => (
                      <AssetCard key={`${asset.type}-${asset.id}`} asset={asset} tier={asset.tier} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HUSTLE TAB */}
          {activeTab === 'hustle' && (
            <div className={styles.tabContent}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#ffd700', marginBottom: '8px' }}>TAP TO EARN</h2>
                <p style={{ color: '#b3b3b3', fontSize: '12px', margin: 0 }}>
                  Tier {stats?.tier} - Higher danger = higher rewards. Choose wisely.
                </p>
              </div>

              {/* ENERGY STATUS */}
              <div style={{
                background: 'rgba(255, 107, 107, 0.1)',
                border: '1px solid #ff6b6b',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#b3b3b3' }}>⚡ ENERGY</span>
                  <span style={{ color: '#ffd700', fontWeight: '900' }}>
                    {stats?.energy || 0}/{stats?.max_energy || 100}
                  </span>
                  <span style={{ color: '#b3b3b3', fontSize: '12px' }}>
                    Full in: {energyTimer}
                  </span>
                </div>
              </div>

              {/* HUSTLES GRID */}
              {(() => {
                const currentTierHustles = HUSTLES[stats?.tier as keyof typeof HUSTLES] || [];
                return (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px',
                  }}>
                    {currentTierHustles.map((hustle: any) => (
                      <HustleCard
                        key={hustle.id}
                        hustle={hustle}
                        currentEnergy={stats?.energy || 0}
                        maxEnergy={stats?.max_energy || 100}
                        onExecute={handleExecuteHustle}
                        loading={hustleLoading}
                      />
                    ))}
                  </div>
                );
              })()}

              {/* EMPTY STATE */}
              {(!HUSTLES[stats?.tier as keyof typeof HUSTLES] || 
                HUSTLES[stats?.tier as keyof typeof HUSTLES].length === 0) && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#b3b3b3',
                }}>
                  <p>No hustles available for this tier yet.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* OFFLINE EARNINGS MODAL */}
      {earningsData && (
        <OfflineEarningsModal
          show={showEarningsModal}
          offlineIncome={earningsData.offlineIncome}
          offlineMinutes={earningsData.offlineMinutes}
          capped={earningsData.capped}
          loading={earningsLoading}
          onClaim={claimEarnings}
          onClose={closeModal}
        />
      )}
    </div>
  );
}