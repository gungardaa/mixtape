import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Press_Start_2P, Caveat } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const display = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display',
});

const handwritten = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-handwritten',
});

export const metadata: Metadata = {
  title: {
    default: 'Handmade Digital Mixtape',
    template: '%s | Handmade Digital Mixtape',
  },
  description: 'Make a nostalgic digital mixtape with a cover, stickers, songs, and a handwritten note.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${handwritten.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
