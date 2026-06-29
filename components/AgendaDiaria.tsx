import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Plus,
  DollarSign,
  Ban,
  TrendingUp,
} from 'lucide-react';

export default function AgendaDiaria({
  fechaActual,
  cambiarMes,
  diaSeleccionado,
  setDiaSeleccionado,
  ajustes,
  citas,
  diasCerrados,
  agendarCita,
  eliminarCita,
  toggleDiaCerrado,
}: any) {
  const [nuevoCliente, setNuevoCliente] = useState('');
  const [horaNuevaCita, setHoraNuevaCita] = useState('');

  const anyo = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();
  const nombreMeses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  const diasEnMes = new Date(anyo, mes + 1, 0).getDate();
  const primerDiaSemana = (new Date(anyo, mes, 1).getDay() + 6) % 7;

  // Fecha de HOY normalizada a las 00:00:00 para comparar el pasado
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Lógica de fechas y huecos
  const fechaLocal = new Date(
    diaSeleccionado.getTime() - diaSeleccionado.getTimezoneOffset() * 60000
  );
  const fechaSeleccionadaString = fechaLocal.toISOString().split('T')[0];
  const diaEstaCerrado = diasCerrados.includes(fechaSeleccionadaString);
  const citasDelDia = citas.filter(
    (c: any) => c.fecha === fechaSeleccionadaString
  );

  // Verificamos si el día que estamos visualizando en el panel derecho es del pasado
  const diaSelNormalizado = new Date(diaSeleccionado.getFullYear(), diaSeleccionado.getMonth(), diaSeleccionado.getDate());
  const esDiaSeleccionadoPasado = diaSelNormalizado.getTime() < hoy.getTime();

  // Estadísticas del mes actual
  const stringMesActual = `${anyo}-${String(mes + 1).padStart(2, '0')}`;
  const citasEsteMes = citas.filter((c: any) =>
    c.fecha.startsWith(stringMesActual)
  ).length;
  const ingresosEstimados = citasEsteMes * ajustes.precio_corte;

  const huecosHorarios = useMemo(() => {
    const slots = [];
    let [horaAct, minAct] = ajustes.hora_apertura.split(':').map(Number);
    const [horaFin, minFin] = ajustes.hora_cierre.split(':').map(Number);
    while (horaAct * 60 + minAct < horaFin * 60 + minFin) {
      slots.push(
        `${String(horaAct).padStart(2, '0')}:${String(minAct).padStart(2, '0')}`
      );
      minAct += ajustes.intervalo_minutos;
      if (minAct >= 60) {
        horaAct += Math.floor(minAct / 60);
        minAct = minAct % 60;
      }
    }
    return slots;
  }, [ajustes]);

  const handleSubmitCita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (esDiaSeleccionadoPasado) return; // Doble validación de seguridad
    
    const exito = await agendarCita(
      fechaSeleccionadaString,
      horaNuevaCita,
      nuevoCliente
    );
    if (exito) {
      setNuevoCliente('');
      setHoraNuevaCita('');
    }
  };

  const handleEliminar = (cita: any) => {
    if (esDiaSeleccionadoPasado) return;
    if (window.confirm(`¿Seguro que quieres cancelar la cita de ${cita.cliente}?`)) {
      eliminarCita(cita.id);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        {/* WIDGET DE INGRESOS */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-sm p-4 text-white flex justify-between items-center">
          <div>
            <span className="text-indigo-100 text-sm font-medium uppercase tracking-wider">
              Ingresos {nombreMeses[mes]}
            </span>
            <div className="text-2xl font-bold flex items-center gap-2 mt-1">
              <TrendingUp className="w-5 h-5" /> {ingresosEstimados} €
            </div>
          </div>
          <div className="text-right">
            <span className="text-indigo-100 text-sm">Citas completadas</span>
            <div className="text-xl font-semibold">{citasEsteMes}</div>
          </div>
        </div>

        {/* CALENDARIO */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {nombreMeses[mes]}{' '}
              <span className="text-slate-400 font-normal">{anyo}</span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => cambiarMes('prev')}
                className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => cambiarMes('next')}
                className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400">
            <div>LUN</div>
            <div>MAR</div>
            <div>MIÉ</div>
            <div>JUE</div>
            <div>VIE</div>
            <div>SÁB</div>
            <div>DOM</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: primerDiaSemana }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-14 md:h-20 bg-slate-50/50 rounded-lg border border-dashed border-slate-100"
              ></div>
            ))}
            {Array.from({ length: diasEnMes }).map((_, i) => {
              const dia = i + 1;
              const f = new Date(anyo, mes, dia);
              const fLocal = new Date(f.getTime() - f.getTimezoneOffset() * 60000).toISOString().split('T')[0];
              
              const esSeleccionado = diaSeleccionado.getDate() === dia && diaSeleccionado.getMonth() === mes;
              const esCerrado = diasCerrados.includes(fLocal);
              const numeroCitas = citas.filter((c: any) => c.fecha === fLocal).length;
              const esPasado = f.getTime() < hoy.getTime();

              return (
                <button
                  key={`dia-${dia}`}
                  onClick={() => {
                    setDiaSeleccionado(f);
                    setHoraNuevaCita(''); // Resetea el formulario si cambia de día
                  }}
                  className={`h-14 md:h-20 p-2 flex flex-col justify-between rounded-lg border text-left transition-colors
                    ${esSeleccionado
                        ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/30'
                        : esPasado 
                          ? 'border-slate-100 bg-slate-50/70 hover:bg-slate-100' // Estilo apagado para días pasados
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                    }
                    ${esCerrado ? 'opacity-50 bg-slate-100' : ''}
                  `}
                >
                  <span
                    className={`text-sm font-semibold
                      ${esSeleccionado 
                        ? 'text-indigo-600' 
                        : esPasado 
                          ? 'text-slate-400' 
                          : 'text-slate-700'}
                      ${esCerrado ? 'line-through text-slate-400' : ''}
                    `}
                  >
                    {dia}
                  </span>
                  {numeroCitas > 0 && !esCerrado && (
                    <span className={`text-[10px] md:text-xs font-medium px-1.5 py-0.5 rounded-md
                      ${esPasado 
                        ? 'bg-slate-200 text-slate-500' // Citas pasadas en gris
                        : 'bg-emerald-100 text-emerald-800' // Citas futuras en verde
                      }`}
                    >
                      {numeroCitas}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
        <div className="border-b pb-4 mb-4 flex justify-between items-start">
          <div>
            <span className="text-xs uppercase font-semibold text-indigo-600">
              {esDiaSeleccionadoPasado ? 'Historial del Día' : 'Detalle del Día'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {diaSeleccionado.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h2>
          </div>
          
          {/* BOTÓN CERRAR DÍA: Deshabilitado si es pasado */}
          <button
            onClick={() => !esDiaSeleccionadoPasado && toggleDiaCerrado(fechaSeleccionadaString)}
            disabled={esDiaSeleccionadoPasado}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors
              ${esDiaSeleccionadoPasado
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : diaEstaCerrado
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
              }
            `}
          >
            {diaEstaCerrado ? (
              'Reabrir Día'
            ) : (
              <>
                <Ban className="w-3 h-3" /> Cerrar Día
              </>
            )}
          </button>
        </div>

        {diaEstaCerrado ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Ban className="w-12 h-12 mb-2 text-slate-300" />
            <p className="font-medium text-slate-500">
              Día cerrado por descanso o festivo
            </p>
          </div>
        ) : (
          <>
            {horaNuevaCita && !esDiaSeleccionadoPasado && (
              <form
                onSubmit={handleSubmitCita}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 flex gap-2"
              >
                <input
                  type="text"
                  placeholder={`Agendar a las ${horaNuevaCita}...`}
                  value={nuevoCliente}
                  onChange={(e) => setNuevoCliente(e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded-md text-sm focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setHoraNuevaCita('')}
                  className="bg-slate-200 text-slate-700 px-3 py-2 rounded-md text-sm"
                >
                  X
                </button>
              </form>
            )}

            <div className="space-y-2 overflow-y-auto max-h-[400px] flex-1">
              {huecosHorarios.map((hora) => {
                const cita = citasDelDia.find((c: any) => c.hora === hora);
                return (
                  <div
                    key={hora}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      cita
                        ? esDiaSeleccionadoPasado ? 'bg-slate-50 border-slate-200' : 'bg-rose-50/50 border-rose-100'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono text-sm font-semibold ${
                          cita 
                            ? esDiaSeleccionadoPasado ? 'text-slate-500' : 'text-rose-600' 
                            : 'text-slate-400'
                        }`}
                      >
                        {hora}
                      </span>
                      {cita ? (
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${esDiaSeleccionadoPasado ? 'text-slate-600' : 'text-rose-900'}`}>
                          <User className={`w-3.5 h-3.5 ${esDiaSeleccionadoPasado ? 'text-slate-400' : 'text-rose-500'}`} />
                          {cita.cliente}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Disponible
                        </span>
                      )}
                    </div>
                    
                    {/* BOTONES DE ACCIÓN: Ocultos si es un día pasado */}
                    {cita ? (
                      !esDiaSeleccionadoPasado && (
                        <button
                          onClick={() => handleEliminar(cita)}
                          className="text-xs font-medium text-rose-500 hover:underline"
                        >
                          Cancelar
                        </button>
                      )
                    ) : (
                      !esDiaSeleccionadoPasado ? (
                        <button
                          onClick={() => setHoraNuevaCita(hora)}
                          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Cita
                        </button>
                      ) : (
                        <span className="text-xs text-slate-300 italic">No disponible</span>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}