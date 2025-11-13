// 📁 src/app/layout.tsx
// Main layout for RISE OF A YN

import type { Metadata } from 'next';
import { Righteous, Space_Mono } from 'next/font/google';
import '../styles/globals.css';

const righteous = Righteous({
  variable: '--font-righteous',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Rise of a YN',
  description: 'Grind from the streets to global dominance. Idle tycoon empire builder.',
  icons: {
    icon: '🎮',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${righteous.variable} ${spaceMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0a0e27" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}