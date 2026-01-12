import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

// Dynamic content helper
const getTaskContent = (taskTitle: string) => {
    const titleLower = taskTitle?.toLowerCase() || '';

    // --- FILTROS (Generic) ---
    if (titleLower.includes('filtros')) {
        return {
            description: "Mantener los filtros limpios es vital. El de aceite protege el motor, el de aire optimiza la combustión y el de habitáculo cuida tu salud. Indica qué filtro has cambiado en el registro.",
            image: "https://images.unsplash.com/photo-1627483262268-9c96d8a36896?q=80&w=1000&auto=format&fit=crop",
            interval: "Variable",
            intervalSub: "Según el tipo",
            cost: "10€ - 50€",
            difficulty: "Baja/Media"
        };
    } 
    // --- ACEITE (Standalone) ---
    else if (titleLower.includes('aceite') && !titleLower.includes('filtro') && !titleLower.includes('cambios') && !titleLower.includes('cardán')) {
        return {
            description: "El aceite es la sangre de tu motor. Cambiarlo a tiempo lubrica las partes móviles, reduce el calor y elimina impurezas. Un aceite viejo pierde propiedades, aumentando el desgaste y el riesgo de averías graves.",
            image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000&auto=format&fit=crop",
            interval: "Cada 1 Año",
            intervalSub: "o 15.000 km",
            cost: "40€ - 90€",
            difficulty: "Media"
        };
    }
    // --- NEUMÁTICOS (General / Moto Split) ---
    else if (titleLower.includes('neumático delantero')) {
        return {
            description: "El neumático delantero es crítico para la dirección y la frenada (soporta el 70% de la fuerza al frenar). Vigila que no tenga escalones en el desgaste ni grietas. Presión incorrecta = Caída probable.",
            image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop", // Moto wheel close up
            interval: "15.000 km",
            intervalSub: "o cada 4-5 años",
            cost: "100€ - 200€",
            difficulty: "Alta"
        };
    }
    else if (titleLower.includes('neumático trasero')) {
        return {
            description: "El neumático trasero transmite la potencia al suelo. Se desgasta más rápido por la tracción, especialmente en el centro (se 'cuadra'). Un neumático cuadrado hace la moto torpe en curvas.",
            image: "https://images.unsplash.com/photo-1599407338006-0b82260f781a?q=80&w=1000&auto=format&fit=crop",
            interval: "8.000 - 12.000 km",
            intervalSub: "o cada 4-5 años",
            cost: "120€ - 250€",
            difficulty: "Alta"
        };
    }
    else if (titleLower.includes('neumáticos') || titleLower.includes('ruedas')) {
        return {
            description: "Los neumáticos son el único punto de contacto con la carretera. Una presión incorrecta aumenta el consumo y reduce la seguridad. El dibujo debe tener al menos 1.6mm para evitar aquaplaning.",
            image: "https://images.unsplash.com/photo-1578844251758-2f71da64522f?q=80&w=1000&auto=format&fit=crop",
            interval: "Semanal (Presión)",
            intervalSub: "Cambio: 40.000 km",
            cost: "80€ - 200€/ud",
            difficulty: "Alta"
        };
    }
    // --- OTHER ---
    else if (titleLower.includes('caja cambios') || titleLower.includes('caja de cambios')) {
         return {
            description: "El aceite de la caja de cambios asegura que las marchas entren suaves y protege los engranajes del desgaste. En motos con embrague bañado en aceite, suele ser el mismo que el del motor, pero en otros modelos es independiente.",
            image: "https://images.unsplash.com/photo-1598555849883-9e90c8b3684a?q=80&w=1000&auto=format&fit=crop",
            interval: "Cada 6.000 km",
            intervalSub: "Revisar o cambiar",
            cost: "15€ - 40€",
            difficulty: "Media"
        };
    } else if (titleLower.includes('embrague')) {
        return {
            description: "Un embrague mal ajustado puede patinar (perdiendo potencia) o no desacoplar bien (dificultando el cambio y encontrando el punto muerto). Ajustar la tensión del cable y la holgura de la maneta es vital.",
            image: "https://images.unsplash.com/photo-1558981000-f294a6ed32b2?q=80&w=1000&auto=format&fit=crop",
            interval: "Cada 6.000 km",
            intervalSub: "Revisar holgura",
            cost: "0€ - 30€",
            difficulty: "Baja"
        };
    } else if (titleLower.includes('distribución')) {
        return {
            description: "La rotura de la correa de distribución es una de las averías más caras, pudiendo destrozar el motor. Es vital cambiarla antes del kilometraje recomendado por el fabricante para evitar daños catastróficos.",
            image: "https://images.unsplash.com/photo-1597762696655-6dc22744857b?q=80&w=1000&auto=format&fit=crop",
            interval: "90.000 - 120.000 km",
            intervalSub: "o cada 5-10 años",
            cost: "300€ - 600€",
            difficulty: "Alta"
        };
    } else if (titleLower.includes('adblue')) {
        return {
            description: "El AdBlue reduce las emisiones nocivas. Si el depósito se vacía, el coche no arrancará por normativa legal. Mantén el nivel adecuado para evitar problemas en el sistema anticontaminación.",
            image: "https://images.unsplash.com/photo-1626131435278-65476a6d6333?q=80&w=1000&auto=format&fit=crop",
            interval: "Variable",
            intervalSub: "Según consumo",
            cost: "15€ - 30€",
            difficulty: "Baja"
        };
    } else if (titleLower.includes('cadena')) {
        return {
            description: "Una cadena seca o sucia se desgasta rápidamente y pierde potencia. Engrasarla cada 500-1000km prolonga la vida del kit de arrastre y mejora la suavidad de la conducción.",
            image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop",
            interval: "500 km",
            intervalSub: "Limpiar y engrasar",
            cost: "5€ - 15€",
            difficulty: "Baja"
        };
    } else if (titleLower.includes('cardán') || titleLower.includes('cardan')) {
        return {
            description: "El cardán es un sistema de transmisión muy robusto y limpio, pero requiere cambios periódicos de valvolina para evitar desgastes internos. Revisa posibles fugas en los retenes.",
            image: "https://images.unsplash.com/photo-1558980394-0a06c46e60e7?q=80&w=1000&auto=format&fit=crop",
            interval: "20.000 km",
            intervalSub: "Cambiar aceite (Valvolina)",
            cost: "20€ - 40€",
            difficulty: "Baja"
        };
    } else if (titleLower.includes('correa secundaria') || (titleLower.includes('correa') && !titleLower.includes('distribución'))) {
        return {
            description: "La correa de transmisión secundaria es silenciosa y no requiere engrase, pero debes vigilar que no tenga grietas, dientes rotos o piedras incrustadas. Su tensión es crítica para la vida de los rodamientos.",
            image: "https://images.unsplash.com/photo-1558981806-ec527fa84c3d?q=80&w=1000&auto=format&fit=crop",
            interval: "10.000 km",
            intervalSub: "Revisar tensión",
            cost: "0€ - 300€",
            difficulty: "Media"
        };
    }
    
    // Default (Brake Fluid / Generic)
    return {
        description: "El mantenimiento preventivo ahorra dinero a largo plazo. Realizar esta tarea asegura que tu vehículo funcione correctamente y evita averías mayores.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQX6fPG-gY61lh2q_jUOQkmgP63pbyxCuUChSAbDb9Ueehinw9DTMmc0IAuzYu-CxU6UeNdhJ9K248Z9VKg1EpRjjIjFPShibcB8vZXVoV6zihxvmzcStw8irdBZ8FPLpyNG9LqdIR0PKMcVCE3Z50ltGdZNBegbykzYKooHbRXbKhSvWsm9CIkNXZOvoa4L3UbG4Gr3kTnf_oujACxuWslzHeYi5-ssvfxqrsazn7f61zERJcp3IG76hjCpWgD0oUHwfDMaD0PkXG",
        interval: "Consultar Manual",
        intervalSub: "Revisión periódica",
        cost: "Variable",
        difficulty: "Moderada"
    };
};

const TaskDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get state from navigation
    const { task, vehicle } = location.state || { 
        task: { id: "unknown", title: "Mantenimiento General", subtitle: "Revisión periódica" }, 
        vehicle: { id: "unknown", make: 'Mi Vehículo', model: '', mileage: '0' } 
    };

    const content = getTaskContent(task.title);
    
    // Logic for Filters
    const isFilterTask = task.title.toLowerCase().includes('filtros');
    const isAdBlue = task.title.toLowerCase().includes('adblue');
    
    // State for History Form
    const [historyData, setHistoryData] = useState({
        date: new Date().toISOString().split('T')[0], // Default to today
        km: vehicle.mileage || '',
        filterType: 'Aceite' // Default filter type
    });

    // State for Last Recorded History
    const [lastRecord, setLastRecord] = useState<any>(null);

    // Toast Notification State
    const [showToast, setShowToast] = useState(false);
    
    // Location State
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'found'>('idle');

    // Load last record on mount
    useEffect(() => {
        const storedHistory = localStorage.getItem('autominder_history');
        if (storedHistory) {
            const history = JSON.parse(storedHistory);
            if (history[vehicle.id] && history[vehicle.id][task.id]) {
                setLastRecord(history[vehicle.id][task.id]);
            }
        }
    }, [vehicle.id, task.id]);

    const handleSaveHistory = () => {
        if (!historyData.km || !historyData.date) return;

        // Get existing history
        const storedHistory = localStorage.getItem('autominder_history');
        const history = storedHistory ? JSON.parse(storedHistory) : {};

        // Structure: { [vehicleId]: { [taskId]: { date, km, subType } } }
        if (!history[vehicle.id]) {
            history[vehicle.id] = {};
        }

        history[vehicle.id][task.id] = {
            date: historyData.date,
            km: historyData.km,
            type: isAdBlue ? 'refill' : 'service',
            subType: isFilterTask ? historyData.filterType : undefined
        };

        // Save back
        localStorage.setItem('autominder_history', JSON.stringify(history));

        // Update vehicle mileage if new is higher
        const newKm = parseInt(historyData.km);
        const currentKm = parseInt(vehicle.mileage);
        if (!isNaN(newKm) && newKm > currentKm) {
             const garageStr = localStorage.getItem('autominder_garage');
             if (garageStr) {
                 const garage = JSON.parse(garageStr);
                 const updatedGarage = garage.map((v: any) => v.id === vehicle.id ? { ...v, mileage: historyData.km } : v);
                 localStorage.setItem('autominder_garage', JSON.stringify(updatedGarage));
             }
        }

        // Navigate back to dashboard
        navigate('/dashboard');
    };

    const handleLocate = () => {
        if (!navigator.geolocation) return;
        setLocationStatus('loading');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationStatus('found');
            },
            () => {
                setLocationStatus('idle'); // Error or denied
            }
        );
    };

    const handleRemindMe = () => {
        // Create a reminder object
        const newReminder = {
            id: Date.now(),
            vehicleId: vehicle.id,
            vehicleName: `${vehicle.make} ${vehicle.model}`,
            taskId: task.id,
            title: task.title,
            dateAdded: new Date().toISOString()
        };

        const storedReminders = localStorage.getItem('autominder_reminders');
        const reminders = storedReminders ? JSON.parse(storedReminders) : [];
        
        reminders.push(newReminder);
        localStorage.setItem('autominder_reminders', JSON.stringify(reminders));

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    useEffect(() => {
        navigator.permissions?.query({ name: 'geolocation' }).then(result => {
            if (result.state === 'granted') {
               // handleLocate(); 
            }
        });
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111813] dark:text-gray-100 font-display min-h-screen flex flex-col overflow-x-hidden relative">
            
            {/* Toast Notification */}
            <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full shadow-xl transition-all duration-300 z-[100] flex items-center gap-3 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <span className="material-symbols-outlined text-primary">check_circle</span>
                <span className="font-bold text-sm">Recordatorio establecido para 1 semana</span>
            </div>

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm border-b border-[#f0f5f1] dark:border-gray-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">directions_car</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight dark:text-white">Car Care App</h2>
                    </div>
                    <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                        <nav className="flex items-center gap-8">
                            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300">Panel</Link>
                            <Link to="/garage" className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300">Mi Garaje</Link>
                            <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300" href="#">Ajustes</a>
                        </nav>
                        <div className="flex items-center gap-3">
                            <DarkModeToggle />
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Main Content Layout */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <Link to="/dashboard" className="hover:text-primary transition-colors">Panel</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <Link to="/dashboard" className="hover:text-primary transition-colors capitalize">{vehicle.make} {vehicle.model}</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="font-medium text-gray-900 dark:text-white">{task.title}</span>
                </nav>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Details (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">{task.title}</h1>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium capitalize">{vehicle.make} {vehicle.model} • {vehicle.mileage} km</p>
                                </div>
                            </div>
                        </div>

                         {/* History Section - MOVED TO TOP & REDESIGNED FOR ENGAGEMENT */}
                         <section className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md p-6 lg:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                                    <span className="material-symbols-outlined text-primary">history_edu</span>
                                    {isAdBlue ? "Registrar Relleno" : "Actualizar Historial"}
                                </h3>

                                {/* SHOW PREVIOUS RECORD IF EXISTS */}
                                {lastRecord && (
                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                        <div className="flex items-center gap-3">
                                             <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-sm">history</span>
                                             </div>
                                             <div>
                                                 <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                     {isAdBlue ? "Último rellenado" : lastRecord.subType ? `Cambio: ${lastRecord.subType}` : "Último cambio"}
                                                 </p>
                                                 <p className="font-bold text-gray-900 dark:text-white">
                                                     {new Date(lastRecord.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                 </p>
                                             </div>
                                        </div>
                                        <div className="pl-11 sm:pl-0">
                                            <span className="inline-block bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-md px-2 py-1 text-sm font-mono font-medium text-gray-700 dark:text-gray-300">
                                                {parseInt(lastRecord.km).toLocaleString('es-ES')} km
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            {isAdBlue ? "Fecha de relleno" : "Fecha del cambio"}
                                        </label>
                                        <input 
                                            type="date" 
                                            value={historyData.date}
                                            onChange={(e) => setHistoryData({...historyData, date: e.target.value})}
                                            className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium outline-none"
                                        />
                                    </div>

                                    {/* Show Filter Type Selector ONLY if it's the Filters task */}
                                    {isFilterTask && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                Tipo de Filtro
                                            </label>
                                            <div className="relative">
                                                <select 
                                                    value={historyData.filterType}
                                                    onChange={(e) => setHistoryData({...historyData, filterType: e.target.value})}
                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="Aceite">Filtro de Aceite</option>
                                                    <option value="Aire">Filtro de Aire</option>
                                                    <option value="Combustible">Filtro de Combustible</option>
                                                    <option value="Habitáculo">Filtro de Habitáculo</option>
                                                </select>
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Kilometraje</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                placeholder={vehicle.mileage}
                                                value={historyData.km}
                                                onChange={(e) => setHistoryData({...historyData, km: e.target.value})}
                                                className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium outline-none placeholder:text-gray-400"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">KM</span>
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-3">
                                        <button 
                                            onClick={handleSaveHistory}
                                            className="h-12 w-full bg-primary hover:bg-primary-hover text-[#052912] font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">save</span>
                                            {isFilterTask ? "Registrar Filtro" : "Registrar"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        {/* Task Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Interval Card */}
                            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
                                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1">
                                    <span className="material-symbols-outlined">calendar_month</span>
                                </div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Intervalo</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{content.interval}</p>
                                <p className="text-xs text-gray-400">{content.intervalSub}</p>
                            </div>
                            {/* Cost Card */}
                            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
                                <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-1">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Coste Est.</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{content.cost}</p>
                                <p className="text-xs text-gray-400">Media local</p>
                            </div>
                            {/* Difficulty Card */}
                            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
                                <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-1">
                                    <span className="material-symbols-outlined">handyman</span>
                                </div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dificultad</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{content.difficulty}</p>
                                <p className="text-xs text-gray-400">Recomendado taller</p>
                            </div>
                        </div>
                        
                        {/* Why It Matters (Moved to Bottom) */}
                        <section className="relative overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm group">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                                        <span className="material-symbols-outlined text-lg">verified_user</span>
                                        <span>Por qué es importante</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Seguridad y Rendimiento</h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {content.description}
                                    </p>
                                </div>
                                <div className="shrink-0 w-full md:w-48 aspect-video md:aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                    <div className="w-full h-full bg-center bg-cover" style={{backgroundImage: `url('${content.image}')`}}></div>
                                </div>
                            </div>
                        </section>
                    </div>
                    
                    {/* Right Column: Actions & Context (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Action Card (Sticky on desktop) */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Acciones</h3>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => navigate('/garage')} className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-3 transition-colors">
                                    <span className="material-symbols-outlined">map</span>
                                    Buscar talleres
                                </button>
                                <button 
                                    onClick={handleRemindMe}
                                    className="w-full mt-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium py-2 text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">snooze</span>
                                    Recordar en 1 semana
                                </button>
                            </div>
                        </div>
                        
                        {/* Map Widget */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                    {locationStatus === 'found' ? 'Mejor valorados cerca de ti' : 'Mejor valorados'}
                                </h3>
                                <button 
                                    onClick={handleLocate}
                                    disabled={locationStatus === 'loading' || locationStatus === 'found'}
                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                >
                                    {locationStatus === 'loading' ? (
                                        <span className="animate-spin material-symbols-outlined text-xs">progress_activity</span>
                                    ) : locationStatus === 'found' ? (
                                        <span className="material-symbols-outlined text-xs">my_location</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-xs">near_me</span>
                                    )}
                                    {locationStatus === 'found' ? 'Ubicado' : 'Localizarme'}
                                </button>
                            </div>
                            {/* Map Image */}
                            <div className="relative h-48 w-full bg-gray-200 group">
                                <div className={`w-full h-full bg-cover bg-center transition-opacity duration-500 ${locationStatus === 'loading' ? 'opacity-50' : 'opacity-100'}`} style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5RVjSKcYVRjeYeDNYjjGtGy8WAwPGt-xaC46tYne2ne_V8R5eVOp48ZgDa6CaCLqRVAXD-MiGfjAOipC_FUvdAoclAhRmUC-7YBSmW-7o1aT1mDZCLorK2vKN6tJf9AcYWsQeYqQaFKwfBFf6nk1mrgwp4GTmH74tNNFznN25SChdYD3vsslKXAqaTgE3PnifhmsLzwzJ82krXgk3Hrm9-_IrHi2ZKRIJlGtXPqyxBiOmJ8a4E3JovLoXgmtm522YUcYarOMM9FR3')"}}>
                                    {/* Fake Pins */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <span className="material-symbols-outlined text-primary text-4xl drop-shadow-md animate-bounce">location_on</span>
                                    </div>
                                    <div className="absolute top-1/3 left-1/4">
                                        <span className="material-symbols-outlined text-red-500 text-3xl drop-shadow-md">location_on</span>
                                    </div>
                                </div>
                                {locationStatus === 'idle' && (
                                    <div onClick={handleLocate} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <span className="text-white font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined">near_me</span>
                                            Usar mi ubicación
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Mechanic List */}
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">Talleres AutoPro</h4>
                                            <p className="text-xs text-gray-500">{locationStatus === 'found' ? 'a 1.2 km' : 'Madrid Centro'}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded text-xs font-bold text-green-700 dark:text-green-400">
                                            <span>4.9</span>
                                            <span className="material-symbols-outlined text-[10px]">star</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">Mecánica Rápida</h4>
                                            <p className="text-xs text-gray-500">{locationStatus === 'found' ? 'a 2.5 km' : 'Zona Norte'}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-bold text-gray-700 dark:text-gray-300">
                                            <span>4.6</span>
                                            <span className="material-symbols-outlined text-[10px]">star</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TaskDetail;
