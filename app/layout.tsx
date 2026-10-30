import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Web App',
  description: 'Blueprint de web app con auth y CRUD.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
