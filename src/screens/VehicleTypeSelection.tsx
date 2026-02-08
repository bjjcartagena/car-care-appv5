import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function VehicleTypeSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const selectVehicle = async (type: string) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('vehicles')
        .insert([{ user_id: user.id, type: type, name: 'Mi primer vehículo' }]);

      if (error) {
        alert('Error: ' + error.message);
      } else {
        navigate('/dashboard');
        window.location.reload();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">¿Qué conduces?</h1>
      <div className="space-y-4 w-full max-w-md">
        <button onClick={() => selectVehicle('car')} disabled={loading} className="w-full p-6 border-2 rounded-xl hover:border-blue-600 flex items-center gap-4 text-xl font-bold">
          🚗 Turismo
        </button>
        <button onClick={() => selectVehicle('motorcycle')} disabled={loading} className="w-full p-6 border-2 rounded-xl hover:border-blue-600 flex items-center gap-4 text-xl font-bold">
          🏍️ Moto
        </button>
        <button onClick={() => selectVehicle('van')} disabled={loading} className="w-full p-6 border-2 rounded-xl hover:border-blue-600 flex items-center gap-4 text-xl font-bold">
          🚐 Furgoneta
        </button>
      </div>
    </div>
  );
}
