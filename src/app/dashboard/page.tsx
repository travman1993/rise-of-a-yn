// 📁 src/app/dashboard/page.tsx
// Main game dashboard - WHERE THE GRIND HAPPENS

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPlayerStats, updatePlayerStats, getBusinesses } from '@/lib/supabase';
import { calculateLevel, formatCash } from '@/lib/gameLogic';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

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

        setUser(currentUser);
        setStats(playerStats);
        setBusinesses(playerBusinesses);
      } catch (error) {
        console.error('Load error:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // HUSTLE - TAP TO EARN
  const handleHustle = async () => {
    if (!stats || stats.energy < 10) {
      alert('Not enough energy!');
      return;
    }

    const hustleReward = Math.floor(stats.tier * 500);
    const xpReward = Math.floor(stats.tier * 10);

    try {
      const updated = await updatePlayerStats(stats.user_id, {
        cash: stats.cash + hustleReward,
        xp: stats.xp + xpReward,
        energy: stats.energy - 10,
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
      const businessUpdated = await fetch(`/api/businesses/${businessId}`, {
        method: 'PUT',
        body: JSON.stringify({ last_collected: new Date().toISOString() }),
      });

      if (businessUpdated.ok) {
        setBusinesses(
          businesses.map((b) =>
            b.id === businessId ? { ...b, last_collected: new Date().toISOString() } : b
          )
        );
      }
    } catch (error) {
      console.error('Collect error:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>LOADING GAME...</p>
        </div>
      </div>
    );
  }

  const level = calculateLevel(stats?.xp || 0, businesses.length);
  const nextLevelXP = Math.floor(250 * Math.pow(level + 1, 2) * (1 + (stats?.tier || 1) * 0.25));

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className="neon-text">RISE OF A YN</span>
        </h1>
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
            <button
              className={`${styles.navBtn} ${activeTab === 'businesses' ? styles.active : ''}`}
              onClick={() => setActiveTab('businesses')}
            >
              🏢 BUSINESSES
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === 'shop' ? styles.active : ''}`}
              onClick={() => setActiveTab('shop')}
            >
              🛍️ SHOP
            </button>
          </nav>
        </aside>

        {/* CONTENT */}
        <main className={styles.content}>
          {/* STATS BAR */}
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.label}>CASH</span>
              <span className="neon-text">{formatCash(stats?.cash || 0)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>LEVEL</span>
              <span className="neon-text-cyan">{level}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>XP</span>
              <span className="neon-text-purple">{stats?.xp || 0} / {nextLevelXP}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>RESPECT</span>
              <span className="neon-text-pink">{stats?.respect || 0}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>TIER</span>
              <span className="neon-text">{stats?.tier || 1}</span>
            </div>
          </div>

          {/* TABS CONTENT */}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className={styles.tabContent}>
              <h2>GAME STATUS</h2>
              <div className={styles.grid}>
                <div className="card-gritty">
                  <h3>📈 LEVEL</h3>
                  <p className="neon-text" style={{ fontSize: '32px', margin: '10px 0' }}>
                    {level}
                  </p>
                  <p style={{ color: '#a0aec0', fontSize: '12px' }}>
                    {stats?.xp || 0} / {nextLevelXP} XP
                  </p>
                </div>

                <div className="card-gritty">
                  <h3>💰 NET WORTH</h3>
                  <p className="neon-text" style={{ fontSize: '28px', margin: '10px 0' }}>
                    {formatCash(stats?.cash || 0)}
                  </p>
                  <p style={{ color: '#a0aec0', fontSize: '12px' }}>Total wealth</p>
                </div>

                <div className="card-gritty">
                  <h3>🏢 BUSINESSES</h3>
                  <p className="neon-text-cyan" style={{ fontSize: '32px', margin: '10px 0' }}>
                    {businesses.length}
                  </p>
                  <p style={{ color: '#a0aec0', fontSize: '12px' }}>Owned properties</p>
                </div>

                <div className="card-gritty">
                  <h3>⚡ ENERGY</h3>
                  <p className="neon-text-pink" style={{ fontSize: '32px', margin: '10px 0' }}>
                    {stats?.energy || 0}
                  </p>
                  <p style={{ color: '#a0aec0', fontSize: '12px' }}>Regenerates over time</p>
                </div>
              </div>
            </div>
          )}

          {/* HUSTLE TAB */}
          {activeTab === 'hustle' && (
            <div className={styles.tabContent}>
              <h2>TAP TO EARN</h2>
              <div className={styles.hustleSection}>
                <button className={styles.hustleBtn} onClick={handleHustle}>
                  <div className={styles.hustleEmoji}>💪</div>
                  <div className={styles.hustleText}>
                    <h3>GRIND IT</h3>
                    <p>+{Math.floor(stats?.tier * 500)} CASH</p>
                    <p>+{Math.floor(stats?.tier * 10)} XP</p>
                  </div>
                </button>
                <p style={{ color: '#a0aec0', marginTop: '20px' }}>
                  Energy: {stats?.energy} / {stats?.max_energy}
                </p>
              </div>
            </div>
          )}

          {/* BUSINESSES TAB */}
          {activeTab === 'businesses' && (
            <div className={styles.tabContent}>
              <h2>YOUR BUSINESSES</h2>
              {businesses.length === 0 ? (
                <p style={{ color: '#a0aec0' }}>No businesses yet. Come back later to unlock!</p>
              ) : (
                <div className={styles.grid}>
                  {businesses.map((b) => (
                    <div key={b.id} className="card-gritty">
                      <h3>{b.name}</h3>
                      <p style={{ color: '#ffed4e', fontSize: '18px', margin: '10px 0' }}>
                        {formatCash(b.current_income || b.base_income)}/min
                      </p>
                      <p style={{ color: '#a0aec0', fontSize: '12px' }}>
                        Manager: {b.manager_level} | Investor: {b.investor_level}
                      </p>
                      <button
                        className="btn-grind"
                        onClick={() => handleCollectBusiness(b.id)}
                        style={{ marginTop: '10px', width: '100%' }}
                      >
                        COLLECT
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SHOP TAB */}
          {activeTab === 'shop' && (
            <div className={styles.tabContent}>
              <h2>SHOP</h2>
              <p style={{ color: '#a0aec0' }}>Coming soon! Unlock after Tier 2.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}