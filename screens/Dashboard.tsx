import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

// Mock DB for manufacturer logic
const getMaintenanceTasks = (type: string, make: string, km: number) => {
    // Common items
    const tasks = [];
    
    // Logic specific to type
    if (type === 'moto') {
        tasks.push({
            title: "Engrase de Cadena",
            icon: "link",
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-900/20",
            priorityTag: "Recurrente",
            priorityColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            subtitle: "Cada 500-1000 km",
            remaining: "350 KM"
        });
        tasks.push({
            title: "Presión Neumáticos",
            icon: "tire_repair",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            priorityTag: "Seguridad",
            priorityColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            subtitle: "Revisar en frío semanalmente",
            remaining: "2 Días"
        });
        
        if (make === 'Ducati') {
            tasks.push({
                title: "Desmo Service (Válvulas)",
                icon: "settings_suggest",
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-900/20",
                priorityTag: "Crítico",
                priorityColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                subtitle: "Reglaje desmodrómico",
                remaining: "4.500 KM"
            });
        } else if (make === 'BMW Motorrad') {
             tasks.push({
                title: "Aceite Cardán",
                icon: "settings_applications",
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-50 dark:bg-purple-900/20",
                priorityTag: "Mecánica",
                priorityColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                subtitle: "Revisión eje transmisión",
                remaining: "8.000 KM"
            });
        }
    } else {
        // CARS
        tasks.push({
            title: "Aceite y Filtro",
            icon: "oil_barrel",
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-900/20",
            priorityTag: "Pronto",
            priorityColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            subtitle: "Intervalo recomendado anual",
            remaining: "2.400 KM"
        });

        // Brand specific
        if (['Peugeot', 'Citroën', 'DS Automobiles', 'Opel'].includes(make)) {
             tasks.push({
                title: "Rellenar AdBlue",
                icon: "local_gas_station",
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-900/20",
                priorityTag: "Urgente",
                priorityColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                subtitle: "Sistema BlueHDi",
                remaining: "1.200 KM"
            });
            tasks.push({
                title: "Kit Distribución",
                icon: "settings",
                color: "text-gray-600 dark:text-gray-400",
                bg: "bg-gray-100 dark:bg-gray-800",
                priorityTag: "Largo Plazo",
                priorityColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                subtitle: "Revisar correa húmeda",
                remaining: "40.000 KM"
            });
        }
        
        if (['Toyota', 'Lexus', 'Honda'].includes(make)) {
            tasks.push({
                title: "Chequeo Sistema Híbrido",
                icon: "battery_charging_full",
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-50 dark:bg-green-900/20",
                priorityTag: "Garantía",
                priorityColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                subtitle: "Salud de batería HV",
                remaining: "5.000 KM"
            });
        }
        
        if (['BMW', 'Mini'].includes(make)) {
             tasks.push({
                title: "Líquido de Frenos",
                icon: "water_drop",
                color: "text-yellow-600 dark:text-yellow-400",
                bg: "bg-yellow-50 dark:bg-yellow-900/20",
                priorityTag: "Seguridad",
                priorityColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                subtitle: "Cambio cada 2 años",
                remaining: "3 Meses"
            });
        }
    }
    
    // Generic filler if list is short
    if (tasks.length < 3) {
        tasks.push({
            title: "Filtro Habitáculo",
            icon: "air",
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-900/20",
            priorityTag: "Salud",
            priorityColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            subtitle: "Aire limpio",
            remaining: "8.000 KM"
        });
    }

    return tasks;
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<any>({
        make: "Peugeot",
        model: "3008",
        mileage: "82.400",
        type: "car"
    });
    const [tasks, setTasks] = useState<any[]>([]);
    const [itvDate, setItvDate] = useState<string>('');
    const [daysToItv, setDaysToItv] = useState<number | null>(null);
    const [garage, setGarage] = useState<any[]>([]);
    const [showVehicleMenu, setShowVehicleMenu] = useState(false);

    useEffect(() => {
        // Migration logic: check if old single object exists and new garage doesn't
        const oldVehicle = localStorage.getItem('autominder_vehicle');
        const storedGarage = localStorage.getItem('autominder_garage');
        
        if (oldVehicle && !storedGarage) {
            // Migrate
            const parsedOld = JSON.parse(oldVehicle);
            parsedOld.id = Date.now().toString();
            parsedOld.dateAdded = new Date().toISOString();
            
            const newGarage = [parsedOld];
            localStorage.setItem('autominder_garage', JSON.stringify(newGarage));
            localStorage.setItem('autominder_active_id', parsedOld.id);
            localStorage.removeItem('autominder_vehicle'); // Clean up
        }

        // Load active vehicle from garage
        const garageStr = localStorage.getItem('autominder_garage');
        const activeId = localStorage.getItem('autominder_active_id');
        
        if (garageStr) {
            const parsedGarage = JSON.parse(garageStr);
            setGarage(parsedGarage);
            
            if (parsedGarage.length > 0) {
                let activeVehicle = parsedGarage.find((v: any) => v.id === activeId);
                // Fallback if active ID is invalid but garage has items
                if (!activeVehicle) {
                    activeVehicle = parsedGarage[0];
                    localStorage.setItem('autominder_active_id', activeVehicle.id);
                }
                
                setVehicle(activeVehicle);
                setTasks(getMaintenanceTasks(activeVehicle.type, activeVehicle.make, parseInt(activeVehicle.mileage)));
            } else {
                // Garage exists but empty? Go to setup
                navigate('/');
            }
        } else {
            // No garage, go to setup
             navigate('/');
        }

        // Load ITV Date
        const storedItv = localStorage.getItem('autominder_itv');
        if (storedItv) {
            setItvDate(storedItv);
            calculateDays(storedItv);
        }
    }, [navigate]);

    const saveItvDate = (date: string) => {
        setItvDate(date);
        localStorage.setItem('autominder_itv', date);
        calculateDays(date);
    };

    const calculateDays = (dateStr: string) => {
        if (!dateStr) return;
        // Format YYYY-MM
        const [year, month] = dateStr.split('-').map(Number);
        // Calculate target as the LAST day of that month.
        // new Date(year, month, 0) gives the last day of the 'month' (where month is 1-12)
        const target = new Date(year, month, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysToItv(diffDays);
    };

    const switchVehicle = (v: any) => {
        setVehicle(v);
        setTasks(getMaintenanceTasks(v.type, v.make, parseInt(v.mileage)));
        localStorage.setItem('autominder_active_id', v.id);
        setShowVehicleMenu(false);
    };

    const iconMap: any = {
        'car': 'directions_car',
        'moto': 'two_wheeler'
    };

    const formatItvDisplay = (dateStr: string) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split('-').map(Number);
        // Create a date object for display (set day to 1 to avoid month rollover issues)
        const date = new Date(year, month - 1, 1);
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-text-light antialiased transition-colors duration-200">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-[#f0f5f1] dark:border-[#2a3c30]">
                <div className="max-w-[960px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">directions_car</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Car Care App</h1>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-main dark:text-white">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <Link to="/garage" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-main dark:text-white" title="Mi Garaje">
                            <span className="material-symbols-outlined">garage_home</span>
                        </Link>
                        <DarkModeToggle />
                    </div>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-1 w-full max-w-[960px] mx-auto px-4 md:px-6 py-6 pb-24">
                {/* Greeting & Vehicle Selector */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 relative z-20">
                    <div className="relative">
                        <p className="text-text-muted dark:text-text-muted-dark text-sm font-medium mb-1">Buenos días, Alex</p>
                        
                        {/* Vehicle Dropdown Trigger */}
                        <div onClick={() => setShowVehicleMenu(!showVehicleMenu)} className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity select-none">
                            <span className="material-symbols-outlined text-3xl text-primary">{iconMap[vehicle.type] || 'directions_car'}</span>
                            <h2 className="text-3xl font-extrabold tracking-tight capitalize">{vehicle.make} {vehicle.model}</h2>
                            <span className={`material-symbols-outlined text-text-muted group-hover:text-primary transition-transform duration-200 ${showVehicleMenu ? 'rotate-180' : ''}`}>expand_more</span>
                        </div>

                        {/* Dropdown Menu */}
                        {showVehicleMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowVehicleMenu(false)}></div>
                                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#1a2c20] rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                                    <div className="max-h-64 overflow-y-auto py-2">
                                        <div className="px-4 py-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Mis Vehículos</div>
                                        {garage.map((v) => (
                                            <button 
                                                key={v.id}
                                                onClick={() => switchVehicle(v)}
                                                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${v.id === vehicle.id ? 'bg-primary/5 text-primary' : 'text-text-main dark:text-white'}`}
                                            >
                                                <span className="material-symbols-outlined text-xl">{iconMap[v.type] || 'directions_car'}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate">{v.make} {v.model}</p>
                                                    <p className="text-xs text-text-muted dark:text-text-muted-dark">{v.mileage} KM</p>
                                                </div>
                                                {v.id === vehicle.id && <span className="material-symbols-outlined text-lg">check</span>}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Linea fina y Añadir otro vehiculo */}
                                    <div className="border-t border-gray-100 dark:border-gray-700 p-2 bg-gray-50/50 dark:bg-white/5">
                                        <button 
                                            onClick={() => navigate('/')} 
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 hover:text-primary hover:shadow-sm transition-all"
                                        >
                                            <div className="h-6 w-6 rounded-full border border-current flex items-center justify-center">
                                                <span className="material-symbols-outlined text-sm">add</span>
                                            </div>
                                            Añadir otro vehículo
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="inline-flex items-center px-3 py-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full shadow-sm">
                        <span className="material-symbols-outlined text-primary text-sm mr-2">speed</span>
                        <span className="font-bold text-sm">{vehicle.mileage} KM</span>
                    </div>
                </div>
                
                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                    {/* Health Dashboard Card (Left/Top) */}
                    <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
                        {/* Health Status Card */}
                        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                            {/* Abstract Background Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                                {/* Circular Progress */}
                                <div className="relative h-48 w-48 shrink-0">
                                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                        <circle className="text-gray-100 dark:text-white/5" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeWidth="8"></circle>
                                        <circle className="text-primary transition-all duration-1000 ease-out" cx="50" cy="50" fill="transparent" r="42" stroke="currentColor" strokeDasharray="264" strokeDashoffset="40" strokeLinecap="round" strokeWidth="8"></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-4xl font-extrabold text-text-main dark:text-white">85%</span>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">Salud</span>
                                    </div>
                                </div>
                                {/* Text Content */}
                                <div className="flex flex-col text-center sm:text-left">
                                    <h3 className="text-xl font-bold mb-2">Todo en orden</h3>
                                    <p className="text-text-muted dark:text-text-muted-dark mb-6 leading-relaxed">
                                        Hemos cargado el plan oficial de {vehicle.make}. Tienes tareas pendientes para mantener la garantía y fiabilidad.
                                    </p>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                                            <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                                            General OK
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Upcoming Tasks Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Mantenimiento {vehicle.make}</h3>
                                <button className="text-sm font-bold text-primary hover:underline">Ver plan completo</button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {tasks.map((task, idx) => (
                                    <div key={idx} onClick={() => navigate('/task-detail')} className="group bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-all cursor-pointer flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-lg ${task.bg} flex items-center justify-center ${task.color} shrink-0`}>
                                            <span className="material-symbols-outlined">{task.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-text-main dark:text-white truncate">{task.title}</h4>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${task.priorityColor}`}>
                                                    {task.priorityTag}
                                                </span>
                                            </div>
                                            <p className="text-sm text-text-muted dark:text-text-muted-dark truncate mt-0.5">{task.subtitle}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-text-main dark:text-white">{task.remaining}</p>
                                            <p className="text-xs text-text-muted dark:text-text-muted-dark">Estimado</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Sidebar / Quick Actions */}
                    <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
                        {/* ITV Module - UPDATED: Month Only */}
                        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-white/5 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-text-main dark:text-white">Próxima ITV</h3>
                                    <p className="text-xs text-text-muted dark:text-text-muted-dark">Inspección Técnica</p>
                                </div>
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${daysToItv !== null && daysToItv < 30 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-primary/20 text-primary'}`}>
                                    <span className="material-symbols-outlined">event_available</span>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                {itvDate ? (
                                    <div className={`text-center py-2 bg-background-light dark:bg-white/5 rounded-xl border border-dashed ${daysToItv !== null && daysToItv < 0 ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                                        {daysToItv !== null && daysToItv < 0 ? (
                                            <span className="text-3xl font-extrabold text-red-600 dark:text-red-400 block tracking-wider">
                                                CADUCADA
                                            </span>
                                        ) : (
                                            <span className="text-3xl font-extrabold text-text-main dark:text-white block">
                                                {daysToItv} <span className="text-sm font-normal text-text-muted">días</span>
                                            </span>
                                        )}
                                        <span className={`text-xs font-semibold uppercase tracking-wide capitalize ${daysToItv !== null && daysToItv < 0 ? 'text-red-500/80 dark:text-red-400/70' : 'text-text-muted'}`}>
                                            {formatItvDisplay(itvDate)}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-background-light dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-text-muted">No has configurado fecha</p>
                                    </div>
                                )}
                            </div>
                            
                            <label className="block w-full">
                                <span className="text-xs font-bold text-text-muted dark:text-text-muted-dark mb-1 block">Vencimiento (Mes/Año)</span>
                                <input 
                                    type="month" 
                                    value={itvDate} 
                                    onChange={(e) => saveItvDate(e.target.value)}
                                    className="block w-full text-sm text-text-main dark:text-white bg-white dark:bg-[#15231b] border border-gray-200 dark:border-[#2a3c30] rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                />
                            </label>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-white/5">
                            <div className="bg-center bg-no-repeat bg-cover rounded-xl w-full h-40 mb-4 relative overflow-hidden" data-alt="Vehicle parked" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQX6fPG-gY61lh2q_jUOQkmgP63pbyxCuUChSAbDb9Ueehinw9DTMmc0IAuzYu-CxU6UeNdhJ9K248Z9VKg1EpRjjIjFPShibcB8vZXVoV6zihxvmzcStw8irdBZ8FPLpyNG9LqdIR0PKMcVCE3Z50ltGdZNBegbykzYKooHbRXbKhSvWsm9CIkNXZOvoa4L3UbG4Gr3kTnf_oujACxuWslzHeYi5-ssvfxqrsazn7f61zERJcp3IG76hjCpWgD0oUHwfDMaD0PkXG")'}}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <p className="text-white text-xs font-medium">Sincronizado: hace 4h</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-background-light dark:bg-white/5 rounded-lg">
                                    <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Uso Medio</p>
                                    <p className="text-lg font-bold">34 <span className="text-xs font-normal">km/día</span></p>
                                </div>
                                <div className="p-3 bg-background-light dark:bg-white/5 rounded-lg">
                                    <p className="text-xs text-text-muted dark:text-text-muted-dark mb-1">Próx. Taller</p>
                                    <p className="text-lg font-bold">15 Mar</p>
                                </div>
                            </div>
                        </div>
                        {/* Call to Action Card (Desktop view prominent action) */}
                        <div className="bg-gradient-to-br from-[#102216] to-[#1a3c25] rounded-2xl p-6 shadow-lg text-white relative overflow-hidden hidden md:flex flex-col">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-4 border border-primary/20">
                                <span className="material-symbols-outlined">speed</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Actualizar Odómetro</h3>
                            <p className="text-gray-300 text-sm mb-6">Mantener tu kilometraje actualizado asegura que nuestras predicciones sean precisas.</p>
                            <button className="w-full h-12 bg-primary hover:bg-primary-hover text-[#111813] font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-glow">
                                <span>Actualizar Ahora</span>
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            {/* Floating Action Button (FAB) */}
            <div className="fixed bottom-6 right-6 z-50 md:hidden">
                <button className="flex items-center justify-center gap-2 h-14 pl-5 pr-6 bg-primary hover:bg-primary-hover text-[#111813] rounded-full shadow-lg shadow-primary/30 transition-transform active:scale-95">
                    <span className="material-symbols-outlined text-2xl">add</span>
                    <span className="font-bold text-base">KM</span>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;