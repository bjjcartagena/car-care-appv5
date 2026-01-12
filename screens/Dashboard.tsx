import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

// --- Helper Components ---

type NotificationType = 'info' | 'warning' | 'danger';

interface NotificationItem {
    message: string;
    type: NotificationType;
}

const NotificationBanner: React.FC<{ notifications: NotificationItem[], onClose: (index: number) => void }> = ({ notifications, onClose }) => {
    if (notifications.length === 0) return null;

    const getStyles = (type: NotificationType) => {
        switch (type) {
            case 'danger':
                return "bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200";
            case 'warning':
                return "bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200";
            default: // info
                return "bg-primary/10 border-primary/20 text-text-main dark:text-text-main-dark";
        }
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'danger': return "error";
            case 'warning': return "warning";
            default: return "notifications_active";
        }
    };

    return (
        <div className="mb-6 flex flex-col gap-2">
            {notifications.map((note, idx) => (
                <div key={idx} className={`${getStyles(note.type)} border p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm`}>
                    <span className={`material-symbols-outlined ${note.type === 'danger' ? 'animate-pulse' : ''}`}>
                        {getIcon(note.type)}
                    </span>
                    <p className="text-sm font-bold flex-1">{note.message}</p>
                    <button onClick={() => onClose(idx)} className="opacity-70 hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            ))}
        </div>
    );
};

const KmUpdateModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (km: string) => void, currentKm: string }> = ({ isOpen, onClose, onSave, currentKm }) => {
    const [km, setKm] = useState(currentKm);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-card-light dark:bg-card-dark w-full max-w-sm rounded-2xl p-6 shadow-xl animate-in zoom-in-95 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-4">
                     <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">speed</span>
                    </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-center text-text-main dark:text-text-main-dark">Actualización Semanal</h3>
                <p className="text-sm text-text-muted dark:text-text-muted-dark mb-6 text-center">Para mantener el plan de mantenimiento preciso, por favor actualiza el kilometraje actual.</p>
                
                <input 
                    type="number" 
                    value={km} 
                    onChange={(e) => setKm(e.target.value)}
                    className="w-full text-3xl font-black text-center py-4 bg-background-light dark:bg-background-dark rounded-xl border border-gray-200 dark:border-gray-700 mb-6 focus:ring-primary focus:border-primary text-text-main dark:text-text-main-dark"
                    autoFocus
                />
                
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">Omitir</button>
                    <button onClick={() => onSave(km)} className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all">Guardar KM</button>
                </div>
            </div>
        </div>
    );
};

// --- Main Logic ---

// Helper to calculate remaining KM based on history
const calculateRemaining = (taskKey: string, intervalKm: number, currentKm: number, history: any, vehicleId: string, defaultRemaining: string) => {
    if (history && history[vehicleId] && history[vehicleId][taskKey]) {
        const lastServiceKm = parseInt(history[vehicleId][taskKey].km);
        const kmDriven = currentKm - lastServiceKm;
        const remaining = intervalKm - kmDriven;
        if (remaining < 0) return `Vencido hace ${Math.abs(remaining)} KM`;
        return `${remaining.toLocaleString('es-ES')} KM`;
    }
    return defaultRemaining;
};

