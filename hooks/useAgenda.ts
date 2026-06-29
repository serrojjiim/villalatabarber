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
    // Protección extra: no intentamos cargar si no hay un ID de usuario válido
    if (!session?.user?.id) return;
    
    setDatosLoading(true);
    try {
      // 1. Cargamos los ajustes específicos de este peluquero
      const { data: dataAj } = await supabase
        .from('ajustes')
        .select('*')
        .eq('usuario_id', session.user.id)
        .single();
      
      if (dataAj) setAjustes(dataAj);

      // 2. Cargamos citas (RLS ya se encarga de filtrar solo las suyas por debajo)
      const { data: dataCitas } = await supabase.from('citas').select('*');
      if (dataCitas) setCitas(dataCitas);

      // 3. Cargamos sus días cerrados (RLS también filtra esto automáticamente)
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
    if (!session?.user?.id) return false;
    
    // Evitar solapamientos (Validación extra de seguridad)
    if (citas.some((c) => c.fecha === fecha && c.hora === hora)) {
      toast.error('Ese hueco ya está ocupado');
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('citas')
        // Inyectamos el ID del peluquero en la inserción
        .insert([{ fecha, hora, cliente, usuario_id: session.user.id }])
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
      // El borrado es seguro porque RLS impide borrar citas de otros usuarios
      await supabase.from('citas').delete().eq('id', id);
      setCitas((prev) => prev.filter((c) => c.id !== id));
      toast.success('Cita cancelada');
    } catch (e) {
      toast.error('Error al cancelar');
    }
  };

  const toggleDiaCerrado = async (fecha: string) => {
    if (!session?.user?.id) return;
    
    const estaCerrado = diasCerrados.includes(fecha);
    try {
      if (estaCerrado) {
        await supabase.from('dias_cerrados').delete().eq('fecha', fecha);
        setDiasCerrados((prev) => prev.filter((d) => d !== fecha));
        toast.success('Día abierto de nuevo');
      } else {
        await supabase.from('dias_cerrados')
          // Inyectamos el ID del peluquero en la inserción
          .insert([{ fecha, usuario_id: session.user.id }]);
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