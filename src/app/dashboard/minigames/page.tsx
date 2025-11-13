// 📁 src/app/dashboard/minigames/page.tsx
// Mini-Games Hub - Big Bank, Dice, Shootout
// PvP games and NPC challenges

'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, getPlayerStats } from '@/lib/supabase';
import { formatCash } from '@/lib/gameLogic';
import styles from './minigames.module.css';

type GameType = 'bigbank' | 'dice' | 'shootout' | null;

export default function MiniGamesPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [betAmount, setBetAmount] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const playerStats = await getPlayerStats(currentUser.id);
        setStats(playerStats);
      }
    };
    load();
  }, []);

  const handleShootout = async () => {
    setLoading(true);
    try {
      // Random 5 moves
      const moves = Array(5)
        .fill(null)
        .map(() => {
          const m = Math.floor(Math.random() * 3);
          return ['pull', 'duck', 'reload'][m];
        });

      const res = await fetch('/api/games/shootout', {
        method: 'POST',
        body: JSON.stringify({
          playerId: user.id,
          moves,
          stake: betAmount,
        }),
      });

      const data = await res.json();
      setResult(data);

      // Refresh stats
      const updated = await getPlayerStats(user.id);
      setStats(updated);
    } catch (error) {
      console.error('Shootout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎲 STREET GAMES</h1>

      {/* GAME SELECTOR */}
      <div className={styles.gameGrid}>
        {/* BIG BANK */}
        <div className={styles.gameCard}>
          <h3>💰 BIG BANK</h3>
          <p className={styles.desc}>Take from another player</p>
          <p className={styles.locked}>🔒 Coming Soon (Requires PvP Matchmaking)</p>
        </div>

        {/* DICE */}
        <div className={styles.gameCard}>
          <h3>🎲 STREET DICE</h3>
          <p className={styles.desc}>Highest roll wins</p>
          <p className={styles.locked}>🔒 Coming Soon (Requires Online Players)</p>
        </div>

        {/* SHOOTOUT */}
        <div className={`${styles.gameCard} ${styles.active}`}>
          <h3>🔫 SHOOTOUT</h3>
          <p className={styles.desc}>Best of 5 vs Boss</p>
          <button onClick={() => setActiveGame('shootout')} className={styles.playBtn}>
            PLAY NOW
          </button>
        </div>
      </div>

      {/* SHOOTOUT GAME */}
      {activeGame === 'shootout' && !result && (
        <div className={styles.gamePanel}>
          <h2>🔫 SHOOTOUT - Best of 5</h2>

          <div className={styles.rules}>
            <p>💡 <strong>Rules:</strong></p>
            <ul>
              <li>Pull beats Reload</li>
              <li>Reload beats Duck</li>
              <li>Duck beats Pull</li>
            </ul>
          </div>

          <div className={styles.betForm}>
            <label>Bet Amount:</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              max={stats.cash}
              placeholder="Enter amount"
            />
            <p className={styles.info}>Available: {formatCash(stats.cash)}</p>
          </div>

          <button onClick={handleShootout} disabled={loading || betAmount <= 0 || betAmount > stats.cash}>
            {loading ? 'PLAYING...' : 'START SHOOTOUT'}
          </button>
        </div>
      )}

      {/* SHOOTOUT RESULT */}
      {result && activeGame === 'shootout' && (
        <div className={styles.resultPanel}>
          <h2>🔫 SHOOTOUT RESULT</h2>

          <div className={styles.matchResult}>
            <div className={styles.side}>
              <h3>YOU</h3>
              <p className={styles.wins}>{result.playerWins}</p>
            </div>
            <div className={styles.vs}>VS</div>
            <div className={styles.side}>
              <h3>BOSS</h3>
              <p className={styles.wins}>{result.bossWins}</p>
            </div>
          </div>

          {result.matchWinner === 'player' ? (
            <div className={styles.victory}>
              <p className={styles.big}>🏆 YOU WIN!</p>
              <p>+{formatCash(result.cashReward)}</p>
              <p>+{result.respectReward} Respect</p>
            </div>
          ) : (
            <div className={styles.defeat}>
              <p className={styles.big}>💀 YOU LOST</p>
              <p>{formatCash(result.cashReward)}</p>
              <p>{result.respectReward} Respect</p>
            </div>
          )}

          <div className={styles.rounds}>
            {result.rounds.map((r: any, i: number) => (
              <div key={i} className={styles.round}>
                <span className={styles.move}>{r.playerMove.toUpperCase()}</span>
                <span className={styles.vs2}>vs</span>
                <span className={styles.move}>{r.bossMove.toUpperCase()}</span>
                <span className={r.result === 'win' ? styles.win : r.result === 'lose' ? styles.lose : styles.tie}>
                  {r.result.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <button onClick={() => { setActiveGame(null); setResult(null); }} className={styles.backBtn}>
            BACK
          </button>
        </div>
      )}
    </div>
  );
}