// 📁 src/components/BusinessCard.tsx
// Individual business card with timer, upgrades, and managers

'use client';

import { useState, useEffect } from 'react';
import styles from './BusinessCard.module.css';
import { formatCash } from '@/lib/gameLogic';

interface Business {
  id: string;
  name: string;
  icon: string;
  tier: number;
  base_income: number;
  current_income: number;
  base_speed: number;
  upgrade_level: number;
  speed_manager_level: number;
  income_manager_level: number;
  last_collected: string;
}

interface BusinessCardProps {
  business: Business;
  onCollect: (businessId: string) => Promise<void>;
  onUpgrade: (businessId: string) => Promise<void>;
  onBuySpeedManager: (businessId: string) => Promise<void>;
  onBuyIncomeManager: (businessId: string) => Promise<void>;
  playerCash: number;
  loading?: boolean;
}

// Helper functions
function calculateBusinessIncome(
  baseIncome: number,
  upgradeLevel: number,
  incomeManagerLevel: number
): number {
  let income = baseIncome * Math.pow(2, upgradeLevel);
  let managerBonus = 1 + (incomeManagerLevel * 0.2);
  return Math.floor(income * managerBonus);
}

function calculateBusinessSpeed(
  baseSpeed: number,
  upgradeLevel: number,
  speedManagerLevel: number
): number {
  let speed = baseSpeed / Math.pow(2, upgradeLevel);
  if (speedManagerLevel > 0) {
    speed = speed / speedManagerLevel;
  }
  return Math.max(5, speed);
}

function calculateUpgradeCost(baseCost: number, currentUpgradeLevel: number): number {
  return Math.floor(baseCost * 1.5 * Math.pow(1.5, currentUpgradeLevel));
}

function calculateManagerCost(baseCost: number, currentLevel: number, tier: number): number {
  let tierBaseCost = baseCost * Math.pow(10, tier - 1);
  return Math.floor(tierBaseCost * Math.pow(2, currentLevel));
}

function isCollectionReady(lastCollected: string, currentSpeed: number): boolean {
  const now = new Date();
  const lastDate = new Date(lastCollected);
  const secondsPassed = (now.getTime() - lastDate.getTime()) / 1000;
  return secondsPassed >= currentSpeed;
}

