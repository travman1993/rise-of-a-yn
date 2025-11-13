// 📁 src/app/dashboard/shop/page.tsx
// Flex Shop - Cosmetics & Accessories

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPlayerStats } from '@/lib/supabase';
import { formatCash } from '@/lib/gameLogic';
import styles from './shop.module.css';

interface Cosmetic {
  id: string;
  item_id: string;
  name: string;
  category: 'chain' | 'watch' | 'sneaker' | 'pet' | 'decor';
  power_bonus: number;
  respect_bonus: number;
  price: number;
  image_url: string;
}

const SHOP_ITEMS: Cosmetic[] = [
  // CHAINS
  {
    id: '1',
    item_id: 'chain-gold',
    name: 'Gold Chain',
    category: 'chain',
    power_bonus: 50,
    respect_bonus: 10,
    price: 25000,
    image_url: '⛓️',
  },
  {
    id: '2',
    item_id: 'chain-diamond',
    name: 'Diamond Chain',
    category: 'chain',
    power_bonus: 150,
    respect_bonus: 30,
    price: 250000,
    image_url: '💎',
  },
  {
    id: '3',
    item_id: 'chain-platinum',
    name: 'Platinum Chain',
    category: 'chain',
    power_bonus: 300,
    respect_bonus: 50,
    price: 1000000,
    image_url: '✨',
  },

  // WATCHES
  {
    id: '4',
    item_id: 'watch-rolex',
    name: 'Rolex',
    category: 'watch',
    power_bonus: 100,
    respect_bonus: 25,
    price: 100000,
    image_url: '⌚',
  },
  {
    id: '5',
    item_id: 'watch-ap',
    name: 'Audemars Piguet',
    category: 'watch',
    power_bonus: 250,
    respect_bonus: 60,
    price: 500000,
    image_url: '⏰',
  },

  // SNEAKERS
  {
    id: '6',
    item_id: 'sneaker-jordan',
    name: 'Jordan 1s',
    category: 'sneaker',
    power_bonus: 30,
    respect_bonus: 15,
    price: 10000,
    image_url: '👟',
  },
  {
    id: '7',
    item_id: 'sneaker-yeezy',
    name: 'Yeezy 350',
    category: 'sneaker',
    power_bonus: 80,
    respect_bonus: 35,
    price: 75000,
    image_url: '👞',
  },

  // PETS
  {
    id: '8',
    item_id: 'pet-dog',
    name: 'Guard Dog',
    category: 'pet',
    power_bonus: 200,
    respect_bonus: 40,
    price: 200000,
    image_url: '🐕',
  },
  {
    id: '9',
    item_id: 'pet-tiger',
    name: 'Tiger',
    category: 'pet',
    power_bonus: 500,
    respect_bonus: 100,
    price: 2000000,
    image_url: '🐯',
  },

  // DECOR
  {
    id: '10',
    item_id: 'decor-neon',
    name: 'Neon Sign',
    category: 'decor',
    power_bonus: 0,
    respect_bonus: 50,
    price: 50000,
    image_url: '🔥',
  },
  {
    id: '11',
    item_id: 'decor-vault',
    name: 'Vault Door',
    category: 'decor',
    power_bonus: 100,
    respect_bonus: 75,
    price: 500000,
    image_url: '🚪',
  },
];

export default function ShopPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [owned, setOwned] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'chain' | 'watch' | 'sneaker' | 'pet' | 'decor'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const playerStats = await getPlayerStats(currentUser.id);
        setStats(playerStats);
        loadOwned(currentUser.id);
      }
    };
    load();
  }, []);

  const loadOwned = async (userId: string) => {
    try {
      const res = await fetch(`/api/shop?userId=${userId}`);
      const data = await res.json();
      const ownedIds = data.cosmetics?.map((c: any) => c.item_id) || [];
      setOwned(ownedIds);
    } catch (error) {
      console.error('Load owned error:', error);
    }
  };

  const handleBuy = async (cosmetic: Cosmetic) => {
    if (!user || !stats) return;

    if (stats.cash < cosmetic.price) {
      alert('Not enough cash!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          cosmeticId: cosmetic.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setStats({ ...stats, cash: data.newCash });
        setOwned([...owned, cosmetic.item_id]);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Buy error:', error);
      alert('Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  if (!stats) return <div>Loading...</div>;

  const filtered = filter === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter((c) => c.category === filter);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🛍️ FLEX SHOP</h1>
          <button onClick={() => router.back()} className={styles.backBtn}>
            ← BACK
          </button>
        </div>

        <div className={styles.cashBar}>
          <span className={styles.cashLabel}>💰 Available:</span>
          <span className={styles.cashValue}>{formatCash(stats.cash)}</span>
        </div>

        {/* FILTERS */}
        <div className={styles.filters}>
          {(['all', 'chain', 'watch', 'sneaker', 'pet', 'decor'] as const).map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' && '🛍️ All'}
              {cat === 'chain' && '⛓️ Chains'}
              {cat === 'watch' && '⌚ Watches'}
              {cat === 'sneaker' && '👟 Sneakers'}
              {cat === 'pet' && '🐕 Pets'}
              {cat === 'decor' && '🔥 Decor'}
            </button>
          ))}
        </div>

        {/* SHOP GRID */}
        <div className={styles.shopGrid}>
          {filtered.map((item) => {
            const isOwned = owned.includes(item.item_id);
            return (
              <div key={item.id} className={`${styles.shopCard} ${isOwned ? styles.owned : ''}`}>
                <div className={styles.itemIcon}>{item.image_url}</div>

                <h3 className={styles.itemName}>{item.name}</h3>

                <div className={styles.bonuses}>
                  {item.power_bonus > 0 && (
                    <div className={styles.bonus}>
                      <span className={styles.bonusLabel}>⚡ Power</span>
                      <span className={styles.bonusValue}>+{item.power_bonus}</span>
                    </div>
                  )}
                  {item.respect_bonus > 0 && (
                    <div className={styles.bonus}>
                      <span className={styles.bonusLabel}>🔥 Respect</span>
                      <span className={styles.bonusValue}>+{item.respect_bonus}</span>
                    </div>
                  )}
                </div>

                <div className={styles.price}>{formatCash(item.price)}</div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={isOwned || stats.cash < item.price || loading}
                  className={styles.buyBtn}
                >
                  {isOwned ? '✓ OWNED' : stats.cash < item.price ? 'POOR' : 'BUY'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}