// 📁 src/lib/types.ts
// All TypeScript types for RISE OF A YN

export interface User {
    id: string;
    email: string;
    username: string;
    created_at: string;
    prestige_level: number;
    total_prestiges: number;
  }
  
  export interface PlayerStats {
    id: string;
    user_id: string;
    cash: number;
    xp: number;
    respect: number;
    level: number;
    tier: number; // 1-5
    energy: number;
    max_energy: number;
    last_energy_regen: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Business {
    id: string;
    user_id: string;
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
    created_at: string;
    updated_at: string;
  }
  
  export interface Hustle {
    id: string;
    user_id: string;
    name: string;
    tier: number;
    base_reward: number;
    xp_reward: number;
    energy_cost: number;
    cooldown_seconds: number;
    last_used: string;
    image_url: string;
    created_at: string;
  }
  
  export interface Asset {
    id: string;
    user_id: string;
    asset_type: 'home' | 'car';
    tier: number;
    name: string;
    purchase_price: number;
    image_url: string;
    owned: boolean;
    purchased_at: string;
    created_at: string;
  }
  
  export interface Cosmetic {
    id: string;
    user_id: string;
    name: string;
    category: 'chain' | 'watch' | 'sneaker' | 'pet' | 'decor';
    power_bonus: number;
    respect_bonus: number;
    price: number;
    image_url: string;
    owned: boolean;
    purchased_at: string;
  }
  
  export interface BossEncounter {
    tier: number;
    name: string;
    power_required: number;
    cash_reward: number;
    xp_reward: number;
    respect_reward: number;
    image_url: string;
  }
  
  export interface LeaderboardEntry {
    rank: number;
    username: string;
    value: number;
    prestige_level: number;
  }
  
  export interface GameData {
    player: PlayerStats;
    user: User;
    businesses: Business[];
    hustles: Hustle[];
    assets: Asset[];
    cosmetics: Cosmetic[];
  }
  
  // TIER CONFIG
  export const TIER_CONFIG = {
    1: {
      name: 'YN (Youngin\')',
      minLevel: 1,
      maxLevel: 9,
      minXP: 0,
      maxXP: 2000,
      boss: {
        name: 'Neighborhood OG',
        powerRequired: 250,
      },
    },
    2: {
      name: 'Trap (Block Boss)',
      minLevel: 10,
      maxLevel: 24,
      minXP: 2000,
      maxXP: 10000,
      boss: {
        name: 'Block Captain',
        powerRequired: 800,
      },
    },
    3: {
      name: 'Entrepreneur',
      minLevel: 25,
      maxLevel: 49,
      minXP: 10000,
      maxXP: 50000,
      boss: {
        name: 'City Controller',
        powerRequired: 3000,
      },
    },
    4: {
      name: 'Boss',
      minLevel: 50,
      maxLevel: 79,
      minXP: 50000,
      maxXP: 200000,
      boss: {
        name: 'State Kingpin',
        powerRequired: 10000,
      },
    },
    5: {
      name: 'El Jefe',
      minLevel: 80,
      maxLevel: 999,
      minXP: 200000,
      maxXP: Infinity,
      boss: {
        name: 'Global Don',
        powerRequired: 50000,
      },
    },
  };
  
  // INFLATION RATES
  export const INFLATION = {
    MANUAL: 1.12,
    WITH_MANAGER: 1.28,
    WITH_INVESTOR: 1.4,
    BOTH: 1.55,
  };
  
  // TIER MULTIPLIERS
  export const TIER_MULTIPLIERS = {
    1: 1,
    2: 5,
    3: 20,
    4: 80,
    5: 320,
  };
  
  // INCOME CAPS (per minute)
  export const INCOME_CAPS = {
    1: 50000,
    2: 250000,
    3: 1000000,
    4: 10000000,
    5: 100000000,
  };
  
  // MANAGER & INVESTOR NAMES BY TIER
  export const MANAGER_NAMES = {
    1: 'Corner Captain',
    2: 'Trap Supervisor',
    3: 'Operations Manager',
    4: 'Regional Director',
    5: 'Underboss',
  };
  
  export const INVESTOR_NAMES = {
    1: 'Neighborhood Investor',
    2: 'Street Financier',
    3: 'Silent Partner',
    4: 'Private Backer',
    5: 'Global Investor',
  };
  
  // BASE COSTS
  export const BASE_COSTS = {
    1: 10000,
    2: 250000,
    3: 1000000,
    4: 5000000,
    5: 25000000,
  };
  
  // PRESTIGE CONFIG
  export const PRESTIGE_CONFIG = [
    { level: 1, icon: '🥉', priceInflation: 1.1, rewardReduction: 0.95, powerBonus: 0.02, xpBonus: 0.01 },
    { level: 5, icon: '🥈', priceInflation: 1.25, rewardReduction: 0.9, powerBonus: 0.02, xpBonus: 0.01 },
    { level: 10, icon: '🥇', priceInflation: 1.5, rewardReduction: 0.85, powerBonus: 0.02, xpBonus: 0.01 },
    { level: 20, icon: '💎', priceInflation: 2.0, rewardReduction: 0.75, powerBonus: 0.02, xpBonus: 0.01 },
  ];