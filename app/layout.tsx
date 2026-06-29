import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VillaLata Barber',
  description: 'Agenda interna',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VillaLata Barber',
    // Esto asegura que al abrir la app desde el icono, no salga la barra de Safari
  },
  // Si tienes un logo en public/logo.png, úsalo aquí para compartir
  openGraph: {
    title: 'VillaLata Barber',
    description: 'Agenda interna',
    images: ['/logo.png'], 
  },
};

// Configuramos el color del tema aquí
export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Esto evita que el móvil haga zoom al tocar los inputs
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Favicon e iconos de Apple */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}