import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export function useAgenda() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [datosLoading, setDatosLoading] = useState(false);
  const [ajustes, setAjustes] = useState({
    hora_apertura: '09:00',
    hora_cierre: '19:00',
    intervalo_minutos: 30,
    precio_corte: 15,
  });
  const [citas, setCitas] = useState<any[]>([]);
  const [diasCerrados, setDiasCerrados] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const cargarDatos = useCallback(async () => {
    if (!session) return;
    setDatosLoading(true);
    try {
      const { data: dataAj } = await supabase
        .from('ajustes')
        .select('*')
        .eq('id', 1)
        .single();
      if (dataAj) setAjustes(dataAj);
      const { data: dataCitas } = await supabase.from('citas').select('*');
      if (dataCitas) setCitas(dataCitas);
      const { data: dataDias } = await supabase
        .from('dias_cerrados')
        .select('fecha');
      if (dataDias) setDiasCerrados(dataDias.map((d) => d.fecha));
    } catch (error) {
      toast.error('Error cargando los datos');
    } finally {
      setDatosLoading(false);
    }
  }, [session]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const agendarCita = async (fecha: string, hora: string, cliente: string) => {
    // Evitar solapamientos (Validación extra de seguridad)
    if (citas.some((c) => c.fecha === fecha && c.hora === hora)) {
      toast.error('Ese hueco ya está ocupado');
      return false;
    }
    try {
      const { data, error } = await supabase
        .from('citas')
        .insert([{ fecha, hora, cliente }])
        .select()
        .single();
      if (error) throw error;
      setCitas((prev) => [...prev, data]);
      toast.success(`Cita guardada: ${cliente}`);
      return true;
    } catch (e) {
      toast.error('Error al agendar');
      return false;
    }
  };

  const eliminarCita = async (id: string) => {
    try {
      await supabase.from('citas').delete().eq('id', id);
      setCitas((prev) => prev.filter((c) => c.id !== id));
      toast.success('Cita cancelada');
    } catch (e) {
      toast.error('Error al cancelar');
    }
  };

  const toggleDiaCerrado = async (fecha: string) => {
    const estaCerrado = diasCerrados.includes(fecha);
    try {
      if (estaCerrado) {
        await supabase.from('dias_cerrados').delete().eq('fecha', fecha);
        setDiasCerrados((prev) => prev.filter((d) => d !== fecha));
        toast.success('Día abierto de nuevo');
      } else {
        await supabase.from('dias_cerrados').insert([{ fecha }]);
        setDiasCerrados((prev) => [...prev, fecha]);
        toast.success('Día marcado como cerrado');
      }
    } catch (e) {
      toast.error('Error al modificar el día');
    }
  };

  return {
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
  };
}
