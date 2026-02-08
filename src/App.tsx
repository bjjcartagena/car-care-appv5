import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// Importamos todas las pantallas
import Login from './screens/Login';
import WelcomeOffer from './screens/WelcomeOffer';
import VehicleTypeSelection from './screens/VehicleTypeSelection'; 
import VehicleProfileSetup from './screens/VehicleProfileSetup'; // <--- NUEVO IMPORT
import Dashboard from './screens/Dashboard';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVehicles, setHasVehicles] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkUserVehicles();
      else setLoading(false);
    });

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

  const checkUserVehicles = async () => {
    try {
      const { count } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true });
      setHasVehicles(count !== null && count > 0);
    } catch (error) {
      setHasVehicles(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <HashRouter>
      <Routes>
        {!session ? (
          <>
            <Route path="/" element={<WelcomeOffer />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* Si tiene coches va al Dashboard, si no, a elegir tipo */}
            <Route path="/" element={hasVehicles ? <Dashboard /> : <Navigate to="/add-vehicle" replace />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-vehicle" element={<VehicleTypeSelection />} />
            <Route path="/setup-profile" element={<VehicleProfileSetup />} /> {/* <--- NUEVA RUTA */}
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;
