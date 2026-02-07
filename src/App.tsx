import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase'; // Importamos la conexión
import { Session } from '@supabase/supabase-js';

// Importamos tus pantallas
import VehicleTypeSelection from './screens/VehicleTypeSelection';
import VehicleProfileSetup from './screens/VehicleProfileSetup';
import Dashboard from './screens/Dashboard';
import TaskDetail from './screens/TaskDetail';
import Garage from './screens/Garage';
import History from './screens/History';
import Login from './screens/Login'; // La pantalla nueva

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ver si ya hay usuario al arrancar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Escuchar si el usuario entra o sale
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <HashRouter>
      <Routes>
        {/* SI NO HAY SESIÓN, SOLO MOSTRAMOS LOGIN */}
        {!session ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
        ) : (
            /* SI HAY SESIÓN, MOSTRAMOS LA APP */
            <>
              <Route path="/" element={<VehicleTypeSelection />} />
              <Route path="/setup-profile" element={<VehicleProfileSetup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/task-detail" element={<TaskDetail />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="/history" element={<History />} />
              {/* Si intentan ir a login estando logueados, mandar a inicio */}
              <Route path="/login" element={<Navigate to="/" replace />} />
            </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;
