'use client';

import dynamic from 'next/dynamic';

// Cargamos todo el componente de la agenda forzando el lado del cliente al 100%
const AgendaCompleta = dynamic(() => import('./AgendaPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-500 font-medium animate-pulse">
        Iniciando entorno seguro de VillaLata Barber...
      </p>
    </div>
  ),
});

export default function Page() {
  return <AgendaCompleta />;
}
