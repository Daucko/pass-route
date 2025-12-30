// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent Font Awesome from adding its CSS automatically
config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Pass Route - Crush JAMB with Surgical Precision',
  description:
    'AI-powered practice for JAMB/UTME. Gamified learning, adaptive AI, and guaranteed results.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
        <body className="font-sans antialiased bg-background text-foreground">
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
