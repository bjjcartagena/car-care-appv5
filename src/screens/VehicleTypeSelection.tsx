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
        .insert([
          { user_id: user.id, type: type, name: 'Mi primer vehículo' }
        ]);

      if (error) {
        alert('Error al guardar: ' + error.message);
      } else {
        navigate('/dashboard');
        window.location.reload();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">¿Qué conduces?</h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-md mt-8">
        <button onClick={() => selectVehicle('car')} disabled={loading} className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition">
          <span className="text-4xl mr-4">🚗</span>
          <div className="text-left"><h3 className="font-bold text-lg">Turismo</h3></div>
        </button>
        <button onClick={() => selectVehicle('motorcycle')} disabled={loading} className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition">
          <span className="text-4xl mr-4">🏍️</span>
          <div className="text-left"><h3 className="font-bold text-lg">Moto</h3></div>
        </button>
         <button onClick={() => selectVehicle('van')} disabled={loading} className="flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition">
          <span className="text-4xl mr-4">🚐</span>
          <div className="text-left"><h3 className="font-bold text-lg">Furgoneta</h3></div>
        </button>
      </div>
    </div>
  );
}
