// 📁 src/components/Onboarding.tsx
// FIXED - Client-side only onboarding with proper auth flow

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import styles from '@/app/onboarding.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  action: string;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: '🧒 Start as YN (Youngin\')',
    description: 'You begin at the bottom. Every tycoon started somewhere. Learn the hustle, grind the corner.',
    action: 'Continue',
  },
  {
    id: 2,
    title: '💼 Build Your Empire',
    description: 'Buy businesses, hire managers & investors. Automation is your best friend. Watch your money multiply.',
    action: 'Continue',
  },
  {
    id: 3,
    title: '🥊 Fight Bosses & Climb Tiers',
    description: 'Defeat city bosses to unlock higher tiers. From street hustler → trap → entrepreneur → boss → el jefe.',
    action: 'Continue',
  },
  {
    id: 4,
    title: '💎 Prestige & Restart',
    description: 'Beat the Global Don? You\'re elite. Prestige to restart with harder economics but permanent power.',
    action: 'Continue',
  },
  {
    id: 5,
    title: '🎮 Play Mini-Games & Compete',
    description: 'Risk cash in Big Bank, Street Dice, or Shootout. Climb leaderboards. Join crews and flex on rivals.',
    action: 'Begin',
  },
];

interface OnboardingProps {
  onComplete: (username: string) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBegin = async () => {
    if (!username.trim()) {
      setError('Enter a username to begin');
      return;
    }

    if (username.length < 3 || username.length > 20) {
      setError('Username must be 3-20 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Sign up anonymous user with username metadata
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: `${username}-${Date.now()}@anonymous.local`,
        password: `temp_pass_${Math.random().toString(36).substring(7)}`,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Create player profile in database
        const { error: insertError } = await supabase.from('players').insert({
          user_id: data.user.id,
          username,
          cash: 1000,
          xp: 0,
          respect: 0,
          level: 1,
          tier: 1,
          energy: 100,
          max_energy: 100,
          last_energy_regen: new Date().toISOString(),
          prestige: 0,
          created_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;

        // Call the parent callback
        onComplete(username);

        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err.message || 'Failed to create account. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={styles.onboardingContainer}>
      <div className={styles.card}>
        {/* LOGO */}
        <div className={styles.logo}>
          🎮 GRIND CITY
        </div>

        {/* STEP INDICATOR */}
        <div className={styles.stepIndicator}>
          {steps.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === currentStep ? styles.active : ''} ${i < currentStep ? styles.completed : ''}`}
            />
          ))}
        </div>

        {/* STEP CONTENT */}
        <div className={styles.stepContent}>
          <h2 className={styles.title}>{step.title}</h2>
          <p className={styles.description}>{step.description}</p>
        </div>

        {/* USERNAME INPUT (Last step only) */}
        {isLastStep && (
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Choose Your Hustler Name:
            </label>
            <input
              id="username"
              type="text"
              className={styles.input}
              placeholder="e.g., StreetLord, TrapKing, YN_Grind"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              maxLength={20}
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleBegin();
              }}
            />
            {error && <p className={styles.error}>{error}</p>}
            <p className={styles.hint}>
              {username.length}/20 • Can't change later!
            </p>
          </div>
        )}

        {/* BUTTONS */}
        <div className={styles.buttonGroup}>
          {currentStep > 0 && (
            <button
              className={styles.backBtn}
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={isLoading}
            >
              ← Back
            </button>
          )}

          {!isLastStep ? (
            <button
              className={styles.nextBtn}
              onClick={handleNext}
              disabled={isLoading}
            >
              {step.action}
            </button>
          ) : (
            <button
              className={styles.beginBtn}
              onClick={handleBegin}
              disabled={isLoading || !username.trim()}
            >
              {isLoading ? '⏳ Creating...' : '🚀 Begin Grind'}
            </button>
          )}
        </div>

        {/* STEP COUNTER */}
        <p className={styles.stepCounter}>
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}