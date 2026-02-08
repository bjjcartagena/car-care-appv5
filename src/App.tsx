// src/App.tsx
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// Importamos las pantallas (¡Incluyendo la nueva!)
import Login from './screens/Login';
import WelcomeOffer from './screens/WelcomeOffer'; // <-- NUEVA IMPORTACIÓN

// Comentamos el resto por ahora
// import VehicleTypeSelection from './screens/VehicleTypeSelection';
// import Dashboard from './screens/Dashboard';

// Componente temporal
const Proximamente = () => (
  <div className="p-10 text-gray-900 bg-gray-50 min-h-screen text-center flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold">¡Dentro! 🎉</h1>
    <p className="mt-4 text-xl">Has iniciado sesión con tu primer vehículo gratis.</p>
    <p className="mt-2 text-gray-600">(Aquí iría el Dashboard y la opción de subir de plan)</p>
    <button 
      onClick={() => supabase.auth.signOut()} 
      className="mt-8 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg text-gray-700 font-bold transition"
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Cargando...</div>;

  return (
    <HashRouter>
      <Routes>
        {!session ? (
          /* SI NO HAY SESIÓN */
          <>
            {/* La ruta raíz "/" ahora muestra la Oferta de Bienvenida */}
            <Route path="/" element={<WelcomeOffer />} />
            {/* La ruta "/login" muestra el Login minimalista */}
            <Route path="/login" element={<Login />} />
            {/* Cualquier otra ruta redirige a la Oferta de Bienvenida */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          /* SI HAY SESIÓN */
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
