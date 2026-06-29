import React from 'react';
import { Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  mostrarAjustes: boolean;
  setMostrarAjustes: (val: boolean) => void;
  onLogout: () => void;
}

export default function Header({
  mostrarAjustes,
  setMostrarAjustes,
  onLogout,
}: HeaderProps) {
  return (
    <header className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center border-b pb-4 border-slate-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          VillaLata Barber
        </h1>
        <p className="text-sm text-slate-500">
          Gestión interna de turnos y citas
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setMostrarAjustes(!mostrarAjustes)}
          className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100 transition-colors shadow-sm"
        >
          <Settings className="w-4 h-4 text-slate-600" />
          {mostrarAjustes ? 'Ver Agenda' : 'Ajustes'}
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>
    </header>
  );
}
