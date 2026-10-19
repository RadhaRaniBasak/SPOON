import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Spoons — Neuro-Adaptive Energy & Executive Function Workspace',
  description: 'WCAG 2.2 AAA + W3C COGA neuro-inclusive workspace powered by OKLCH perceptual color physics and Spoon Theory.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Fraunces:ital,opsz,SOFT,WONK,wght@0,9..144,0..100,0..1,400..700;1,9..144,0..100,0..1,400..700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
