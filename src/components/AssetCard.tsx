// 📁 src/components/AssetCard.tsx
// Display owned assets with count badges

'use client';

import styles from './AssetCard.module.css';

interface AssetData {
  id: string;
  name: string;
  tier: number;
  icon: string;
  count: number;
}

interface AssetCardProps {
  asset: AssetData;
  tier: number;
}

export function AssetCard({ asset, tier }: AssetCardProps) {
  const getTierColor = (assetTier: number) => {
    const colors: Record<number, string> = {
      1: '#b3b3b3', // Gray
      2: '#ffd700', // Gold
      3: '#ff6b6b', // Red
      4: '#00d4ff', // Cyan
      5: '#7c3aed', // Purple
    };
    return colors[assetTier] || '#ffffff';
  };

  const getTierName = (t: number) => {
    const names: Record<number, string> = {
      1: 'YN',
      2: 'TRAP',
      3: 'ENTREPRENEUR',
      4: 'BOSS',
      5: 'EL JEFE',
    };
    return names[t] || 'UNKNOWN';
  };

  return (
    <div 
      className={styles.card}
      style={{ borderColor: getTierColor(asset.tier) }}
    >
      <div className={styles.icon}>{asset.icon}</div>
      
      <div className={styles.content}>
        <h4 className={styles.name}>{asset.name}</h4>
        <p className={styles.tier}>
          T{asset.tier} - {getTierName(asset.tier)}
        </p>
      </div>

      {asset.count > 1 && (
        <div className={styles.badge}>
          {asset.count}x
        </div>
      )}
    </div>
  );
}