import React from 'react';
import { Settings, DollarSign } from 'lucide-react';

interface Ajustes {
  id? : number;
  hora_apertura: string;
  hora_cierre: string;
  intervalo_minutos: number;
  precio_corte: number;
}

interface PanelAjustesProps {
  ajustes: Ajustes;
  setAjustes: React.Dispatch<React.SetStateAction<Ajustes>>;
  onGuardar: () => void;
}

export default function PanelAjustes({
  ajustes,
  setAjustes,
  onGuardar,
}: PanelAjustesProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-indigo-600" /> Configuración del
        Servicio
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Hora Apertura
            </label>
            <input
              type="time"
              value={ajustes.hora_apertura}
              onChange={(e) =>
                setAjustes({ ...ajustes, hora_apertura: e.target.value })
              }
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Hora Cierre
            </label>
            <input
              type="time"
              value={ajustes.hora_cierre}
              onChange={(e) =>
                setAjustes({ ...ajustes, hora_cierre: e.target.value })
              }
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Duración del Bloque
          </label>
          <select
            value={ajustes.intervalo_minutos}
            onChange={(e) =>
              setAjustes({
                ...ajustes,
                intervalo_minutos: Number(e.target.value),
              })
            }
            className="w-full p-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value={15}>15 minutos</option>
            <option value={20}>20 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={45}>45 minutos</option>
            <option value={60}>60 minutos</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Precio del pelado (€)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Euro className="w-4 h-4" />
            </span>
            <input
              type="number"
              value={ajustes.precio_corte}
              onChange={(e) =>
                setAjustes({ ...ajustes, precio_corte: Number(e.target.value) })
              }
              className="w-full pl-8 p-2 border border-slate-300 rounded-lg"
            />
          </div>
        </div>
        <button
          onClick={onGuardar}
          className="w-full mt-2 bg-indigo-600 text-white p-2 rounded-lg font-medium hover:bg-indigo-700"
        >
          Guardar Ajustes
        </button>
      </div>
    </div>
  );
}
