// 📁 src/components/DangerBadge.tsx

'use client';

import styles from './DangerBadge.module.css';

interface DangerBadgeProps {
  danger: number;
}

export function DangerBadge({ danger }: DangerBadgeProps) {
  const getDangerLabel = (d: number) => {
    switch (d) {
      case 1: return 'Low Risk';
      case 2: return 'Medium Risk';
      case 3: return 'High Risk';
      case 4: return 'Very High';
      case 5: return 'EXTREME';
      default: return 'Unknown';
    }
  };

  const getDangerColor = (d: number) => {
    switch (d) {
      case 1: return '#10b981';
      case 2: return '#f59e0b';
      case 3: return '#f97316';
      case 4: return '#ef4444';
      case 5: return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getDangerDots = (d: number) => {
    return Array(Math.min(d, 5))
      .fill(0)
      .map(() => '🔴')
      .join('');
  };

  return (
    <div 
      className={styles.badge}
      style={{ borderColor: getDangerColor(danger) }}
    >
      <span className={styles.dots}>{getDangerDots(danger)}</span>
      <span className={styles.label}>{getDangerLabel(danger)}</span>
    </div>
  );
}