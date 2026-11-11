import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import RegistroSW from '@/components/RegistroSW';
import './globals.css';

export const metadata: Metadata = {
  title: 'KuatiAuto',
  description: 'Plataforma SaaS multiempresa para mantenimiento automotor en Paraguay.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'KuatiAuto',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#123C46',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <RegistroSW />
        <Analytics />
      </body>
    </html>
  );
}
