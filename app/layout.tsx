import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KuatiAuto',
  description: 'Plataforma SaaS multiempresa para mantenimiento automotor en Paraguay.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
