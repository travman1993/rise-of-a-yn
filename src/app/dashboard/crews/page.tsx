// 📁 src/app/dashboard/crews/page.tsx
// Crews System - Create/Join/Manage Crews

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase';
import styles from './crews.module.css';

interface Crew {
  id: string;
  name: string;
  tag: string;
  leader_id: string;
  member_count: number;
  level: number;
  created_at: string;
}

export default function CrewsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userCrew, setUserCrew] = useState<Crew | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [crewName, setCrewName] = useState('');
  const [crewTag, setCrewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [allCrews, setAllCrews] = useState<Crew[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinList, setShowJoinList] = useState(false);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        loadUserCrew(currentUser.id);
        loadAllCrews();
      }
    };
    load();
  }, []);

  const loadUserCrew = async (userId: string) => {
    try {
      const res = await fetch(`/api/crews?userId=${userId}`);
      const data = await res.json();
      if (data.crew) {
        setUserCrew(data.crew);
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Load crew error:', error);
    }
  };

  const loadAllCrews = async () => {
    try {
      // This would need a separate endpoint to list all crews
      // For now, we'll just use the join list
      setAllCrews([]);
    } catch (error) {
      console.error('Load crews error:', error);
    }
  };

  const handleCreateCrew = async () => {
    if (!crewName.trim() || !crewTag.trim()) {
      alert('Enter crew name and tag');
      return;
    }

    if (crewTag.length > 4) {
      alert('Tag must be 4 characters or less');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/crews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          userId: user.id,
          crewName,
          crewTag,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setUserCrew(data.crew);
        setUserRole('leader');
        setCrewName('');
        setCrewTag('');
        setShowCreateForm(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Create crew error:', error);
      alert('Failed to create crew');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveCrew = async () => {
    if (!window.confirm('Leave crew?')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/crews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setUserCrew(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Leave crew error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>👥 CREWS</h1>
          <button onClick={() => router.back()} className={styles.backBtn}>
            ← BACK
          </button>
        </div>

        {userCrew ? (
          // IN CREW VIEW
          <div className={styles.crewView}>
            <div className={styles.crewCard}>
              <div className={styles.crewHeader}>
                <h2 className={styles.crewName}>{userCrew.name}</h2>
                <span className={styles.crewTag}>[{userCrew.tag}]</span>
                <span className={styles.crewBadge}>{userRole?.toUpperCase()}</span>
              </div>

              <div className={styles.crewStats}>
                <div className={styles.stat}>
                  <span className={styles.label}>Members</span>
                  <span className={styles.value}>{userCrew.member_count} / 50</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Crew Level</span>
                  <span className={styles.value}>{userCrew.level}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Income Bonus</span>
                  <span className={styles.value}>+{(userCrew.member_count * 0.5).toFixed(1)}%</span>
                </div>
              </div>

              <div className={styles.crewInfo}>
                <p>💡 <strong>Crew Bonus:</strong> +0.5% income per member (max +25%)</p>
                <p>📈 <strong>Level Up:</strong> Reach crew level by completing crew events</p>
              </div>

              <button onClick={handleLeaveCrew} disabled={loading} className={styles.leaveBtn}>
                {loading ? 'LEAVING...' : userRole === 'leader' ? 'DISBAND CREW' : 'LEAVE CREW'}
              </button>
            </div>
          </div>
        ) : (
          // NO CREW VIEW
          <div className={styles.noCrewView}>
            <div className={styles.emptyState}>
              <p className={styles.emptyIcon}>👥</p>
              <p className={styles.emptyText}>You're not in a crew yet!</p>
              <p className={styles.emptySubtext}>Create or join one to earn bonuses</p>
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className={styles.actionBtn}
              >
                {showCreateForm ? '✕ CANCEL' : '➕ CREATE CREW'}
              </button>

              <button
                onClick={() => setShowJoinList(!showJoinList)}
                className={styles.actionBtn}
              >
                {showJoinList ? '✕ CANCEL' : '🔍 BROWSE CREWS'}
              </button>
            </div>

            {/* CREATE FORM */}
            {showCreateForm && (
              <div className={styles.formPanel}>
                <h3>Create New Crew</h3>
                <div className={styles.formGroup}>
                  <label>Crew Name</label>
                  <input
                    type="text"
                    value={crewName}
                    onChange={(e) => setCrewName(e.target.value)}
                    placeholder="e.g. Street Legends"
                    maxLength={30}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Crew Tag (Max 4)</label>
                  <input
                    type="text"
                    value={crewTag}
                    onChange={(e) => setCrewTag(e.target.value.toUpperCase())}
                    placeholder="e.g. SL"
                    maxLength={4}
                  />
                </div>
                <button
                  onClick={handleCreateCrew}
                  disabled={loading || !crewName.trim()}
                  className={styles.submitBtn}
                >
                  {loading ? 'CREATING...' : '✓ CREATE CREW'}
                </button>
              </div>
            )}

            {/* JOIN LIST - Coming Soon */}
            {showJoinList && (
              <div className={styles.joinPanel}>
                <p className={styles.comingSoon}>🔒 Crew Discovery Coming Soon!</p>
                <p className={styles.comingSoon}>For now, ask a crew leader for an invite link</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}