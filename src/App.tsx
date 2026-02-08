import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// --- IMPORTAMOS LAS PANTALLAS REALES ---
import Login from './screens/Login';
import WelcomeOffer from './screens/WelcomeOffer';
import VehicleTypeSelection from './screens/VehicleTypeSelection'; // Pantalla para añadir coche
import Dashboard from './screens/Dashboard'; // Pantalla del garaje

// Componente "Cargando" bonito
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-500">Cargando tu garaje...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVehicles, setHasVehicles] = useState<boolean | null>(null); // null = no sabemos aún

  useEffect(() => {
    // 1. Verificamos la sesión
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkUserVehicles(); // Si hay usuario, buscamos sus coches
      else setLoading(false);
    });

    // 2. Escuchamos cambios (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkUserVehicles();
      else {
        setHasVehicles(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Función para ver si el usuario ya tiene coches creados
  const checkUserVehicles = async () => {
    try {
      // Intentamos contar los coches en la base de datos
      const { count, error } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      
      // Si count es mayor que 0, es que tiene coches -> True
      setHasVehicles(count !== null && count > 0);
    } catch (error) {
      console.log('Todavía no hay tabla de vehículos o ocurrió un error, enviando a crear coche...');
      setHasVehicles(false); // Ante la duda, le mandamos a crear uno
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <HashRouter>
      <Routes>
        {!session ? (
          /* --- RUTAS PÚBLICAS (NO LOGUEADO) --- */
          <>
            <Route path="/" element={<WelcomeOffer />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          /* --- RUTAS PRIVADAS (LOGUEADO) --- */
          <>
            {/* Si tiene coches va al Dashboard, si no, a elegir tipo de vehículo */}
            <Route 
              path="/" 
              element={
                hasVehicles ? <Dashboard /> : <Navigate to="/add-vehicle" replace />
              } 
            />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-vehicle" element={<VehicleTypeSelection />} />
            
            {/* Ruta por defecto logueado */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;
