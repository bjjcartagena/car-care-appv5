import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const TaskDetail: React.FC = () => {
    const navigate = useNavigate();
    
    // State for dynamic vehicle data
    const [vehicle, setVehicle] = useState<any>({ make: 'Mi Vehículo', model: '', mileage: '0' });
    
    // State for History Editing
    const [isEditingHistory, setIsEditingHistory] = useState(false);
    const [historyData, setHistoryData] = useState({
        date: '2021-09-12',
        km: '80105',
        shop: 'Talleres AutoPro'
    });

    useEffect(() => {
        // Load active vehicle from garage
        const garageStr = localStorage.getItem('autominder_garage');
        const activeId = localStorage.getItem('autominder_active_id');
        
        if (garageStr) {
            const garage = JSON.parse(garageStr);
            if (garage.length > 0) {
                let activeVehicle = garage.find((v: any) => v.id === activeId) || garage[0];
                setVehicle(activeVehicle);
            }
        }
    }, []);

    const handleSaveHistory = () => {
        setIsEditingHistory(false);
        // Here you would typically save to backend/localStorage
        console.log("Historial actualizado:", historyData);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111813] dark:text-gray-100 font-display min-h-screen flex flex-col overflow-x-hidden">
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
                            <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border-2 border-transparent hover:border-primary transition-all cursor-pointer" data-alt="User profile picture placeholder" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLpQLNOdVAYZZ7vfjK6FmEIorppoFeavqSdG6pnU7nu8fWvNoXYAfuA1L7_hcgJ1wVF9E69wxS4YGtdZrfDRIXZ-H463ckTIjpvX2tXdiXKxpUqtHdAqi2-lBtfix-qFc1qFnp5qT8th2y6lxSu5RtQqa_gTWDcwTDfdZZokLIePzF05nSHMQ8SzuAnkDvSpMFDjairnAe9iz25RuUxO1pxlqr_qQyFuKMSdNaIULMXHqQYzkcuURgc5YIfC__9mfdmN6BqqFIri_M")'}}></div>
                        </div>
                    </div>
                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-gray-700 dark:text-gray-200">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </header>
            
            {/* Main Content Layout */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <Link to="/dashboard" className="hover:text-primary transition-colors">Panel</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <a className="hover:text-primary transition-colors capitalize" href="#">{vehicle.make} {vehicle.model}</a>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="font-medium text-gray-900 dark:text-white">Líquido de Frenos</span>
                </nav>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Details (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">Purgado de líquido de frenos</h1>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium capitalize">{vehicle.make} {vehicle.model} • {vehicle.mileage} km</p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50">
                                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">warning</span>
                                    <span className="text-sm font-bold text-red-700 dark:text-red-400">Vence en 2 días</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Why It Matters (Psychology Hook) */}
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
                                        El líquido viejo puede absorber humedad del aire, reduciendo su punto de ebullición y provocando fallos en frenadas bruscas. Cambiarlo asegura que tu coche responda al instante, protegiéndote a ti y a tus pasajeros.
                                    </p>
                                </div>
                                <div className="shrink-0 w-full md:w-48 aspect-video md:aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                                    <div className="w-full h-full bg-center bg-cover" data-alt="Close up of mechanic checking car brake fluid reservoir" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQX6fPG-gY61lh2q_jUOQkmgP63pbyxCuUChSAbDb9Ueehinw9DTMmc0IAuzYu-CxU6UeNdhJ9K248Z9VKg1EpRjjIjFPShibcB8vZXVoV6zihxvmzcStw8irdBZ8FPLpyNG9LqdIR0PKMcVCE3Z50ltGdZNBegbykzYKooHbRXbKhSvWsm9CIkNXZOvoa4L3UbG4Gr3kTnf_oujACxuWslzHeYi5-ssvfxqrsazn7f61zERJcp3IG76hjCpWgD0oUHwfDMaD0PkXG')"}}></div>
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
                                <p className="text-lg font-bold text-gray-900 dark:text-white">Cada 2 Años</p>
                                <p className="text-xs text-gray-400">o 40.000 km</p>
                            </div>
                            {/* Cost Card */}
                            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
                                <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-1">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Coste Est.</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">90€ - 120€</p>
                                <p className="text-xs text-gray-400">Media local</p>
                            </div>
                            {/* Difficulty Card */}
                            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-2">
                                <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-1">
                                    <span className="material-symbols-outlined">handyman</span>
                                </div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dificultad</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">Moderada</p>
                                <p className="text-xs text-gray-400">Recomendado taller</p>
                            </div>
                        </div>
                        
                        {/* History Section - Now Editable */}
                        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-400">history</span>
                                    Historial
                                </h3>
                                {!isEditingHistory ? (
                                    <button 
                                        onClick={() => setIsEditingHistory(true)}
                                        className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Editar
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setIsEditingHistory(false)}
                                            className="text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            onClick={handleSaveHistory}
                                            className="text-xs font-bold text-primary hover:text-primary-hover"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0 gap-4">
                                    <div className="w-full sm:w-auto">
                                        <p className="font-semibold text-gray-900 dark:text-white mb-1">Último cambio</p>
                                        {isEditingHistory ? (
                                            <input 
                                                type="text" 
                                                value={historyData.shop}
                                                onChange={(e) => setHistoryData({...historyData, shop: e.target.value})}
                                                className="w-full text-sm p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                                placeholder="Nombre del Taller"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">{historyData.shop}</p>
                                        )}
                                    </div>
                                    <div className="text-left sm:text-right w-full sm:w-auto flex flex-col gap-1">
                                        {isEditingHistory ? (
                                            <>
                                                <input 
                                                    type="date" 
                                                    value={historyData.date}
                                                    onChange={(e) => setHistoryData({...historyData, date: e.target.value})}
                                                    className="w-full text-sm p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                                                />
                                                <div className="relative">
                                                    <input 
                                                        type="number" 
                                                        value={historyData.km}
                                                        onChange={(e) => setHistoryData({...historyData, km: e.target.value})}
                                                        className="w-full text-sm p-2 pr-8 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                                                    />
                                                    <span className="absolute right-2 top-1.5 text-xs text-gray-500">km</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {new Date(historyData.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                                <p className="text-sm text-gray-500">{parseInt(historyData.km).toLocaleString('es-ES')} km</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        {/* What's Involved */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Qué esperar del servicio</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                    <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                    <span>El mecánico extrae el líquido viejo del cilindro maestro.</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                    <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                    <span>Se añade líquido nuevo y se purga a través de los conductos de cada rueda.</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                    <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                    <span>Se comprueban fugas y se verifica el tacto del pedal de freno.</span>
                                </li>
                            </ul>
                        </section>
                    </div>
                    
                    {/* Right Column: Actions & Context (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Action Card (Sticky on desktop) */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Acciones</h3>
                            <div className="flex flex-col gap-3">
                                <button className="w-full bg-primary hover:bg-opacity-90 text-black font-bold py-4 px-6 rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-3 transition-all transform active:scale-95 group">
                                    <span className="material-symbols-outlined font-bold group-hover:scale-110 transition-transform">check</span>
                                    Marcar completado
                                </button>
                                <button className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-3 transition-colors">
                                    <span className="material-symbols-outlined">map</span>
                                    Buscar talleres cercanos
                                </button>
                                <button className="w-full mt-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium py-2 text-sm flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-lg">snooze</span>
                                    Recordar en 1 semana
                                </button>
                            </div>
                            
                            {/* Progress Motivation */}
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Puntuación Mantenimiento</span>
                                    <span className="text-sm font-bold text-primary">85/100</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{width: '85%'}}></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">¡Completar esto subirá tu puntuación a 92!</p>
                            </div>
                        </div>
                        
                        {/* Map Widget */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 dark:text-white">Mejor valorados cerca</h3>
                                <a className="text-xs font-bold text-primary hover:underline" href="#">Ver Todos</a>
                            </div>
                            {/* Map Image */}
                            <div className="relative h-48 w-full bg-gray-200">
                                <div className="w-full h-full bg-cover bg-center" data-alt="Map showing nearby mechanic workshops locations" data-location="Madrid" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5RVjSKcYVRjeYeDNYjjGtGy8WAwPGt-xaC46tYne2ne_V8R5eVOp48ZgDa6CaCLqRVAXD-MiGfjAOipC_FUvdAoclAhRmUC-7YBSmW-7o1aT1mDZCLorK2vKN6tJf9AcYWsQeYqQaFKwfBFf6nk1mrgwp4GTmH74tNNFznN25SChdYD3vsslKXAqaTgE3PnifhmsLzwzJ82krXgk3Hrm9-_IrHi2ZKRIJlGtXPqyxBiOmJ8a4E3JovLoXgmtm522YUcYarOMM9FR3')"}}>
                                    {/* Fake Pins */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <span className="material-symbols-outlined text-primary text-4xl drop-shadow-md">location_on</span>
                                    </div>
                                    <div className="absolute top-1/3 left-1/4">
                                        <span className="material-symbols-outlined text-red-500 text-3xl drop-shadow-md">location_on</span>
                                    </div>
                                </div>
                            </div>
                            {/* Mechanic List */}
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">Talleres AutoPro</h4>
                                            <p className="text-xs text-gray-500">a 1.2 km</p>
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
                                            <p className="text-xs text-gray-500">a 2.5 km</p>
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