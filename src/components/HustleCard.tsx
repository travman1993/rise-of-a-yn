// 📁 src/components/HustleCard.tsx

'use client';

import { useState } from 'react';
import styles from './HustleCard.module.css';
import { DangerBadge } from './DangerBadge';
import { formatCash } from '@/lib/gameLogic';

interface Hustle {
  id: string;
  name: string;
  icon: string;
  tier: number;
  danger: number;
  reward: number;
  xp: number;
  energy: number;
  description: string;
}

interface HustleCardProps {
  hustle: Hustle;
  currentEnergy: number;
  maxEnergy: number;
  onExecute: (hustle: Hustle) => Promise<void>;
  loading?: boolean;
}

export function HustleCard({ hustle, currentEnergy, maxEnergy, onExecute, loading }: HustleCardProps) {
  const [executing, setExecuting] = useState(false);
  const canExecute = currentEnergy >= hustle.energy;

  const handleExecute = async () => {
    if (!canExecute || executing) return;
    
    setExecuting(true);
    try {
      await onExecute(hustle);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className={`${styles.card} ${!canExecute ? styles.disabled : ''}`}>
      <div className={styles.header}>
        <div className={styles.icon}>{hustle.icon}</div>
        <div className={styles.titleSection}>
          <h3 className={styles.name}>{hustle.name}</h3>
          <DangerBadge danger={hustle.danger} />
        </div>
      </div>

      <p className={styles.description}>{hustle.description}</p>

      <div className={styles.rewards}>
        <div className={styles.reward}>
          <span className={styles.label}>💰</span>
          <span className={styles.value}>{formatCash(hustle.reward)}</span>
        </div>
        <div className={styles.reward}>
          <span className={styles.label}>⚡</span>
          <span className={styles.value}>{hustle.xp} XP</span>
        </div>
      </div>

      <div className={styles.energySection}>
        <div className={styles.energyLabel}>
          Energy: {currentEnergy}/{maxEnergy}
        </div>
        <div className={styles.energyCost}>
          Costs: {hustle.energy}
        </div>
      </div>

      <button
        className={styles.executeBtn}
        onClick={handleExecute}
        disabled={!canExecute || executing || loading}
        title={!canExecute ? `Need ${hustle.energy - currentEnergy} more energy` : 'Execute hustle'}
      >
        {executing ? 'EXECUTING...' : 'EXECUTE'}
      </button>

      {!canExecute && (
        <div className={styles.warning}>
          ⚠️ Need {hustle.energy - currentEnergy} more energy
        </div>
      )}
    </div>
  );
}