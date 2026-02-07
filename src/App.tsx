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
import Login from './screens/Login';

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

  if (loading) {
    return <div className="p-10 text-center">Cargando...</div>;
  }

  return (
    <HashRouter>
     
      {/* --- BOTÓN DE EMERGENCIA INICIO --- */}
      {session && (
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999,
            backgroundColor: 'red',
            color: 'white',
            padding: '15px',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          CERRAR SESIÓN (TEST)
        </button>
      )}
      {/* --- BOTÓN DE EMERGENCIA FIN --- */}
      <Routes>
    </HashRouter>
  );
};

export default App;
