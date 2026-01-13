import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const TASK_TITLES: Record<string, string> = {
    oil: "Aceite de Motor",
    filters_car: "Filtros",
    tyres_car: "Neumáticos",
    timing_belt: "Kit Distribución",
    adblue: "AdBlue",
    brake_fluid: "Líquido de Frenos",
    tire_front: "Neumático Delantero",
    tire_rear: "Neumático Trasero",
    brake_fluid_moto: "Líquido de Frenos",
    brake_pads_moto: "Pastillas de Freno",
    battery_moto: "Batería",
    engine_oil_moto: "Aceite de Motor",
    filters_moto: "Filtros",
    spark_plugs: "Bujías",
    coolant_moto: "Refrigerante",
    desmo: "Desmo Service",
    chain_kit: "Kit de Arrastre",
    chain: "Engrase Cadena",
    fork_oil: "Aceite Horquilla",
    clutch_moto: "Embrague"
};

const History: React.FC = () => {
    const navigate = useNavigate();
    const [historyItems, setHistoryItems] = useState<any[]>([]);
    const [vehicle, setVehicle] = useState<any>(null);

    useEffect(() => {
        const garageStr = localStorage.getItem('autominder_garage');
        const activeId = localStorage.getItem('autominder_active_id');
        const historyStr = localStorage.getItem('autominder_history');
        
        if (garageStr && activeId) {
            const garage = JSON.parse(garageStr);
            const activeVehicle = garage.find((v: any) => v.id === activeId);
            setVehicle(activeVehicle);

            if (historyStr && activeVehicle) {
                const fullHistory = JSON.parse(historyStr);
                const vehicleHistory = fullHistory[activeId] || {};
                
                // Flatten history structure
                const items: any[] = [];
                Object.entries(vehicleHistory).forEach(([taskId, records]: [string, any]) => {
                    const recordList = Array.isArray(records) ? records : [records];
                    
                    recordList.forEach((record: any) => {
                        items.push({
                            taskId,
                            title: TASK_TITLES[taskId] || "Mantenimiento",
                            date: record.date,
                            km: record.km,
                            type: record.type,
                            subType: record.subType
                        });
                    });
                });

                // Sort by date descending
                items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setHistoryItems(items);
            }
        }
    }, []);

    const iconMap: any = { 'car': 'directions_car', 'moto': 'two_wheeler' };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark antialiased transition-colors duration-200">
             {/* Header */}
             <header className="sticky top-0 z-40 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-[#f0f5f1] dark:border-[#2a3c30]">
                <div className="max-w-[960px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
                        <h1 className="text-xl font-bold tracking-tight">Historial Completo</h1>
                    </div>
                    <div className="flex gap-2">
                        <DarkModeToggle />
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 py-8 pb-24">
                
                {/* Vehicle Header */}
                {vehicle && (
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">{iconMap[vehicle.type]}</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Vehículo</p>
                            <h2 className="text-2xl font-black capitalize">{vehicle.make} {vehicle.model}</h2>
                        </div>
                    </div>
                )}

                {/* Timeline */}
                {historyItems.length === 0 ? (
                    <div className="text-center py-20 opacity-60">
                         <div className="h-24 w-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-5xl text-gray-400">history_toggle_off</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Sin registros aún</h3>
                        <p className="text-sm">Completa tareas en el panel para verlas aquí.</p>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 md:ml-6 space-y-10">
                        {historyItems.map((item, index) => (
                            <div key={index} className="relative pl-8 md:pl-10">
                                {/* Dot */}
                                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-[#0A0D14] bg-primary shadow-sm"></div>
                                
                                {/* Content */}
                                <div className="bg-card-light dark:bg-card-dark rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary/30 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-text-main dark:text-white">{item.title}</span>
                                            {item.subType && (
                                                <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium">
                                                    {item.subType}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-50 dark:bg-black/20 px-2 py-1 rounded">
                                            {new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 text-sm text-text-muted dark:text-text-muted-dark">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-lg">speed</span>
                                            <span className="font-mono font-medium">{parseInt(item.km).toLocaleString('es-ES')} km</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                             <span className="material-symbols-outlined text-lg">
                                                {item.taskId.includes('oil') ? 'water_drop' : 'build'}
                                             </span>
                                            <span className="capitalize">{item.type === 'refill' ? 'Relleno' : 'Servicio'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default History;
