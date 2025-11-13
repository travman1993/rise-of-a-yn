// 📁 src/lib/gameLogic.ts
// All game calculations and formulas for RISE OF A YN

import {
    TIER_MULTIPLIERS,
    INFLATION,
    INCOME_CAPS,
    BASE_COSTS,
    MANAGER_NAMES,
    INVESTOR_NAMES,
    PRESTIGE_CONFIG,
  } from './types';
  
  // LEVELING FORMULA
  export function calculateLevel(xp: number, ownedAssets: number): number {
    return Math.floor(Math.sqrt(xp / 100) + ownedAssets * 0.05);
  }
  
  // XP NEEDED FOR NEXT LEVEL
  export function xpForNextLevel(currentLevel: number, tier: number): number {
    return Math.floor(250 * Math.pow(currentLevel + 1, 2) * (1 + tier * 0.25));
  }
  
  // POWER CALCULATION
  export function calculatePower(
    cash: number,
    respect: number,
    cosmetics: number = 0,
    prestiges: number = 0
  ): number {
    // Much stricter formula for boss fights
    const basePower = cash * 0.1 + respect * 50; // Cash is now 10x harder (was 0.8)
    const cosmeticBonus = cosmetics * 2; // Reduced from 5
    const prestigeBonus = prestiges * (prestiges * 0.01); // Reduced from 0.02
    
    return Math.floor(basePower + cosmeticBonus + prestigeBonus);
  }
  
  // COST CALCULATION WITH INFLATION
  export function calculateCost(
    baseCost: number,
    tier: number,
    hasManager: boolean = false,
    hasInvestor: boolean = false,
    level: number = 1
  ): number {
    const tierMultiplier = TIER_MULTIPLIERS[tier as keyof typeof TIER_MULTIPLIERS] || 1;
    let inflationRate = INFLATION.MANUAL;
  
    if (hasManager && hasInvestor) {
      inflationRate = INFLATION.BOTH;
    } else if (hasInvestor) {
      inflationRate = INFLATION.WITH_INVESTOR;
    } else if (hasManager) {
      inflationRate = INFLATION.WITH_MANAGER;
    }
  
    const levelMultiplier = Math.pow(inflationRate, level - 1);
    return Math.floor(baseCost * tierMultiplier * levelMultiplier);
  }
  
  // INCOME CALCULATION
  export function calculateIncome(
    baseIncome: number,
    managerLevel: number = 0,
    investorLevel: number = 0,
    tier: number = 1,
    prestigeLevel: number = 0
  ): number {
    let income = baseIncome;
  
    // Manager speed bonus (reduces time between ticks)
    if (managerLevel > 0) {
      const managerBonus = 1 - 0.05 * managerLevel;
      income = income * (1 / managerBonus);
    }
  
    // Investor payout multiplier
    if (investorLevel > 0) {
      const investorBonus = 1 + 0.1 * investorLevel;
      income = income * investorBonus;
    }
  
    // Prestige multiplier
    if (prestigeLevel > 0) {
      const prestigeBonus = 1 + prestigeLevel * 0.05;
      income = income * prestigeBonus;
    }
  
    // Apply income cap per tier
    const cap = INCOME_CAPS[tier as keyof typeof INCOME_CAPS] || INCOME_CAPS[1];
    if (income > cap) {
      income = income * 0.98; // dampener
    }
  
    return Math.floor(income);
  }
  
  // MANAGER COST
  export function calculateManagerCost(tier: number, currentLevel: number = 0): number {
    const baseCost = BASE_COSTS[tier as keyof typeof BASE_COSTS] || BASE_COSTS[1];
    return Math.floor(baseCost * Math.pow(2, currentLevel));
  }
  
  // INVESTOR COST
  export function calculateInvestorCost(tier: number, currentLevel: number = 0): number {
    const baseCost = BASE_COSTS[tier as keyof typeof BASE_COSTS] || BASE_COSTS[1];
    return Math.floor(baseCost * 1.5 * Math.pow(2, currentLevel));
  }
  
  // MANAGER SPEED BONUS
  export function getManagerSpeedBonus(managerLevel: number): number {
    return 1 - 0.05 * Math.min(managerLevel, 10);
  }
  
  // INVESTOR YIELD BONUS
  export function getInvestorYieldBonus(investorLevel: number): number {
    return 1 + 0.1 * Math.min(investorLevel, 10);
  }
  
  // EXECUTIVE SUITE BONUS
  export function getExecutiveSuiteBonus(totalManagers: number, totalInvestors: number): number {
    const speedBonus = 0.02 * Math.min(totalManagers, 10);
    const yieldBonus = 0.02 * Math.min(totalInvestors, 10);
    return speedBonus + yieldBonus;
  }
  
  // CREW SYNERGY BONUS
  export function getCrewSynergyBonus(crewSize: number): number {
    return Math.min(0.005 * crewSize, 0.1); // max 10%
  }
  
  // BOSS FIGHT POWER
  export function calculateBossPower(playerPower: number): number {
    const luck = Math.random() * 0.2 - 0.1; // ±10%
    return Math.floor(playerPower * (1 + luck));
  }
  
  // ENERGY REGEN
  export function calculateEnergyRegen(lastRegen: string, maxEnergy: number): number {
    const now = new Date().getTime();
    const lastRegenTime = new Date(lastRegen).getTime();
    const timePassed = Math.floor((now - lastRegenTime) / 1000 / 60); // minutes
    const energyPerMinute = 1;
    return Math.min(timePassed * energyPerMinute, maxEnergy);
  }
  
  // PRESTIGE REQUIREMENTS
  export function canPrestige(level: number, tier: number, cash: number): boolean {
    return tier === 5 && level >= 80 && cash >= 1000000000; // 1 billion
  }
  
  // PRESTIGE MULTIPLIER
  export function getPrestigeMultiplier(prestigeLevel: number): {
    priceInflation: number;
    rewardReduction: number;
    powerBonus: number;
    xpBonus: number;
  } {
    const config = PRESTIGE_CONFIG.find(
      (c) => prestigeLevel >= c.level
    ) || PRESTIGE_CONFIG[0];
  
    return {
      priceInflation: config.priceInflation,
      rewardReduction: config.rewardReduction,
      powerBonus: config.powerBonus,
      xpBonus: config.xpBonus,
    };
  }
  
  // CALCULATE NEW STATS AFTER PRESTIGE
  export function calculatePrestigeReset(
    currentStats: any,
    prestigeLevel: number
  ): {
    cash: number;
    xp: number;
    respect: number;
    level: number;
    tier: number;
  } {
    const multiplier = getPrestigeMultiplier(prestigeLevel + 1);
  
    return {
      cash: 1000,
      xp: 0,
      respect: Math.floor(currentStats.respect * 0.1), // keep 10% respect
      level: 1,
      tier: 1,
    };
  }
  
  // XP GAINED FROM HUSTLE
  export function calculateHustleXP(baseXP: number, tier: number, prestigeLevel: number): number {
    const multiplier = getPrestigeMultiplier(prestigeLevel);
    return Math.floor(baseXP * (1 + multiplier.xpBonus));
  }
  
  // CASH GAINED FROM HUSTLE
  export function calculateHustleCash(
    baseCash: number,
    tier: number,
    prestigeLevel: number
  ): number {
    const multiplier = getPrestigeMultiplier(prestigeLevel);
    return Math.floor(baseCash * multiplier.rewardReduction);
  }
  
  // BIG BANK TAKE LITTLE BANK CALCULATION
  export function calculateBigBankPower(
    cash: number,
    respect: number,
    skill: number = 0
  ): number {
    return Math.floor(cash * 0.8 + respect * 100 + skill * 250);
  }
  
  // STREET DICE WINNER
  export function diceLotteryWinner(
    player1Bet: number,
    player2Bet: number
  ): 'player1' | 'player2' | 'tie' {
    const roll1 = Math.random();
    const roll2 = Math.random();
  
    if (roll1 > roll2) return 'player1';
    if (roll2 > roll1) return 'player2';
    return 'tie';
  }
  
  // SHOOTOUT LOGIC
  export function evaluateShootoutRound(
    playerMove: 'pull' | 'duck' | 'reload',
    bossMove: 'pull' | 'duck' | 'reload'
  ): 'win' | 'lose' | 'tie' {
    if (playerMove === bossMove) return 'tie';
  
    if (playerMove === 'pull' && bossMove === 'reload') return 'win';
    if (playerMove === 'pull' && bossMove === 'duck') return 'lose';
  
    if (playerMove === 'reload' && bossMove === 'duck') return 'win';
    if (playerMove === 'reload' && bossMove === 'pull') return 'lose';
  
    if (playerMove === 'duck' && bossMove === 'pull') return 'win';
    if (playerMove === 'duck' && bossMove === 'reload') return 'lose';
  
    return 'tie';
  }
  
  // FORMAT CURRENCY
  export function formatCash(amount: number): string {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount}`;
  }
  
  // GET MANAGER NAME BY TIER
  export function getManagerName(tier: number): string {
    return MANAGER_NAMES[tier as keyof typeof MANAGER_NAMES] || 'Manager';
  }
  
  // GET INVESTOR NAME BY TIER
  export function getInvestorName(tier: number): string {
    return INVESTOR_NAMES[tier as keyof typeof INVESTOR_NAMES] || 'Investor';
  }