function getTimeRemaining(lastCollected: string, currentSpeed: number): string {
  const now = new Date();
  const lastDate = new Date(lastCollected);
  const secondsPassed = (now.getTime() - lastDate.getTime()) / 1000;
  const secondsRemaining = Math.max(0, currentSpeed - secondsPassed);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = Math.floor(secondsRemaining % 60);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

function getProgressPercentage(lastCollected: string, currentSpeed: number): number {
  const now = new Date();
  const lastDate = new Date(lastCollected);
  const secondsPassed = (now.getTime() - lastDate.getTime()) / 1000;
  return Math.min(100, (secondsPassed / currentSpeed) * 100);
}

export function BusinessCard({
  business,
  onCollect,
  onUpgrade,
  onBuySpeedManager,
  onBuyIncomeManager,
  playerCash,
  loading,
}: BusinessCardProps) {
  const [timeRemaining, setTimeRemaining] = useState('0s');
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [buyingSpeedMgr, setBuyingSpeedMgr] = useState(false);
  const [buyingIncomeMgr, setBuyingIncomeMgr] = useState(false);

  // Calculate current stats
  const currentIncome = calculateBusinessIncome(
    business.base_income,
    business.upgrade_level,
    business.income_manager_level
  );

  const currentSpeed = calculateBusinessSpeed(
    business.base_speed,
    business.upgrade_level,
    business.speed_manager_level
  );

  const upgradeCost = calculateUpgradeCost(business.base_income, business.upgrade_level);
  const speedMgrCost = calculateManagerCost(5000, business.speed_manager_level, business.tier);
  const incomeMgrCost = calculateManagerCost(5000, business.income_manager_level, business.tier);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const ready = isCollectionReady(business.last_collected, currentSpeed);
      const remaining = getTimeRemaining(business.last_collected, currentSpeed);
      const progressPercent = getProgressPercentage(business.last_collected, currentSpeed);

      setIsReady(ready);
      setTimeRemaining(remaining);
      setProgress(progressPercent);
    }, 1000);

    return () => clearInterval(interval);
  }, [business.last_collected, currentSpeed]);

  const handleCollect = async () => {
    setCollecting(true);
    try {
      await onCollect(business.id);
    } finally {
      setCollecting(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await onUpgrade(business.id);
    } finally {
      setUpgrading(false);
    }
  };

  const handleBuySpeedMgr = async () => {
    setBuyingSpeedMgr(true);
    try {
      await onBuySpeedManager(business.id);
    } finally {
      setBuyingSpeedMgr(false);
    }
  };

  const handleBuyIncomeMgr = async () => {
    setBuyingIncomeMgr(true);
    try {
      await onBuyIncomeManager(business.id);
    } finally {
      setBuyingIncomeMgr(false);
    }
  };

  const canAffordUpgrade = playerCash >= upgradeCost;
  const canAffordSpeedMgr = playerCash >= speedMgrCost;
  const canAffordIncomeMgr = playerCash >= incomeMgrCost;

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.icon}>{business.icon}</span>
        <div className={styles.titleSection}>
          <h3 className={styles.name}>{business.name}</h3>
          <p className={styles.income}>${formatCash(currentIncome)}</p>
        </div>
      </div>

      {/* Speed Display */}
      <div className={styles.speedDisplay}>
        <span className={styles.speedLabel}>every {Math.floor(currentSpeed / 60)}m {Math.floor(currentSpeed % 60)}s</span>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${isReady ? styles.ready : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={`${styles.timeRemaining} ${isReady ? styles.readyText : ''}`}>
          {isReady ? '✅ READY' : timeRemaining}
        </span>
      </div>

      {/* Stats Display */}
      <div className={styles.statsRow}>
        <span className={styles.stat}>
          Upgrades: <strong>{business.upgrade_level}</strong>
        </span>
        <span className={styles.stat}>
          Speed Mgr: <strong>{business.speed_manager_level}</strong>
        </span>
        <span className={styles.stat}>
          Income Mgr: <strong>{business.income_manager_level}</strong>
        </span>
      </div>

      {/* Buttons Row 1 */}
      <div className={styles.buttonsRow}>
        <button
          className={`${styles.btn} ${styles.collectBtn} ${!isReady ? styles.disabled : ''}`}
          onClick={handleCollect}
          disabled={!isReady || collecting || loading}
          title={isReady ? 'Collect income' : 'Not ready yet'}
        >
          {collecting ? 'COLLECTING...' : '💰 COLLECT'}
        </button>

        <button
          className={`${styles.btn} ${styles.upgradeBtn} ${!canAffordUpgrade ? styles.disabled : ''}`}
          onClick={handleUpgrade}
          disabled={!canAffordUpgrade || upgrading || loading}
          title={canAffordUpgrade ? `Upgrade for ${formatCash(upgradeCost)}` : 'Not enough cash'}
        >
          {upgrading ? 'UPGRADING...' : `📈 ${formatCash(upgradeCost)}`}
        </button>
      </div>

      {/* Buttons Row 2 */}
      <div className={styles.buttonsRow}>
        <button
          className={`${styles.btn} ${styles.managerBtn} ${!canAffordSpeedMgr ? styles.disabled : ''}`}
          onClick={handleBuySpeedMgr}
          disabled={!canAffordSpeedMgr || buyingSpeedMgr || loading}
          title={canAffordSpeedMgr ? `Speed Mgr for ${formatCash(speedMgrCost)}` : 'Not enough cash'}
        >
          {buyingSpeedMgr ? 'BUYING...' : `⚡ ${formatCash(speedMgrCost)}`}
        </button>

        <button
          className={`${styles.btn} ${styles.managerBtn} ${!canAffordIncomeMgr ? styles.disabled : ''}`}
          onClick={handleBuyIncomeMgr}
          disabled={!canAffordIncomeMgr || buyingIncomeMgr || loading}
          title={canAffordIncomeMgr ? `Income Mgr for ${formatCash(incomeMgrCost)}` : 'Not enough cash'}
        >
          {buyingIncomeMgr ? 'BUYING...' : `💵 ${formatCash(incomeMgrCost)}`}
        </button>
      </div>
    </div>
  );
}