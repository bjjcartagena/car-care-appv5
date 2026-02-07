import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// Tus pantallas
import VehicleTypeSelection from './screens/VehicleTypeSelection';
import VehicleProfileSetup from './screens/VehicleProfileSetup';
import Dashboard from './screens/Dashboard';
import TaskDetail from './screens/TaskDetail';
import Garage from './screens/Garage';
import Login from './screens/Login'; // Asegúrate de que este archivo existe

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comprobar sesión al inicio
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchar cambios (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Cargando...</div>;
  }

  return (
    <HashRouter>
      <Routes>
        {!session ? (
          // SI NO HAY SESIÓN -> AL LOGIN
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          // SI HAY SESIÓN -> A LA APP
          <>
            <Route path="/" element={<VehicleTypeSelection />} />
            <Route path="/setup-profile" element={<VehicleProfileSetup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/task-detail" element={<TaskDetail />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;
