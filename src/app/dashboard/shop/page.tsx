// 📁 src/app/dashboard/shop/page.tsx
// Asset Shop - Buy Homes, Cars, Chains, Watches, Shoes, Dogs, Guns, Studios, Boats
// Tier-gated: Must be Tier X to buy Tier X assets

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPlayerStats } from '@/lib/supabase';
import { formatCash } from '@/lib/gameLogic';
import { ALL_ASSETS, ASSET_CATEGORIES, Asset } from '@/lib/assets';
import styles from './shop.module.css';

export default function ShopPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<'home' | 'car' | 'chain' | 'watch' | 'shoes' | 'dog' | 'gun' | 'studio' | 'boat'>('home');
  const [ownedAssets, setOwnedAssets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const playerStats = await getPlayerStats(currentUser.id);
        setStats(playerStats);
        loadOwnedAssets(currentUser.id);
      }
    };
    load();
  }, []);

  const loadOwnedAssets = async (userId: string) => {
    try {
      const res = await fetch(`/api/assets?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setOwnedAssets(data.assets?.map((a: any) => a.asset_id) || []);
      }
    } catch (error) {
      console.error('Load owned assets error:', error);
    }
  };

  const handleBuyAsset = async (asset: Asset) => {
    if (!user || !stats) return;

    // ✅ TIER GATING - Must own the tier to buy tier assets
    if (stats.tier < asset.tier) {
      alert(`You must be Tier ${asset.tier} to buy this asset!`);
      return;
    }

    if (stats.cash < asset.price) {
      alert('Not enough cash!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'buy',
          userId: user.id,
          assetData: asset,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update stats with bonuses
        setStats({
          ...stats,
          cash: data.newCash,
          xp: data.newXP,
          respect: data.newRespect,
          energy: data.newEnergy,
        });
        setOwnedAssets([...ownedAssets, asset.id]);
        alert(`✅ Bought ${asset.name}!\n+${asset.xp} XP\n+${asset.respect} Respect\n+${asset.power} Power\n+${asset.energy} Energy`);
      } else {
        alert(data.error || 'Failed to buy asset');
      }
    } catch (error) {
      console.error('Buy asset error:', error);
      alert('Failed to buy asset');
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>Loading...</div>
      </div>
    );
  }

  const currentAssets = ALL_ASSETS[selectedCategory] || [];
  const isAllowedTier = (assetTier: number) => stats.tier >= assetTier;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🛍️ ASSET SHOP</h1>
          <button onClick={() => router.back()} className={styles.backBtn}>
            ← BACK
          </button>
        </div>

        <div className={styles.cashBar}>
          <span className={styles.cashLabel}>💰 Cash:</span>
          <span className={styles.cashValue}>{formatCash(stats.cash)}</span>
          <span className={styles.tierBadge}>Tier {stats.tier}</span>
        </div>

        {/* CATEGORY TABS */}
        <div className={styles.categoryTabs}>
          {ASSET_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`${styles.categoryTab} ${selectedCategory === cat.key ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat.key as any)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* ASSETS GRID */}
        <div className={styles.assetsGrid}>
          {currentAssets.map((asset) => {
            const isOwned = ownedAssets.includes(asset.id);
            const canAfford = stats.cash >= asset.price;
            const tierAllowed = isAllowedTier(asset.tier);
            const canBuy = canAfford && tierAllowed && !isOwned;

            return (
              <div
                key={asset.id}
                className={`${styles.assetCard} ${isOwned ? styles.owned : ''} ${!tierAllowed ? styles.locked : ''}`}
              >
                {/* TIER BADGE */}
                <div className={styles.tierTag}>T{asset.tier}</div>

                {/* ICON */}
                <div className={styles.assetIcon}>{asset.icon}</div>

                {/* NAME */}
                <h3 className={styles.assetName}>{asset.name}</h3>

                {/* PRICE */}
                <div className={styles.price}>{formatCash(asset.price)}</div>

                {/* STAT BONUSES */}
                <div className={styles.bonuses}>
                  <span className={styles.bonusItem}>+{asset.xp} XP</span>
                  <span className={styles.bonusItem}>+{asset.respect} 🔥</span>
                  <span className={styles.bonusItem}>+{asset.power} PWR</span>
                  <span className={styles.bonusItem}>+{asset.energy} ⚡</span>
                </div>

                {/* STATUS */}
                {isOwned && (
                  <div className={styles.ownedStatus}>✓ OWNED</div>
                )}

                {!tierAllowed && (
                  <div className={styles.lockedStatus}>🔒 T{asset.tier}</div>
                )}

                {!canAfford && tierAllowed && !isOwned && (
                  <div className={styles.poorStatus}>💸 Poor</div>
                )}

                {/* BUY BUTTON */}
                <button
                  onClick={() => handleBuyAsset(asset)}
                  disabled={!canBuy || loading}
                  className={`${styles.buyBtn} ${isOwned ? styles.disabled : ''}`}
                  title={
                    isOwned ? 'Already owned' :
                    !tierAllowed ? `Need Tier ${asset.tier}` :
                    !canAfford ? 'Not enough cash' :
                    'Buy'
                  }
                >
                  {isOwned ? '✓' : !tierAllowed ? '🔒' : !canAfford ? '💸' : '💰'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}