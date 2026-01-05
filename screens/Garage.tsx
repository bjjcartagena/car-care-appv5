import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const Garage: React.FC = () => {
    const navigate = useNavigate();
    const [garage, setGarage] = useState<any[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const garageStr = localStorage.getItem('autominder_garage');
        const storedActiveId = localStorage.getItem('autominder_active_id');
        
        if (garageStr) {
            setGarage(JSON.parse(garageStr));
        }
        if (storedActiveId) {
            setActiveId(storedActiveId);
        }
    }, []);

    const handleSelectVehicle = (id: string) => {
        localStorage.setItem('autominder_active_id', id);
        setActiveId(id);
        // Add a small delay for visual feedback before navigation
        setTimeout(() => {
            navigate('/dashboard');
        }, 150);
    };

    const handleAddVehicle = () => {
        navigate('/');
    };

    const iconMap: any = {
        'car': 'directions_car',
        'moto': 'two_wheeler'
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-text-light antialiased transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-[#f0f5f1] dark:border-[#2a3c30]">
                <div className="max-w-[960px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                         <span className="material-symbols-outlined text-text-muted hover:text-text-main dark:hover:text-white transition-colors">arrow_back</span>
                        <h1 className="text-xl font-bold tracking-tight">Mi Garaje</h1>
                    </div>
                    <div className="flex gap-2">
                        <DarkModeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[640px] mx-auto px-4 md:px-6 py-8 pb-24">
                
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-2xl font-black tracking-tight">Tus Vehículos</h2>
                        <span className="text-sm text-text-muted dark:text-text-muted-dark font-medium">{garage.length} vehículos</span>
                    </div>

                    <div className="grid gap-4">
                        {garage.map((vehicle) => {
                            const isActive = vehicle.id === activeId;
                            return (
                                <div 
                                    key={vehicle.id} 
                                    onClick={() => handleSelectVehicle(vehicle.id)}
                                    className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isActive ? 'bg-primary/5 border-primary shadow-glow' : 'bg-card-light dark:bg-card-dark border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm'}`}
                                >
                                    {/* Icon */}
                                    <div className={`h-14 w-14 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                        <span className="material-symbols-outlined text-2xl">{iconMap[vehicle.type] || 'directions_car'}</span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <h3 className={`text-lg font-bold truncate ${isActive ? 'text-primary dark:text-primary' : 'text-text-main dark:text-white'}`}>{vehicle.make}</h3>
                                            {isActive && (
                                                <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                    Activo
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-text-muted dark:text-text-muted-dark">{vehicle.model}</p>
                                        <p className="text-xs text-text-muted/80 dark:text-text-muted-dark/80 mt-1">{vehicle.mileage} km</p>
                                    </div>
                                    
                                    {/* Selection Indicator */}
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-primary bg-primary text-black' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {isActive && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add New Card */}
                        <button 
                            onClick={handleAddVehicle}
                            className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary group-hover:text-black flex items-center justify-center text-gray-400 transition-colors">
                                <span className="material-symbols-outlined text-2xl">add</span>
                            </div>
                            <span className="font-bold text-text-muted group-hover:text-primary transition-colors">Añadir otro vehículo</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Garage;