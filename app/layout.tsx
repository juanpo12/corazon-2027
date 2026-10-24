import type { Metadata, Viewport } from 'next';
// Fuentes autoalojadas (no dependen de Google Fonts en el build)
import '@fontsource/anton/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/mrs-saint-delafield/400.css';
import './globals.css';

export const metadata: Metadata = {
  // Definir NEXT_PUBLIC_SITE_URL con el dominio final (https://www.conferenciadecorazonacorazon.com)
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Corazón a Corazón 2027 · Conferencia CLS San Justo',
  description:
    'Conferencia Corazón a Corazón 2027 — De gloria en gloria. 8 y 9 de febrero en J. M. Rosas 4357, San Justo. Con Juan Crudo, Sergio Belart, Marco Barrientos, Eddie Nunes y German Ponce.',
  openGraph: {
    title: 'Corazón a Corazón 2027',
    description: 'De gloria en gloria · 8 y 9 de febrero · San Justo',
    locale: 'es_AR',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#95B8F6' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
