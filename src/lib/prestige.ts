// 📁 src/lib/prestige.ts
// Prestige System - Complete restart with harder economics and permanent boosts

import { PRESTIGE_CONFIG } from './types';

export interface PrestigeState {
  level: number;
  icon: string;
  priceInflation: number;
  rewardReduction: number;
  powerBonus: number;
  xpBonus: number;
}

export interface PrestigeReward {
  cash: number;
  xp: number;
  respect: number;
  totalPrestiges: number;
}

/**
 * Get prestige multipliers for a given prestige level
 */
export function getPrestigeState(prestigeLevel: number): PrestigeState {
  const config = PRESTIGE_CONFIG.find((c) => prestigeLevel >= c.level) || PRESTIGE_CONFIG[0];

  return {
    level: prestigeLevel,
    icon: config.icon,
    priceInflation: config.priceInflation,
    rewardReduction: config.rewardReduction,
    powerBonus: config.powerBonus,
    xpBonus: config.xpBonus,
  };
}

/**
 * Check if player can prestige
 * Requires: Tier 5, Level 80+, $1B cash
 */
export function canPrestige(tier: number, level: number, cash: number): boolean {
  return tier === 5 && level >= 80 && cash >= 1000000000;
}

/**
 * Calculate prestige reset stats
 * Restart at Tier 1 but retain 10% respect
 */
export function calculatePrestigeReset(
  currentStats: any,
  prestigeLevel: number
): PrestigeReward {
  const newPrestigeState = getPrestigeState(prestigeLevel + 1);

  // Keep 10% respect across prestige
  const retainedRespect = Math.floor(currentStats.respect * 0.1);

  // Bonus XP from prestige
  const prestigeXPBonus = Math.floor(50000 * (prestigeLevel + 1));

  return {
    cash: 1000, // Reset to starter cash
    xp: prestigeXPBonus, // Start with prestige bonus XP
    respect: retainedRespect,
    totalPrestiges: prestigeLevel + 1,
  };
}

/**
 * Apply prestige price inflation to costs
 */
export function applyPrestigeInflation(baseCost: number, prestigeLevel: number): number {
  const state = getPrestigeState(prestigeLevel);
  return Math.floor(baseCost * state.priceInflation);
}

/**
 * Apply prestige reward reduction to earnings
 */
export function applyPrestigeReduction(baseReward: number, prestigeLevel: number): number {
  const state = getPrestigeState(prestigeLevel);
  return Math.floor(baseReward * state.rewardReduction);
}

/**
 * Calculate permanent power bonus from all prestiges
 */
export function calculatePermanentPowerBonus(prestigeLevel: number): number {
  // +2% power per prestige level
  return prestigeLevel * 0.02;
}

/**
 * Calculate permanent XP bonus from all prestiges
 */
export function calculatePermanentXPBonus(prestigeLevel: number): number {
  // +1% XP gain per prestige level
  return prestigeLevel * 0.01;
}

/**
 * Format prestige icon and name
 */
export function getPrestigeName(prestigeLevel: number): string {
  if (prestigeLevel === 0) return 'No Prestige';
  if (prestigeLevel < 5) return `${PRESTIGE_CONFIG[0].icon} Bronze`;
  if (prestigeLevel < 10) return `${PRESTIGE_CONFIG[1].icon} Silver`;
  if (prestigeLevel < 20) return `${PRESTIGE_CONFIG[2].icon} Gold`;
  return `${PRESTIGE_CONFIG[3].icon} Diamond`;
}

/**
 * Calculate total progress to next prestige tier
 */
export function calculatePrestigeProgress(prestigeLevel: number): { current: number; next: number; progress: number } {
  const tiers = [1, 5, 10, 20, Infinity];
  const currentTier = tiers.find((t) => prestigeLevel < t) || 20;
  const prevTier = tiers[tiers.indexOf(currentTier) - 1] || 0;

  const progress = ((prestigeLevel - prevTier) / (currentTier - prevTier)) * 100;

  return {
    current: prestigeLevel,
    next: currentTier,
    progress: Math.min(100, progress),
  };
}

/**
 * Display prestige info
 */
export function describePrestige(prestigeLevel: number): string {
  const state = getPrestigeState(prestigeLevel);
  const name = getPrestigeName(prestigeLevel);

  return `
${name}
Price: +${((state.priceInflation - 1) * 100).toFixed(0)}% | Rewards: −${((1 - state.rewardReduction) * 100).toFixed(0)}%
Power: +${(state.powerBonus * 100).toFixed(1)}% | XP: +${(state.xpBonus * 100).toFixed(1)}%
  `.trim();
}