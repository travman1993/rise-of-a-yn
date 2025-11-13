// 📁 src/app/dashboard/minigames/page.tsx
// Mini-Games Hub - Big Bank, Dice, Shootout
// PvP games and NPC challenges with interactive shootout

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPlayerStats } from '@/lib/supabase';
import { formatCash } from '@/lib/gameLogic';
import styles from './minigames.module.css';

type GameType = 'bigbank' | 'dice' | 'shootout' | null;
type Move = 'pull' | 'duck' | 'reload';

interface ShootoutRound {
  playerMove: Move;
  bossMove: Move;
  result: 'win' | 'lose' | 'tie';
}

export default function MiniGamesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [betAmount, setBetAmount] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // SHOOTOUT STATE
  const [shootoutRound, setShootoutRound] = useState(0);
  const [playerWins, setPlayerWins] = useState(0);
  const [bossWins, setBossWins] = useState(0);
  const [shootoutRounds, setShootoutRounds] = useState<ShootoutRound[]>([]);
  const [playerBullets, setPlayerBullets] = useState(3);
  const [bossBullets, setBossBullets] = useState(3);

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

  // EVALUATE ROUND
  function evaluateRound(playerMove: Move, bossMove: Move): 'win' | 'lose' | 'tie' {
    if (playerMove === bossMove) return 'tie';

    if (playerMove === 'pull' && bossMove === 'reload') return 'win';
    if (playerMove === 'pull' && bossMove === 'duck') return 'lose';

    if (playerMove === 'reload' && bossMove === 'duck') return 'win';
    if (playerMove === 'reload' && bossMove === 'pull') return 'lose';

    if (playerMove === 'duck' && bossMove === 'pull') return 'win';
    if (playerMove === 'duck' && bossMove === 'reload') return 'lose';

    return 'tie';
  }

  // GENERATE BOSS MOVE
  function generateBossMove(): Move {
    const moves: Move[] = ['pull', 'duck', 'reload'];
    if (Math.random() < 0.4) {
      // Counter player strategy
      return moves[Math.floor(Math.random() * moves.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // HANDLE PLAYER MOVE IN SHOOTOUT
  const handleShootoutMove = (playerMove: Move) => {
    if (playerMove === 'pull' && playerBullets === 0) {
      alert('No bullets! Use reload first.');
      return;
    }

    const bossMove = generateBossMove();
    const roundResult = evaluateRound(playerMove, bossMove);

    let newPlayerWins = playerWins;
    let newBossWins = bossWins;
    let newPlayerBullets = playerBullets;
    let newBossBullets = bossBullets;

    if (roundResult === 'win') {
      newPlayerWins++;
      if (playerMove === 'pull') newBossBullets--;
    } else if (roundResult === 'lose') {
      newBossWins++;
      if (bossMove === 'pull') newPlayerBullets--;
    }

    if (playerMove === 'reload') newPlayerBullets = 3;
    if (bossMove === 'reload') newBossBullets = 3;

    setShootoutRounds([
      ...shootoutRounds,
      { playerMove, bossMove, result: roundResult },
    ]);

    setPlayerWins(newPlayerWins);
    setBossWins(newBossWins);
    setPlayerBullets(newPlayerBullets);
    setBossBullets(newBossBullets);
    setShootoutRound(shootoutRound + 1);

    // Check if match is over (best of 5 = first to 3)
    if (newPlayerWins === 3 || newBossWins === 3) {
      finishShootout(newPlayerWins, newBossWins);
    }
  };

  // FINISH SHOOTOUT
  const finishShootout = async (finalPlayerWins: number, finalBossWins: number) => {
    const matchWinner = finalPlayerWins > finalBossWins ? 'player' : 'boss';
    let cashReward = 0;
    let respectReward = 0;

    if (matchWinner === 'player') {
      cashReward = betAmount;
      respectReward = 3;
    } else {
      cashReward = -betAmount;
      respectReward = -2;
    }

    setResult({
      success: true,
      matchWinner,
      playerWins: finalPlayerWins,
      bossWins: finalBossWins,
      rounds: shootoutRounds,
      cashReward,
      respectReward,
      totalCash: (stats?.cash || 0) + cashReward,
    });

    // Update stats
    const updated = await getPlayerStats(user.id);
    setStats(updated);
  };

  // START SHOOTOUT
  const handleStartShootout = () => {
    if (betAmount <= 0 || betAmount > (stats?.cash || 0)) {
      alert('Invalid bet amount');
      return;
    }

    setShootoutRound(0);
    setPlayerWins(0);
    setBossWins(0);
    setShootoutRounds([]);
    setPlayerBullets(3);
    setBossBullets(3);
    setResult(null);
  };

  if (!stats)
    return (
      <div className={styles.container}>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎲 STREET GAMES</h1>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← BACK
        </button>
      </div>

      {/* GAME SELECTOR */}
      {!activeGame && !result && (
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
      )}

      {/* SHOOTOUT SETUP */}
      {activeGame === 'shootout' && !result && shootoutRound === 0 && (
        <div className={styles.gamePanel}>
          <h2>🔫 SHOOTOUT - Best of 5</h2>

          <div className={styles.rules}>
            <p>💡 <strong>Rules:</strong></p>
            <ul>
              <li>Pull beats Reload</li>
              <li>Reload beats Duck</li>
              <li>Duck beats Pull</li>
              <li>Reload refills bullets (3 max)</li>
              <li>Cannot Pull with 0 bullets</li>
              <li>First to 3 wins takes match</li>
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

          <button
            onClick={handleStartShootout}
            disabled={betAmount <= 0 || betAmount > stats.cash}
            className={styles.startBtn}
          >
            START SHOOTOUT
          </button>
        </div>
      )}

      {/* SHOOTOUT GAMEPLAY */}
      {activeGame === 'shootout' && !result && shootoutRound > 0 && (
        <div className={styles.gamePanel}>
          <h2>🔫 ROUND {shootoutRound} / 5</h2>

          <div className={styles.scoreBoard}>
            <div className={styles.playerScore}>
              <h3>YOU</h3>
              <p className={styles.wins}>{playerWins}</p>
              <p className={styles.bullets}>💥 {playerBullets} bullets</p>
            </div>
            <div className={styles.vs}>VS</div>
            <div className={styles.bossScore}>
              <h3>BOSS</h3>
              <p className={styles.wins}>{bossWins}</p>
              <p className={styles.bullets}>💥 {bossBullets} bullets</p>
            </div>
          </div>

          <p className={styles.roundInfo}>Choose your move:</p>

          <div className={styles.moveButtons}>
            <button
              onClick={() => handleShootoutMove('pull')}
              disabled={playerBullets === 0}
              className={styles.moveBtn}
            >
              🔫 PULL
              <span className={styles.desc2}>Beats Reload</span>
            </button>
            <button onClick={() => handleShootoutMove('duck')} className={styles.moveBtn}>
              🦆 DUCK
              <span className={styles.desc2}>Beats Pull</span>
            </button>
            <button onClick={() => handleShootoutMove('reload')} className={styles.moveBtn}>
              🔄 RELOAD
              <span className={styles.desc2}>Beats Duck</span>
            </button>
          </div>

          {/* LAST ROUND RESULT */}
          {shootoutRounds.length > 0 && (
            <div className={styles.lastRound}>
              <h4>Last Round:</h4>
              <div className={styles.roundDisplay}>
                <span className={styles.move}>{shootoutRounds[shootoutRounds.length - 1].playerMove.toUpperCase()}</span>
                <span className={styles.vs2}>vs</span>
                <span className={styles.move}>{shootoutRounds[shootoutRounds.length - 1].bossMove.toUpperCase()}</span>
                <span
                  className={
                    shootoutRounds[shootoutRounds.length - 1].result === 'win'
                      ? styles.win
                      : shootoutRounds[shootoutRounds.length - 1].result === 'lose'
                      ? styles.lose
                      : styles.tie
                  }
                >
                  {shootoutRounds[shootoutRounds.length - 1].result.toUpperCase()}
                </span>
              </div>
            </div>
          )}
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
            {result.rounds.map((r: ShootoutRound, i: number) => (
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

          <button
            onClick={() => {
              setActiveGame(null);
              setResult(null);
              setBetAmount(0);
            }}
            className={styles.playAgainBtn}
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}