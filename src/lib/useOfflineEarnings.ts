// 📁 src/lib/useOfflineEarnings.ts
// Hook to check and claim offline earnings on app load

import { useEffect, useState } from 'react';

interface OfflineEarningsData {
  offlineIncome: number;
  offlineMinutes: number;
  capped: boolean;
  newCash: number;
}

export function useOfflineEarnings(userId: string | undefined, onEarningsClaimed: (data: OfflineEarningsData) => void) {
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [earningsData, setEarningsData] = useState<OfflineEarningsData | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for offline earnings on mount
  useEffect(() => {
    if (!userId) return;

    const checkOfflineEarnings = async () => {
      try {
        const res = await fetch(`/api/offline?userId=${userId}`);
        const data = await res.json();

        if (data.success && data.offlineIncome > 0) {
          setEarningsData({
            offlineIncome: data.offlineIncome,
            offlineMinutes: data.offlineMinutes,
            capped: data.capped,
            newCash: 0, // Will be set when claimed
          });
          setShowEarningsModal(true);
        }
      } catch (error) {
        console.error('Check offline earnings error:', error);
      }
    };

    checkOfflineEarnings();
  }, [userId]);

  const claimEarnings = async () => {
    if (!userId || !earningsData) return;

    setLoading(true);
    try {
      const res = await fetch('/api/offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (data.success) {
        const fullData: OfflineEarningsData = {
          offlineIncome: data.offlineIncome,
          offlineMinutes: data.offlineMinutes,
          capped: earningsData.capped,
          newCash: data.newCash,
        };
        onEarningsClaimed(fullData);
        setShowEarningsModal(false);
      }
    } catch (error) {
      console.error('Claim earnings error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    showEarningsModal,
    earningsData,
    loading,
    claimEarnings,
    closeModal: () => setShowEarningsModal(false),
  };
}