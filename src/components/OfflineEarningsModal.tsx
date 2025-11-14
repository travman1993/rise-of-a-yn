// 📁 src/components/OfflineEarningsModal.tsx
// Modal component for displaying offline earnings

'use client';

import styles from './OfflineEarningsModal.module.css';
import { formatCash } from '@/lib/gameLogic';

interface OfflineEarningsModalProps {
  show: boolean;
  offlineIncome: number;
  offlineMinutes: number;
  capped: boolean;
  loading: boolean;
  onClaim: () => void;
  onClose: () => void;
}

export function OfflineEarningsModal({
  show,
  offlineIncome,
  offlineMinutes,
  capped,
  loading,
  onClaim,
  onClose,
}: OfflineEarningsModalProps) {
  if (!show) return null;

  const hours = Math.floor(offlineMinutes / 60);
  const minutes = offlineMinutes % 60;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>💰 OFFLINE EARNINGS!</h2>

        <div className={styles.content}>
          <p className={styles.message}>You earned money while away!</p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.label}>Time Away</span>
              <span className={styles.value}>
                {hours}h {minutes}m
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Earned</span>
              <span className={styles.value}>{formatCash(offlineIncome)}</span>
            </div>
          </div>

          {capped && (
            <p className={styles.cappedWarning}>
              ⚠️ Capped at 8 hours maximum
            </p>
          )}

          <p className={styles.info}>
            💡 Tip: Businesses generate income passively while you're offline!
          </p>
        </div>

        <div className={styles.actions}>
          <button
            onClick={onClaim}
            disabled={loading}
            className={styles.claimBtn}
          >
            {loading ? 'CLAIMING...' : '✓ CLAIM'}
          </button>
          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}