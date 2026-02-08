import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const VehicleTypeSelection: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [hasVehicles, setHasVehicles] = useState(false);

    useEffect(() => {
        const checkData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (!user) return;

            const { count } = await supabase
                .from('vehicles')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            if (count !== null && count > 0) setHasVehicles(true);
        };
        checkData();
    }, []);

    // ESTA ES LA FUNCIÓN QUE CAMBIA: Ahora navega en lugar de guardar
    const selectType = (type: string) => {
        navigate('/setup-profile', { state: { vehicleType: type } });
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-slate-900">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🚗</span>
                    <h2 className="text-lg font-bold">Car Care App</h2>
                </div>
                <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} className="text-red-600 font-bold text-sm">
                    Salir
                </button>
            </header>

            {/* Contenido */}
            <div className="flex flex-col items-center justify-center flex-grow p-4">
                <div className="w-full max-w-md text-center mb-8">
                    <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">Paso 1 de 2</span>
                    <h1 className="text-4xl font-black mt-2 mb-2">Elige tu vehículo</h1>
                    <p className="text-gray-500">¿Qué vas a añadir a tu garaje?</p>
                </div>

                <div className="grid gap-4 w-full max-w-md">
                    {/* Botón Coche */}
                    <button onClick={() => selectType('car')} className="flex items-center p-6 border-2 rounded-2xl hover:border-blue-600 hover:shadow-lg transition bg-white text-left group">
                        <span className="text-4xl mr-4 group-hover:scale-110 transition">🚗</span>
                        <div>
                            <h3 className="font-bold text-xl">Coche</h3>
                            <p className="text-sm text-gray-500">Turismo, SUV, 4x4</p>
                        </div>
                    </button>

                    {/* Botón Moto */}
                    <button onClick={() => selectType('motorcycle')} className="flex items-center p-6 border-2 rounded-2xl hover:border-blue-600 hover:shadow-lg transition bg-white text-left group">
                        <span className="text-4xl mr-4 group-hover:scale-110 transition">🏍️</span>
                        <div>
                            <h3 className="font-bold text-xl">Moto</h3>
                            <p className="text-sm text-gray-500">Cualquier cilindrada</p>
                        </div>
                    </button>

                     {/* Botón Furgoneta */}
                     <button onClick={() => selectType('van')} className="flex items-center p-6 border-2 rounded-2xl hover:border-blue-600 hover:shadow-lg transition bg-white text-left group">
                        <span className="text-4xl mr-4 group-hover:scale-110 transition">🚐</span>
                        <div>
                            <h3 className="font-bold text-xl">Furgoneta</h3>
                            <p className="text-sm text-gray-500">Profesional o personal</p>
                        </div>
                    </button>
                </div>
                
                {hasVehicles && (
                    <button onClick={() => navigate('/dashboard')} className="mt-8 text-blue-600 font-bold hover:underline">
                        Ya tengo vehículos, ir al Garaje &rarr;
                    </button>
                )}
            </div>
        </div>
    );
};

export default VehicleTypeSelection;
