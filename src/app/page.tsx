// 📁 src/app/page.tsx
// Login/Signup page for RISE OF A YN

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, signIn } from '@/lib/supabase';
import styles from './page.module.css';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!username.trim()) {
        throw new Error('Username required');
      }
      await signUp(email, password, username);
      router.push('/onboard');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* BACKGROUND EFFECT */}
      <div className={styles.bgEffect}></div>

      {/* MAIN CARD */}
      <div className={styles.card}>
        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className="neon-text">RISE</span>
            <br />
            <span className="neon-text-pink">OF A YN</span>
          </h1>
          <p className={styles.subtitle}>
            From the streets to global dominance
          </p>
        </div>

        {/* TABS */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${!isSignUp ? styles.active : ''}`}
            onClick={() => setIsSignUp(false)}
          >
            SIGN IN
          </button>
          <button
            className={`${styles.tab} ${isSignUp ? styles.active : ''}`}
            onClick={() => setIsSignUp(true)}
          >
            START GRINDING
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
          className={styles.form}
        >
          {/* EMAIL */}
          <div className={styles.formGroup}>
            <label>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* USERNAME (SIGN UP ONLY) */}
          {isSignUp && (
            <div className={styles.formGroup}>
              <label>USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="YourYNName"
                required
              />
            </div>
          )}

          {/* PASSWORD */}
          <div className={styles.formGroup}>
            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && <div className={styles.error}>{error}</div>}

          {/* SUBMIT BUTTON */}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'LOADING...' : isSignUp ? 'START GRINDING 🔥' : 'ENTER THE GAME'}
          </button>
        </form>

        {/* FOOTER */}
        <div className={styles.footer}>
          <p>
            {isSignUp ? 'Already grinding?' : 'New to the streets?'}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className={styles.switchBtn}
            >
              {isSignUp ? 'Sign in' : 'Start here'}
            </button>
          </p>
        </div>
      </div>

      {/* SIDE TEXT */}
      <div className={styles.sideText}>
        <p>💰 BUILD EMPIRES</p>
        <p>🔥 GRIND CASH</p>
        <p>👑 DOMINATE</p>
      </div>
    </div>
  );
}