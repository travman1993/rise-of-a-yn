// 📁 src/app/dashboard/businesses/page.tsx
// Businesses Management - Buy, Hire, Collect (FIXED - No TIER_COSTS)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPlayerStats } from '@/lib/supabase';
import { formatCash, calculateManagerCost, calculateInvestorCost } from '@/lib/gameLogic';
import { BUSINESSES } from '@/lib/tierData';
import styles from './businesses.module.css';

interface Business {
  id: string;
  name: string;
  tier: number;
  base_income: number;
  current_income: number;
  level: number;
  manager_level: number;
  investor_level: number;
  manager_name: string;
  investor_name: string;
  last_collected: string;
  image_url: string;
}

export default function BusinessesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBuyMenu, setShowBuyMenu] = useState(false);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const playerStats = await getPlayerStats(currentUser.id);
        setStats(playerStats);
        loadBusinesses(currentUser.id);
      }
    };
    load();
  }, []);

  const loadBusinesses = async (userId: string) => {
    try {
      const res = await fetch(`/api/businesses?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.businesses || []);
      }
    } catch (error) {
      console.error('Load businesses error:', error);
    }
  };

  const handleCollect = async (businessId: string) => {
    if (!user || !stats) return;

    setLoading(true);
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'collect',
          businessId,
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStats({ ...stats, cash: data.newCash });
        setBusinesses(
          businesses.map((b) =>
            b.id === businessId ? { ...b, last_collected: new Date().toISOString() } : b
          )
        );
        alert(`+${formatCash(data.income)}`);
      } else {
        alert(data.error || 'Failed to collect');
      }
    } catch (error) {
      console.error('Collect error:', error);
      alert('Collect error');
    } finally {
      setLoading(false);
    }
  };

  const handleHireManager = async (businessId: string) => {
    if (!user || !stats) return;

    const business = businesses.find((b) => b.id === businessId);
    if (!business) return;

    const cost = calculateManagerCost(business.tier, business.manager_level);

    if (stats.cash < cost) {
      alert('Not enough cash!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'buy_speed_manager',
          userId: user.id,
          businessId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStats({ ...stats, cash: data.newCash });
        loadBusinesses(user.id);
        alert('Speed Manager hired!');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Hire manager error:', error);
      alert('Failed to hire manager');
    } finally {
      setLoading(false);
    }
  };

  const handleHireInvestor = async (businessId: string) => {
    if (!user || !stats) return;

    const business = businesses.find((b) => b.id === businessId);
    if (!business) return;

    const cost = calculateInvestorCost(business.tier, business.investor_level);

    if (stats.cash < cost) {
      alert('Not enough cash!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'buy_income_manager',
          userId: user.id,
          businessId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStats({ ...stats, cash: data.newCash });
        loadBusinesses(user.id);
        alert('Income Manager hired!');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Hire investor error:', error);
      alert('Failed to hire income manager');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyBusiness = async (businessTemplate: any) => {
    if (!user || !stats) return;

    const cost = businessTemplate.baseCost;

    if (stats.cash < cost) {
      alert('Not enough cash!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'buy',
          userId: user.id,
          tier: businessTemplate.tier,
          businessData: businessTemplate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStats({ ...stats, cash: data.newCash });
        loadBusinesses(user.id);
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Buy error:', error);
      alert('Failed to buy business');
    } finally {
      setLoading(false);
    }
  };

  if (!stats)
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>Loading...</div>
      </div>
    );

  const currentTier = stats.tier || 1;
  const availableTiers = Array.from({ length: currentTier }, (_, i) => i + 1);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>💼 BUSINESSES</h1>
          <button onClick={() => router.back()} className={styles.backBtn}>
            ← BACK
          </button>
        </div>

        <div className={styles.cashBar}>
          <span className={styles.cashLabel}>💰 Cash:</span>
          <span className={styles.cashValue}>{formatCash(stats.cash)}</span>
        </div>

        {/* OWNED BUSINESSES */}
        {businesses.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Businesses ({businesses.length})</h2>
            <div className={styles.grid}>
              {businesses.map((biz) => (
                <div key={biz.id} className={styles.bizCard}>
                  <div className={styles.bizHeader}>
                    <h3 className={styles.bizName}>{biz.name}</h3>
                    <span className={styles.bizTier}>T{biz.tier}</span>
                  </div>

                  <div className={styles.bizStats}>
                    <div className={styles.stat}>
                      <span className={styles.label}>Income</span>
                      <span className={styles.value}>{formatCash(biz.current_income)}/min</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.label}>Speed Mgr</span>
                      <span className={styles.value}>L{biz.manager_level}</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.label}>Income Mgr</span>
                      <span className={styles.value}>L{biz.investor_level}</span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button onClick={() => handleCollect(biz.id)} disabled={loading} className={styles.collectBtn}>
                      💰 COLLECT
                    </button>
                    <button
                      onClick={() => handleHireManager(biz.id)}
                      disabled={loading || stats.cash < calculateManagerCost(biz.tier, biz.manager_level)}
                      className={styles.upgradeBtn}
                      title={`Cost: ${formatCash(calculateManagerCost(biz.tier, biz.manager_level))}`}
                    >
                      ⚡
                    </button>
                    <button
                      onClick={() => handleHireInvestor(biz.id)}
                      disabled={loading || stats.cash < calculateInvestorCost(biz.tier, biz.investor_level)}
                      className={styles.upgradeBtn}
                      title={`Cost: ${formatCash(calculateInvestorCost(biz.tier, biz.investor_level))}`}
                    >
                      💵
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUY MENU */}
        <div className={styles.section}>
          <div className={styles.buyHeader}>
            <h2 className={styles.sectionTitle}>Buy Business</h2>
            <button onClick={() => setShowBuyMenu(!showBuyMenu)} className={styles.toggleBtn}>
              {showBuyMenu ? '▼' : '▶'} Available Tiers
            </button>
          </div>

          {showBuyMenu && (
            <div className={styles.buyGrid}>
              {availableTiers.map((tier) => (
                <div key={tier} className={styles.tierSection}>
                  <h3 className={styles.tierTitle}>Tier {tier}</h3>
                  <div className={styles.tierBusinesses}>
                    {(BUSINESSES[tier as keyof typeof BUSINESSES] || []).map((template: any) => (
                      <button
                        key={template.id}
                        onClick={() => handleBuyBusiness(template)}
                        disabled={loading || stats.cash < template.baseCost}
                        className={styles.buyBusinessBtn}
                        title={`Cost: ${formatCash(template.baseCost)}`}
                      >
                        {template.icon} {template.name}
                        <br />
                        <small style={{ fontSize: '10px', opacity: 0.8 }}>
                          ${formatCash(template.baseCost)}
                        </small>
                      </button>
                    ))}
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