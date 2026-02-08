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

            if (count !== null && count > 0) {
                setHasVehicles(true);
            }
        };
        checkData();
    }, []);

    const selectType = (type: string) => {
        // Navegamos al PASO 2 (VehicleProfileSetup) enviando el tipo
        navigate('/setup-profile', { state: { vehicleType: type } });
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-slate-900">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 lg:px-10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-800 dark:text-green-300">
                        <span className="text-xl">🚗</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Car Care App</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} className="flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                        <span className="material-symbols-outlined">🚪</span>
                    </button>
                </div>
            </header>

            {/* Main Layout Container */}
            <div className="layout-container flex h-full grow flex-col items-center justify-start pt-8 pb-12 px-4 sm:px-6">
                <div className="layout-content-container flex flex-col w-full max-w-[640px] flex-1 gap-8">

                    {/* Progress Bar Section */}
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex gap-6 justify-between items-center">
                            <p className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wide">
                                {hasVehicles ? 'Nuevo Vehículo' : 'PASO 1 DE 4'}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Configuración</p>
                        </div>
                        <div className="rounded-full bg-slate-200 dark:bg-slate-800 h-2 w-full overflow-hidden">
                            {/* Barra al 25% para el paso 1 */}
                            <div className="h-full rounded-full bg-blue-600" style={{ width: '25%' }}></div>
                        </div>
                    </div>

                    {/* Page Heading: "Vamos a prepararlo todo" */}
                    <div className="flex flex-col gap-3 text-center sm:text-left mt-4">
                        <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                            {hasVehicles ? 'Añadir otro vehículo.' : 'Vamos a prepararlo todo.'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                            Selecciona tu tipo de vehículo para personalizar el programa de mantenimiento y los recordatorios.
                        </p>
                    </div>

                    {/* Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">

                        {/* Garage Card (Solo si ya hay vehículos) */}
                        {hasVehicles && (
                            <button onClick={() => navigate('/dashboard')} className="col-span-1 sm:col-span-2 group relative flex flex-row items-center gap-6 rounded-xl border-2 border-blue-200 bg-blue-50 p-6 transition-all duration-200 hover:border-blue-600 hover:bg-blue-100 hover:shadow-xl text-left">
                                <div className="flex items-center justify-center h-14 w-14 shrink-0 rounded-full bg-blue-600 text-white group-hover:scale-110 transition-transform duration-200 shadow-lg">
                                    <span className="text-3xl">🏠</span>
                                </div>
                                <div className="flex flex-col gap-1 min-w-0">
                                    <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Ir a Mi Garaje</h2>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Ver mis vehículos guardados</p>
                                </div>
                            </button>
                        )}

                        {/* Tarjeta COCHE */}
                        <button onClick={() => selectType('car')} className="group relative flex flex-col items-center sm:items-start gap-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 transition-all duration-200 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-100 text-left">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                                <span className="text-4xl">🚗</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center sm:items-start">
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Coche</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Turismo, SUV, Furgoneta, etc.</p>
                            </div>
                        </button>

                        {/* Tarjeta MOTO */}
                        <button onClick={() => selectType('motorcycle')} className="group relative flex flex-col items-center sm:items-start gap-6 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 transition-all duration-200 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-100 text-left">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                                <span className="text-4xl">🏍️</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center sm:items-start">
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Moto</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Deportiva, Custom, Scooter</p>
                            </div>
                        </button>
                    </div>

                    {/* Footer Text */}
                    <div className="mt-auto pt-6 text-center">
                        <p className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-500 text-sm font-medium">
                            <span>⏱️</span>
                            Configuración en menos de 2 minutos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleTypeSelection;
