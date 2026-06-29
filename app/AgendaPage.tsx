'use client';

import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useAgenda } from '@/hooks/useAgenda';
import Login from '@/components/Login';
import Header from '@/components/Header';
import PanelAjustes from '@/components/PanelAjustes';
import AgendaDiaria from '@/components/AgendaDiaria';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

function AgendaPrincipal() {
  const {
    session,
    authLoading,
    datosLoading,
    ajustes,
    setAjustes,
    citas,
    diasCerrados,
    agendarCita,
    eliminarCita,
    toggleDiaCerrado,
  } = useAgenda();

  const [mostrarAjustes, setMostrarAjustes] = useState(false);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());

  // Estados locales auxiliares para controlar el envío del Login
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium animate-pulse">
          Comprobando seguridad...
        </p>
      </div>
    );

  if (!session)
    return (
      <>
        <Toaster position="bottom-right" />
        <Login
          onLogin={async (e, p) => {
            setLoginLoading(true);
            setLoginError('');
            const { error } = await supabase.auth.signInWithPassword({
              email: e,
              password: p,
            });
            if (error) {
              setLoginError('Credenciales incorrectas');
            }
            setLoginLoading(false);
          }}
          loading={loginLoading}
          error={loginError}
        />
      </>
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <Toaster position="bottom-right" />
      <Header
        mostrarAjustes={mostrarAjustes}
        setMostrarAjustes={setMostrarAjustes}
        onLogout={() => supabase.auth.signOut()}
      />
      <main className="max-w-7xl mx-auto">
        {datosLoading ? (
          <div className="text-center py-20 text-slate-500 animate-pulse">
            Cargando la agenda de VillaLata Barber...
          </div>
        ) : mostrarAjustes ? (
          <PanelAjustes
            ajustes={ajustes}
            setAjustes={setAjustes}
            onGuardar={async () => {
              try {
                // CORRECCIÓN: Quitamos el ID del objeto para evitar errores en Supabase
                const { id, ...ajustesSinId } = ajustes;
                const { error } = await supabase
                  .from('ajustes')
                  .update(ajustesSinId)
                  .eq('id', 1);

                if (error) throw error;

                toast.success('Configuración guardada correctamente');
                setMostrarAjustes(false);
              } catch (err) {
                toast.error('Error al guardar los ajustes');
                console.error(err);
              }
            }}
          />
        ) : (
          <AgendaDiaria
            fechaActual={fechaActual}
            cambiarMes={(d) =>
              setFechaActual(
                new Date(
                  fechaActual.getFullYear(),
                  d === 'prev'
                    ? fechaActual.getMonth() - 1
                    : fechaActual.getMonth() + 1,
                  1
                )
              )
            }
            diaSeleccionado={diaSeleccionado}
            setDiaSeleccionado={setDiaSeleccionado}
            ajustes={ajustes}
            citas={citas}
            diasCerrados={diasCerrados}
            agendarCita={agendarCita}
            eliminarCita={eliminarCita}
            toggleDiaCerrado={toggleDiaCerrado}
          />
        )}
      </main>
    </div>
  );
}

// Exportación dinámica desactivando el SSR
export default AgendaPrincipal;
