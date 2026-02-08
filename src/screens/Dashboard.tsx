import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('vehicles').select('*').eq('user_id', user.id);
        if (data) setVehicles(data);
      }
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Mi Garaje 🔧</h1>
        <button onClick={signOut} className="text-red-600 font-medium">Salir</button>
      </div>
      <div className="p-4">
        {vehicles.length === 0 ? (
          <div className="text-center mt-10"><p>No hay vehículos.</p></div>
        ) : (
          vehicles.map((v) => (
            <div key={v.id} className="bg-white p-6 rounded-xl shadow-sm border mb-4">
              <h2 className="text-2xl font-bold">{v.type === 'car' ? '🚗' : '🏍️'} Mi Vehículo</h2>
              <p className="text-gray-500">Plan Gratuito</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
