import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Ahora pedimos TODOS los datos: marca, modelo, km...
        const { data } = await supabase
            .from('vehicles')
            .select('*')
            .eq('user_id', user.id);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Cargando garaje...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <span className="text-2xl">🔧</span>
            <h1 className="text-lg font-bold text-gray-900">Mi Garaje</h1>
        </div>
        <button onClick={signOut} className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
            Salir
        </button>
      </div>

      {/* Contenido */}
      <div className="p-6 max-w-lg mx-auto">
        {vehicles.length === 0 ? (
            <div className="text-center py-20">
                <p className="text-gray-400 mb-4">El garaje está vacío.</p>
                <button onClick={() => window.location.href = '/'} className="text-blue-600 font-bold hover:underline">Añadir vehículo</button>
            </div>
        ) : (
            <div className="space-y-6">
                {vehicles.map((v) => (
                    <div key={v.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md mb-2 uppercase tracking-wide">
                                    {v.type === 'motorcycle' ? 'Moto' : 'Turismo'}
                                </span>
                                <h2 className="text-2xl font-black text-gray-900 leading-tight">
                                    {v.make} {v.model}
                                </h2>
                                <p className="text-gray-500 font-medium text-sm mt-1">
                                    {v.odometer_km ? `${v.odometer_km.toLocaleString()} km` : 'Sin kilometraje'}
                                </p>
                            </div>
                            <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">
                                {v.type === 'motorcycle' ? '🏍️' : '🚗'}
                            </div>
                        </div>

                        {/* Botones de acción rápida (Decorativos por ahora) */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50 text-orange-700 font-bold text-sm hover:bg-orange-100 transition">
                                <span>🛠️ Mantenimiento</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm hover:bg-blue-100 transition">
                                <span>📅 Citas ITV</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
