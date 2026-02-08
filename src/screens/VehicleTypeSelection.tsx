import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function VehicleTypeSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const selectVehicle = async (type: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('vehicles')
          .insert([
            { user_id: user.id, type: type, name: 'Mi Vehículo' }
          ]);

        if (error) throw error;

        // Éxito: Vamos al garaje y recargamos
        navigate('/dashboard');
        window.location.reload();
      }
    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      
      {/* Cabecera Minimalista */}
      <div className="max-w-md w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Elige tu vehículo
        </h1>
        <p className="text-gray-500 text-lg">
          Para personalizar tu plan de mantenimiento.
        </p>
      </div>

      {/* Tarjetas de Selección */}
      <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
        
        {/* Opción TURISMO */}
        <button 
          onClick={() => selectVehicle('car')}
          disabled={loading}
          className="group relative flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-blue-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-14 w-14 bg-blue-50 text-3xl flex items-center justify-center rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            🚗
          </div>
          <div className="ml-5 text-left">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Coche</h3>
            <p className="text-sm text-gray-400 mt-1">Turismo, SUV, 4x4</p>
          </div>
        </button>

        {/* Opción MOTO */}
        <button 
          onClick={() => selectVehicle('motorcycle')}
          disabled={loading}
          className="group relative flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-blue-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-14 w-14 bg-orange-50 text-3xl flex items-center justify-center rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
            🏍️
          </div>
          <div className="ml-5 text-left">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Moto</h3>
            <p className="text-sm text-gray-400 mt-1">Cualquier cilindrada</p>
          </div>
        </button>

         {/* Opción FURGONETA */}
         <button 
          onClick={() => selectVehicle('van')}
          disabled={loading}
          className="group relative flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-blue-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-14 w-14 bg-green-50 text-3xl flex items-center justify-center rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
            🚐
          </div>
          <div className="ml-5 text-left">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">Furgoneta</h3>
            <p className="text-sm text-gray-400 mt-1">Profesional o personal</p>
          </div>
        </button>

      </div>
      
      {loading && (
        <p className="mt-8 text-gray-400 text-sm animate-pulse">Guardando tu elección...</p>
      )}

    </div>
  );
}
