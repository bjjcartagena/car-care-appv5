import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// Importamos SOLO el Login (que sabemos que existe)
import Login from './screens/Login';

// --- COMENTAMOS LO QUE FALTA POR AHORA ---
// import VehicleTypeSelection from './screens/VehicleTypeSelection';
// import VehicleProfileSetup from './screens/VehicleProfileSetup';
// import Dashboard from './screens/Dashboard';
// import TaskDetail from './screens/TaskDetail';
// import Garage from './screens/Garage';

// Componente temporal para cuando entras (mientras arreglamos el resto)
const Proximamente = () => (
  <div className="p-10 text-white bg-slate-900 min-h-screen text-center">
    <h1 className="text-3xl font-bold">¡Bienvenido! 🚗</h1>
    <p className="mt-4">Has iniciado sesión correctamente.</p>
    <p>El resto de la app se está cargando...</p>
    <button 
      onClick={() => supabase.auth.signOut()} 
      className="mt-8 bg-red-600 px-4 py-2 rounded text-white"
    >
      Cerrar Sesión
    </button>
  </div>
);

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="p-10 bg-slate-900 text-white">Cargando...</div>;

  return (
    <HashRouter>
      <Routes>
        {!session ? (
          /* SI NO HAY SESIÓN -> LOGIN */
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          /* SI HAY SESIÓN -> PANTALLA TEMPORAL */
          <>
            <Route path="/" element={<Proximamente />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;
