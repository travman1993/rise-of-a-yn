// 📁 src/app/dashboard/minigames/page.tsx
// FINAL FIXED Mini-Games Hub - Big Bank, Dice, Shootout
// User picks moves, CPU randomized each round, proper gameplay flow
// ALL SCOPE ISSUES FIXED ✅

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPlayerStats, updatePlayerStats } from '@/lib/supabase';
import { formatCash } from '@/lib/gameLogic';
import styles from './minigames.module.css';

type GameType = 'bigbank' | 'dice' | 'shootout' | null;
type Move = 'pull' | 'duck' | 'reload';
type GamePhase = 'select' | 'betting' | 'playing' | 'result';

interface ShootoutRound {
  playerMove: Move;
  cpuMove: Move;
  result: 'win' | 'lose' | 'tie';
}

export default function MiniGamesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('select');
  const [betAmount, setBetAmount] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // SHOOTOUT STATE
  const [shootoutRound, setShootoutRound] = useState(0);
  const [playerWins, setPlayerWins] = useState(0);
  const [cpuWins, setCpuWins] = useState(0);
  const [shootoutRounds, setShootoutRounds] = useState<ShootoutRound[]>([]);
  const [playerBullets, setPlayerBullets] = useState(3);
  const [cpuBullets, setCpuBullets] = useState(3);
  const [lastRoundResult, setLastRoundResult] = useState<ShootoutRound | null>(null);
  const [waitingForMove, setWaitingForMove] = useState(false);
  const [currentBet, setCurrentBet] = useState(0); // ✅ Store the bet amount here

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

  // GAME RULES - Evaluate round winner
  const evaluateRound = (playerMove: Move, cpuMove: Move): 'win' | 'lose' | 'tie' => {
    if (playerMove === cpuMove) return 'tie';

    // Pull beats Reload
    if (playerMove === 'pull' && cpuMove === 'reload') return 'win';
    if (playerMove === 'pull' && cpuMove === 'duck') return 'lose';

    // Reload beats Duck
    if (playerMove === 'reload' && cpuMove === 'duck') return 'win';
    if (playerMove === 'reload' && cpuMove === 'pull') return 'lose';

    // Duck beats Pull
    if (playerMove === 'duck' && cpuMove === 'pull') return 'win';
    if (playerMove === 'duck' && cpuMove === 'reload') return 'lose';

    return 'tie';
  };

  // CPU MAKES RANDOM MOVE - Fully randomized, not predictive
  const generateCpuMove = (): Move => {
    const moves: Move[] = ['pull', 'duck', 'reload'];
    return moves[Math.floor(Math.random() * moves.length)];
  };

  // START SHOOTOUT GAME
  const handleStartShootout = () => {
    const amount = Number(betAmount);

    if (!amount || amount <= 0) {
      alert('Enter a valid bet amount!');
      return;
    }

    if (amount > (stats?.cash || 0)) {
      alert('Insufficient cash!');
      return;
    }

    // ✅ Store the bet amount for later use
    setCurrentBet(amount);

    // Reset state and start
    setShootoutRound(1);
    setPlayerWins(0);
    setCpuWins(0);
    setShootoutRounds([]);
    setPlayerBullets(3);
    setCpuBullets(3);
    setLastRoundResult(null);
    setResult(null);
    setGamePhase('playing');
    setWaitingForMove(true);
  };

  // PLAYER MAKES A MOVE
  const handlePlayerMove = async (playerMove: Move) => {
    if (waitingForMove === false) return;
    if (playerMove === 'pull' && playerBullets === 0) {
      alert('❌ No bullets! Use reload first.');
      return;
    }

    setWaitingForMove(false);

    // CPU makes their move (completely random)
    const cpuMove = generateCpuMove();

    // Evaluate round
    const roundResult = evaluateRound(playerMove, cpuMove);

    // Update bullets and wins
    let newPlayerWins = playerWins;
    let newCpuWins = cpuWins;
    let newPlayerBullets = playerBullets;
    let newCpuBullets = cpuBullets;

    // Handle round result
    if (roundResult === 'win') {
      newPlayerWins++;
      if (playerMove === 'pull') {
        newCpuBullets--;
      }
    } else if (roundResult === 'lose') {
      newCpuWins++;
      if (cpuMove === 'pull') {
        newPlayerBullets--;
      }
    }

    // Handle reload moves
    if (playerMove === 'reload') newPlayerBullets = 3;
    if (cpuMove === 'reload') newCpuBullets = 3;

    // Store round info
    const roundInfo: ShootoutRound = { playerMove, cpuMove, result: roundResult };

    // Update state
    setPlayerWins(newPlayerWins);
    setCpuWins(newCpuWins);
    setPlayerBullets(newPlayerBullets);
    setCpuBullets(newCpuBullets);
    setShootoutRounds([...shootoutRounds, roundInfo]);
    setLastRoundResult(roundInfo);

    // Check if match is over (first to 3 wins)
    if (newPlayerWins === 3 || newCpuWins === 3) {
      finishShootout(newPlayerWins, newCpuWins);
    } else {
      // Move to next round
      setShootoutRound(shootoutRound + 1);
      setWaitingForMove(true);
    }
  };

  // FINISH SHOOTOUT GAME
  const finishShootout = async (finalPlayerWins: number, finalCpuWins: number) => {
    const playerWon = finalPlayerWins > finalCpuWins;
    let cashReward = 0;
    let respectReward = 0;

    // ✅ Use currentBet - not betAmount which has scope issues
    if (playerWon) {
      cashReward = currentBet; // WIN: +bet
      respectReward = 3;
    } else {
      cashReward = -currentBet; // LOSE: -bet
      respectReward = -2;
    }

    const newCash = Math.max(0, (stats?.cash || 0) + cashReward);
    const newRespect = Math.max(0, (stats?.respect || 0) + respectReward);

    // Update stats in database
    try {
      await updatePlayerStats(stats.user_id, {
        cash: newCash,
        respect: newRespect,
        updated_at: new Date().toISOString(),
      });

      // Get updated stats
      const updated = await getPlayerStats(stats.user_id);
      setStats(updated);
    } catch (error) {
      console.error('Error updating stats:', error);
    }

    setResult({
      won: playerWon,
      playerWins: finalPlayerWins,
      cpuWins: finalCpuWins,
      cashReward,
      respectReward,
      newCash,
      rounds: shootoutRounds,
    });

    setGamePhase('result');
  };

  // RESET AND GO BACK
  const handleBackToGames = () => {
    setActiveGame(null);
    setGamePhase('select');
    setBetAmount('');
    setResult(null);
    setShootoutRound(0);
    setPlayerWins(0);
    setCpuWins(0);
    setShootoutRounds([]);
    setPlayerBullets(3);
    setCpuBullets(3);
    setLastRoundResult(null);
    setCurrentBet(0);
  };

  if (!stats) {
    return (
      <div className={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>🎲 STREET GAMES</h1>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← BACK
        </button>
      </div>

      {/* GAME SELECTOR */}
      {gamePhase === 'select' && !activeGame && (
        <div className={styles.gameGrid}>
          {/* BIG BANK */}
          <div className={styles.gameCard}>
            <h3>💰 BIG BANK</h3>
            <p className={styles.desc}>Take from another player</p>
            <p className={styles.locked}>🔒 Coming Soon (Needs Players)</p>
          </div>

          {/* DICE */}
          <div className={styles.gameCard}>
            <h3>🎲 STREET DICE</h3>
            <p className={styles.desc}>Highest roll wins</p>
            <p className={styles.locked}>🔒 Coming Soon (Needs Players)</p>
          </div>

          {/* SHOOTOUT */}
          <div className={`${styles.gameCard} ${styles.active}`}>
            <h3>🔫 SHOOTOUT</h3>
            <p className={styles.desc}>Best of 5 vs CPU</p>
            <button onClick={() => { setActiveGame('shootout'); setGamePhase('betting'); }} className={styles.playBtn}>
              PLAY NOW
            </button>
          </div>
        </div>
      )}

      {/* SHOOTOUT BETTING PHASE */}
      {activeGame === 'shootout' && gamePhase === 'betting' && (
        <div className={styles.gamePanel}>
          <h2>🔫 SHOOTOUT - Best of 5</h2>

          <div className={styles.rules}>
            <p>💡 <strong>HOW TO PLAY:</strong></p>
            <ul>
              <li>🔫 <strong>Pull</strong> beats Reload (but needs bullets)</li>
              <li>🦆 <strong>Duck</strong> beats Pull (defensive)</li>
              <li>🔄 <strong>Reload</strong> beats Duck (refills 3 bullets)</li>
              <li>You can't Pull with 0 bullets</li>
              <li>First to 3 wins takes the match!</li>
              <li><strong>YOUR STRATEGY:</strong> Pick your moves - CPU is fully random</li>
            </ul>
          </div>

          <div className={styles.betForm}>
            <label>🎯 How much do you want to risk?</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              max={stats.cash}
              placeholder="Enter bet amount"
              className={styles.input}
            />
            <p className={styles.info}>Available: {formatCash(stats.cash)}</p>
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={handleStartShootout}
              disabled={!betAmount || Number(betAmount) <= 0 || Number(betAmount) > stats.cash}
              className={styles.startBtn}
            >
              ✅ START GAME
            </button>
            <button onClick={handleBackToGames} className={styles.backGameBtn}>
              ← BACK
            </button>
          </div>
        </div>
      )}

      {/* SHOOTOUT GAMEPLAY */}
      {activeGame === 'shootout' && gamePhase === 'playing' && shootoutRound > 0 && !result && (
        <div className={styles.gamePanel}>
          <h2>🔫 ROUND {shootoutRound} / 5</h2>

          {/* SCOREBOARD */}
          <div className={styles.scoreBoard}>
            <div className={styles.playerScore}>
              <h3>YOU</h3>
              <p className={styles.wins}>{playerWins}</p>
              <p className={styles.bullets}>💥 Bullets: {playerBullets}</p>
            </div>
            <div className={styles.vs}>VS</div>
            <div className={styles.cpuScore}>
              <h3>CPU</h3>
              <p className={styles.wins}>{cpuWins}</p>
              <p className={styles.bullets}>💥 Bullets: {cpuBullets}</p>
            </div>
          </div>

          {/* MOVE BUTTONS */}
          <p className={styles.roundInfo}>
            {waitingForMove ? '👇 CHOOSE YOUR MOVE:' : '⏳ CPU is thinking...'}
          </p>

          <div className={styles.moveButtons}>
            <button
              onClick={() => handlePlayerMove('pull')}
              disabled={playerBullets === 0 || !waitingForMove}
              className={`${styles.moveBtn} ${playerBullets === 0 ? styles.disabled : ''}`}
              title={playerBullets === 0 ? 'Need bullets! Use reload.' : 'Beats Reload'}
            >
              🔫 PULL
              <span className={styles.desc2}>Beats Reload</span>
              {playerBullets === 0 && <span className={styles.warning}>NO AMMO</span>}
            </button>

            <button
              onClick={() => handlePlayerMove('duck')}
              disabled={!waitingForMove}
              className={styles.moveBtn}
              title="Beats Pull"
            >
              🦆 DUCK
              <span className={styles.desc2}>Beats Pull</span>
            </button>

            <button
              onClick={() => handlePlayerMove('reload')}
              disabled={!waitingForMove}
              className={styles.moveBtn}
              title="Beats Duck, Refills bullets"
            >
              🔄 RELOAD
              <span className={styles.desc2}>Beats Duck</span>
            </button>
          </div>

          {/* LAST ROUND RESULT */}
          {lastRoundResult && (
            <div className={styles.lastRound}>
              <h4>Last Round:</h4>
              <div className={styles.roundDisplay}>
                <span className={styles.playerMove}>{lastRoundResult.playerMove.toUpperCase()}</span>
                <span className={styles.vs2}>VS</span>
                <span className={styles.cpuMove}>{lastRoundResult.cpuMove.toUpperCase()}</span>
                <span
                  className={`${styles.result} ${
                    lastRoundResult.result === 'win'
                      ? styles.win
                      : lastRoundResult.result === 'lose'
                      ? styles.lose
                      : styles.tie
                  }`}
                >
                  {lastRoundResult.result === 'win'
                    ? '✅ WIN'
                    : lastRoundResult.result === 'lose'
                    ? '❌ LOSS'
                    : '🤝 TIE'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SHOOTOUT RESULT */}
      {activeGame === 'shootout' && gamePhase === 'result' && result && (
        <div className={styles.resultPanel}>
          <h2>🔫 GAME OVER</h2>

          {/* FINAL SCORE */}
          <div className={styles.finalScore}>
            <div className={styles.side}>
              <h3>YOU</h3>
              <p className={styles.bigWins}>{result.playerWins}</p>
            </div>
            <div className={styles.vs}>VS</div>
            <div className={styles.side}>
              <h3>CPU</h3>
              <p className={styles.bigWins}>{result.cpuWins}</p>
            </div>
          </div>

          {/* RESULT MESSAGE */}
          {result.won ? (
            <div className={`${styles.resultMessage} ${styles.victory}`}>
              <h3>🎉 VICTORY! 🎉</h3>
              <p>You dominated the shootout!</p>
              <div className={styles.rewards}>
                <div className={styles.reward}>
                  <p className={styles.label}>💰 CASH WON</p>
                  <p className={styles.value}>+{formatCash(result.cashReward)}</p>
                </div>
                <div className={styles.reward}>
                  <p className={styles.label}>🔥 RESPECT</p>
                  <p className={styles.value}>+{result.respectReward}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${styles.resultMessage} ${styles.defeat}`}>
              <h3>❌ DEFEATED ❌</h3>
              <p>The CPU was too strong this time.</p>
              <div className={styles.rewards}>
                <div className={styles.reward}>
                  <p className={styles.label}>💰 CASH LOST</p>
                  <p className={styles.value}>{formatCash(result.cashReward)}</p>
                </div>
                <div className={styles.reward}>
                  <p className={styles.label}>🔥 RESPECT</p>
                  <p className={styles.value}>{result.respectReward}</p>
                </div>
              </div>
            </div>
          )}

          {/* NEW TOTALS */}
          <div className={styles.newTotals}>
            <p>
              <strong>New Cash:</strong> {formatCash(result.newCash)}
            </p>
            <p>
              <strong>New Respect:</strong> {stats.respect}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className={styles.buttonGroup}>
            <button onClick={handleBackToGames} className={styles.playAgainBtn}>
              🎮 PLAY AGAIN
            </button>
            <button onClick={() => router.back()} className={styles.backGameBtn}>
              ← BACK TO DASHBOARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}