const getMaintenanceTasks = (type: string, make: string, km: number, history: any, vehicleId: string) => {
    const tasks = [];
    
    // --- MOTO ---
    if (type === 'moto') {
        // 1. Aceite (Solo Aceite)
        tasks.push({
            id: 'engine_oil_moto',
            title: "Aceite de Motor",
            icon: "oil_barrel",
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-900/20",
            subtitle: "Lubricación del motor",
            remaining: calculateRemaining('engine_oil_moto', 6000, km, history, vehicleId, "1.200 KM"),
        });

        // 2. Filtros (Agrupados)
        tasks.push({
            id: 'filters_moto',
            title: "Filtros",
            icon: "filter_alt",
            color: "text-yellow-600 dark:text-yellow-400",
            bg: "bg-yellow-50 dark:bg-yellow-900/20",
            subtitle: "Aceite, Aire, Combustible",
            remaining: calculateRemaining('filters_moto', 6000, km, history, vehicleId, "1.200 KM"),
        });

        // 3. Neumáticos (Delantero y Trasero separados)
        tasks.push({
            id: 'tire_front',
            title: "Neumático Delantero",
            icon: "trip_origin", // Looks like a wheel
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            subtitle: "Desgaste y presión",
            remaining: calculateRemaining('tire_front', 15000, km, history, vehicleId, "5.000 KM"),
        });
        
        tasks.push({
            id: 'tire_rear',
            title: "Neumático Trasero",
            icon: "tire_repair",
            color: "text-blue-700 dark:text-blue-300",
            bg: "bg-blue-100 dark:bg-blue-800/30",
            subtitle: "Desgaste y tracción",
            remaining: calculateRemaining('tire_rear', 10000, km, history, vehicleId, "3.000 KM"),
        });

        // 4. Mecánica Específica
        tasks.push({
            id: 'chain',
            title: "Engrase de Cadena",
            icon: "link",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            subtitle: "Cada 500-1000 km",
            remaining: calculateRemaining('chain', 800, km, history, vehicleId, "350 KM"),
        });

        if (make === 'Ducati') {
            tasks.push({
                id: 'desmo',
                title: "Desmo Service",
                icon: "settings_suggest",
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-900/20",
                subtitle: "Reglaje de Válvulas",
                remaining: calculateRemaining('desmo', 24000, km, history, vehicleId, "4.500 KM"),
            });
        }
    } 
    // --- COCHE ---
    else {
        // 1. Aceite (Solo Aceite)
        tasks.push({
            id: 'oil',
            title: "Aceite de Motor",
            icon: "oil_barrel",
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-900/20",
            subtitle: "Sustitución lubricante",
            remaining: calculateRemaining('oil', 15000, km, history, vehicleId, "2.400 KM"),
        });

        // 2. Filtros (Agrupados)
        tasks.push({
            id: 'filters_car',
            title: "Filtros",
            icon: "filter_alt",
            color: "text-yellow-600 dark:text-yellow-400",
            bg: "bg-yellow-50 dark:bg-yellow-900/20",
            subtitle: "Aceite, Aire, Habitáculo...",
            remaining: calculateRemaining('filters_car', 15000, km, history, vehicleId, "2.400 KM"),
        });

        // 3. Neumáticos (General)
        tasks.push({
            id: 'tyres_car',
            title: "Neumáticos",
            icon: "tire_repair",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            subtitle: "Rotación o cambio",
            remaining: calculateRemaining('tyres_car', 40000, km, history, vehicleId, "12.000 KM"),
        });

        // 4. Mecánica General
        tasks.push({
            id: 'timing_belt',
            title: "Kit Distribución",
            icon: "settings",
            color: "text-gray-600 dark:text-gray-400",
            bg: "bg-gray-100 dark:bg-gray-800",
            subtitle: "Cambio preventivo",
            remaining: calculateRemaining('timing_belt', 120000, km, history, vehicleId, "40.000 KM"),
        });

        if (['Peugeot', 'Citroën', 'DS Automobiles', 'Opel'].includes(make)) {
             tasks.push({
                id: 'adblue',
                title: "Rellenar AdBlue",
                icon: "local_gas_station",
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-900/20",
                subtitle: "Sistema BlueHDi",
                remaining: calculateRemaining('adblue', 10000, km, history, vehicleId, "1.200 KM"),
            });
        }
        
        tasks.push({
            id: 'brake_fluid',
            title: "Líquido de Frenos",
            icon: "water_drop",
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20",
            subtitle: "Seguridad activa",
            remaining: "2 Años", 
        });
    }
    return tasks;
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [garage, setGarage] = useState<any[]>([]);
    
    // Dates & Notifications
    const [itvDate, setItvDate] = useState<string>('');
    const [daysToItv, setDaysToItv] = useState<number | null>(null);
    const [insuranceDate, setInsuranceDate] = useState<string>('');
    const [daysToInsurance, setDaysToInsurance] = useState<number | null>(null);
    
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [showKmModal, setShowKmModal] = useState(false);
    
    const [showVehicleMenu, setShowVehicleMenu] = useState(false);
    const [userName, setUserName] = useState(() => localStorage.getItem('autominder_username') || "Conductor");
    const [isEditingName, setIsEditingName] = useState(false);

    useEffect(() => {
        const garageStr = localStorage.getItem('autominder_garage');
        const activeId = localStorage.getItem('autominder_active_id');
        const historyStr = localStorage.getItem('autominder_history');
        const history = historyStr ? JSON.parse(historyStr) : {};
        
        if (garageStr) {
            const parsedGarage = JSON.parse(garageStr);
            setGarage(parsedGarage);
            
            if (parsedGarage.length > 0) {
                let activeVehicle = parsedGarage.find((v: any) => v.id === activeId);
                if (!activeVehicle) {
                    activeVehicle = parsedGarage[0];
                    localStorage.setItem('autominder_active_id', activeVehicle.id);
                }
                setVehicle(activeVehicle);
                setTasks(getMaintenanceTasks(activeVehicle.type, activeVehicle.make, parseInt(activeVehicle.mileage), history, activeVehicle.id));
                
                // --- Notifications Checks ---
                const newNotes: NotificationItem[] = [];

                // 1. Weekly KM Update Logic
                const lastKmCheck = localStorage.getItem(`autominder_last_km_check_${activeVehicle.id}`);
                const now = Date.now();
                
                if (!lastKmCheck) {
                    localStorage.setItem(`autominder_last_km_check_${activeVehicle.id}`, now.toString());
                } else {
                    const daysSinceCheck = (now - parseInt(lastKmCheck)) / (1000 * 60 * 60 * 24);
                    if (daysSinceCheck >= 7) {
                        setShowKmModal(true);
                        newNotes.push({
                            message: `📅 Han pasado ${Math.floor(daysSinceCheck)} días. Por favor, actualiza los KM de tu ${activeVehicle.make}.`,
                            type: 'info'
                        });
                    }
                }

                // 2. ITV Checks (30, 14, 7 days)
                const storedItv = activeVehicle.itvDate;
                if (storedItv) {
                    setItvDate(storedItv);
                    const days = getDaysDiff(storedItv, true); // True for end of month logic
                    setDaysToItv(days);
                    if ([30, 14, 7].includes(days) && days > 0) {
                        newNotes.push({
                            message: `🚗 Tu ITV caduca en ${days} días.`,
                            type: 'warning'
                        });
                    } else if (days <= 0) {
                        newNotes.push({
                            message: `⚠️ URGENTE: Tu ITV ha caducado.`,
                            type: 'danger'
                        });
                    }
                } else {
                    setItvDate('');
                    setDaysToItv(null);
                }

                // 3. Insurance Checks (30, 7 days)
                const storedInsurance = activeVehicle.insuranceDate;
                if (storedInsurance) {
                    setInsuranceDate(storedInsurance);
                    const days = getDaysDiff(storedInsurance, false);
                    setDaysToInsurance(days);
                    if ([30, 7].includes(days) && days > 0) {
                        newNotes.push({
                            message: `📄 Tu Seguro vence en ${days} días.`,
                            type: 'warning'
                        });
                    } else if (days <= 0) {
                        newNotes.push({
                            message: `⚠️ URGENTE: Tu Seguro ha vencido.`,
                            type: 'danger'
                        });
                    }
                } else {
                    setInsuranceDate('');
                    setDaysToInsurance(null);
                }
                
                if (newNotes.length > 0) setNotifications(newNotes);

            } else {
                navigate('/');
            }
        } else {
             navigate('/');
        }
    }, [navigate]);

    const getDaysDiff = (dateStr: string, isEndOfMonth: boolean) => {
        if (!dateStr) return 0;
        let target;
        if (isEndOfMonth) {
            const [year, month] = dateStr.split('-').map(Number);
            target = new Date(year, month, 0); // Last day of month
        } else {
            target = new Date(dateStr);
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffTime = target.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleSaveKm = (newKm: string) => {
        if (!vehicle) return;
        // Update garage
        const updatedGarage = garage.map(v => v.id === vehicle.id ? { ...v, mileage: newKm } : v);
        localStorage.setItem('autominder_garage', JSON.stringify(updatedGarage));
        // Reset the timer for the notification
        localStorage.setItem(`autominder_last_km_check_${vehicle.id}`, Date.now().toString());
        
        setGarage(updatedGarage);
        setVehicle({ ...vehicle, mileage: newKm });
        setShowKmModal(false);
        setNotifications(prev => prev.filter(n => !n.message.includes('días. Por favor, actualiza los KM')));
        
        // Refresh Tasks with new mileage
        const history = JSON.parse(localStorage.getItem('autominder_history') || '{}');
        setTasks(getMaintenanceTasks(vehicle.type, vehicle.make, parseInt(newKm), history, vehicle.id));
    };

    const handleNameSave = () => {
        setIsEditingName(false);
        const nameToSave = userName.trim() === "" ? "Conductor" : userName;
        setUserName(nameToSave);
        localStorage.setItem('autominder_username', nameToSave);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleNameSave();
    };

    const saveItvDate = (date: string) => {
        setItvDate(date);
        
        // Update Specific Vehicle in Garage
        if (vehicle) {
            const updatedGarage = garage.map(v => v.id === vehicle.id ? { ...v, itvDate: date } : v);
            setGarage(updatedGarage);
            localStorage.setItem('autominder_garage', JSON.stringify(updatedGarage));
        }

        setDaysToItv(getDaysDiff(date, true));
    };

    const saveInsuranceDate = (date: string) => {
        setInsuranceDate(date);
        
        // Update Specific Vehicle in Garage
        if (vehicle) {
            const updatedGarage = garage.map(v => v.id === vehicle.id ? { ...v, insuranceDate: date } : v);
            setGarage(updatedGarage);
            localStorage.setItem('autominder_garage', JSON.stringify(updatedGarage));
        }

        setDaysToInsurance(getDaysDiff(date, false));
    };

    const switchVehicle = (v: any) => {
        setVehicle(v);
        localStorage.setItem('autominder_active_id', v.id);
        window.location.reload(); 
    };
    
    const removeNotification = (index: number) => {
        setNotifications(prev => prev.filter((_, i) => i !== index));
    };

    const iconMap: any = { 'car': 'directions_car', 'moto': 'two_wheeler' };
    
    if (!vehicle) return null;

    const formatItvDisplay = (dateStr: string) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, 1);
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    };

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // --- Color Logic ---
    const getCardStyles = (days: number | null) => {
        const base = "rounded-2xl p-6 shadow-soft border transition-colors duration-300";
        if (days === null) return `${base} bg-card-light dark:bg-card-dark border-gray-200 dark:border-gray-700`;
        
        if (days <= 0) {
            // Rojo Intenso (Vencido)
            return `${base} bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 ring-1 ring-red-200 dark:ring-red-900`;
        } else if (days <= 30) {
            // Amarillento (Próximo)
            return `${base} bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50`;
        } else {
             // Verdoso (OK)
             return `${base} bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/50`;
        }
    };

    const getIconStyles = (days: number | null) => {
        const base = "rounded-xl flex items-center justify-center transition-all duration-300";
         if (days === null) return `${base} h-10 w-10 bg-primary/20 text-primary`;

        if (days <= 0) {
            // Vencido: Icono Grande, Pulsante, Sombra Roja
            return `${base} h-14 w-14 bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 shadow-lg shadow-red-500/20 animate-pulse`;
        } else if (days <= 30) {
             return `${base} h-10 w-10 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400`;
        } else {
             return `${base} h-10 w-10 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400`;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark antialiased transition-colors duration-200">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-[#f0f5f1] dark:border-[#2a3c30]">
                <div className="max-w-[960px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">directions_car</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Car Care App</h1>
                    </div>
                    <div className="flex gap-2 relative">
                        <Link to="/garage" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-text-main dark:text-text-main-dark" title="Mi Garaje">
                            <span className="material-symbols-outlined">garage_home</span>
                        </Link>
                        <DarkModeToggle />
                    </div>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-1 w-full max-w-[960px] mx-auto px-4 md:px-6 py-6 pb-24">
                
                <NotificationBanner notifications={notifications} onClose={removeNotification} />

                {/* Greeting & Vehicle Selector */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 relative z-20">
                    <div className="relative">
                        {isEditingName ? (
                            <input 
                                autoFocus
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                onBlur={handleNameSave}
                                onKeyDown={handleNameKeyDown}
                                className="text-sm font-medium mb-1 bg-transparent border-b border-primary outline-none text-text-main dark:text-text-main-dark w-40"
                            />
                        ) : (
                            <div 
                                onClick={() => setIsEditingName(true)}
                                className="group flex items-center gap-2 cursor-pointer w-fit"
                            >
                                <p className="text-text-muted dark:text-text-muted-dark text-sm font-medium mb-1 group-hover:text-primary transition-colors">
                                    Buenos días, {userName}
                                </p>
                                <span className="material-symbols-outlined text-[14px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
                            </div>
                        )}
                        
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
                                                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${v.id === vehicle.id ? 'bg-primary/5 text-primary' : 'text-text-main dark:text-text-main-dark'}`}
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

                    <div className="inline-flex items-center px-3 py-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-700 rounded-full shadow-sm">
                        <span className="material-symbols-outlined text-primary text-sm mr-2">speed</span>
                        <span className="font-bold text-sm">{vehicle.mileage} KM</span>
                    </div>
                </div>
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                    
                    {/* Tasks List */}
                    <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Plan de Mantenimiento</h3>
                                <button className="text-sm font-bold text-primary hover:underline">Ver plan completo</button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {tasks.map((task, idx) => (
                                    <div key={idx} onClick={() => navigate('/task-detail', { state: { task, vehicle } })} className="group bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all cursor-pointer flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-lg ${task.bg} flex items-center justify-center ${task.color} shrink-0`}>
                                            <span className="material-symbols-outlined">{task.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-text-main dark:text-text-main-dark truncate">{task.title}</h4>
                                            <p className="text-sm text-text-muted dark:text-text-muted-dark truncate mt-0.5">{task.subtitle}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-text-main dark:text-text-main-dark">{task.remaining}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Sidebar: ITV & Insurance */}
                    <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
                        {/* ITV Module */}
                        <div className={getCardStyles(daysToItv)}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Próxima ITV</h3>
                                    <p className="text-xs text-text-muted dark:text-text-muted-dark">Inspección Técnica</p>
                                </div>
                                <div className={getIconStyles(daysToItv)}>
                                    <span className={`material-symbols-outlined ${daysToItv !== null && daysToItv <= 0 ? 'text-3xl' : ''}`}>event_available</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                {itvDate ? (
                                    <div className={`text-center py-2 bg-white/50 dark:bg-black/10 rounded-xl border border-dashed border-current/20`}>
                                        {daysToItv !== null && daysToItv <= 0 ? (
                                            <span className="text-3xl font-extrabold text-red-600 dark:text-red-400 block tracking-wider">
                                                CADUCADA
                                            </span>
                                        ) : (
                                            <span className="text-3xl font-extrabold text-text-main dark:text-text-main-dark block">
                                                {daysToItv} <span className="text-sm font-normal opacity-70">días</span>
                                            </span>
                                        )}
                                        <span className={`text-xs font-semibold uppercase tracking-wide capitalize opacity-70`}>
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
                                    className="block w-full text-sm text-text-main dark:text-text-main-dark bg-white dark:bg-[#15231b] border border-gray-200 dark:border-[#2a3c30] rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                />
                            </label>
                        </div>

                         {/* Insurance Module with Ad */}
                        <div className={getCardStyles(daysToInsurance)}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-text-main dark:text-text-main-dark">Seguro</h3>
                                    <p className="text-xs text-text-muted dark:text-text-muted-dark">Fecha de renovación</p>
                                </div>
                                <div className={getIconStyles(daysToInsurance)}>
                                    <span className={`material-symbols-outlined ${daysToInsurance !== null && daysToInsurance <= 0 ? 'text-3xl' : ''}`}>health_and_safety</span>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                {insuranceDate ? (
                                    <div className={`text-center py-2 bg-white/50 dark:bg-black/10 rounded-xl border border-dashed border-current/20`}>
                                        {daysToInsurance !== null && daysToInsurance <= 0 ? (
                                            <span className="text-3xl font-extrabold text-red-600 dark:text-red-400 block tracking-wider">
                                                VENCIDO
                                            </span>
                                        ) : (
                                            <span className="text-3xl font-extrabold text-text-main dark:text-text-main-dark block">
                                                {daysToInsurance} <span className="text-sm font-normal opacity-70">días</span>
                                            </span>
                                        )}
                                        <span className={`text-xs font-semibold uppercase tracking-wide capitalize opacity-70`}>
                                            {formatDateDisplay(insuranceDate)}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-background-light dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-text-muted">Sin fecha de seguro</p>
                                    </div>
                                )}
                            </div>

                            <label className="block w-full mb-4">
                                <span className="text-xs font-bold text-text-muted dark:text-text-muted-dark mb-1 block">Vencimiento (Día exacto)</span>
                                <input 
                                    type="date" 
                                    value={insuranceDate} 
                                    onChange={(e) => saveInsuranceDate(e.target.value)}
                                    className="block w-full text-sm text-text-main dark:text-text-main-dark bg-white dark:bg-[#15231b] border border-gray-200 dark:border-[#2a3c30] rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                                />
                            </label>

                            {/* Discrete Ad */}
                            <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-3 mt-2">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Patrocinado</p>
                                <a href="#" className="flex items-center justify-between group">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors text-lg">
                                            {vehicle.type === 'moto' ? 'two_wheeler' : 'directions_car'}
                                        </span>
                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">
                                            {vehicle.type === 'moto' 
                                                ? 'Seguros de Moto desde 79€' 
                                                : 'Comparador: Ahorra hasta 40%'}
                                        </span>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 text-sm group-hover:text-primary">open_in_new</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <KmUpdateModal 
                isOpen={showKmModal} 
                onClose={() => setShowKmModal(false)} 
                onSave={handleSaveKm} 
                currentKm={vehicle.mileage} 
            />
        </div>
    );
};

export default Dashboard;
