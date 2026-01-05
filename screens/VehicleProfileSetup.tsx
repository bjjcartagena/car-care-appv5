import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CAR_MAKES = [
    "Abarth", "Alfa Romeo", "Audi", "BMW", "BYD", "Citroën", "Cupra", "Dacia", 
    "DS Automobiles", "Fiat", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", 
    "Kia", "Land Rover", "Lexus", "Mazda", "Mercedes-Benz", "MG", "Mini", 
    "Mitsubishi", "Nissan", "Opel", "Peugeot", "Polestar", "Porsche", "Renault", 
    "Seat", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", 
    "Volkswagen", "Volvo"
];

const MOTO_MAKES = [
    "Aprilia", "Benelli", "BMW Motorrad", "CFMoto", "Ducati", "Harley-Davidson", 
    "Honda", "Husqvarna", "Indian", "Kawasaki", "KTM", "Kymco", "Moto Guzzi", 
    "MV Agusta", "Piaggio", "Royal Enfield", "Suzuki", "Sym", "Triumph", 
    "Vespa", "Voge", "Yamaha", "Zontes"
];

const VehicleProfileSetup: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Default to car if no state is passed
    const vehicleType = location.state?.vehicleType || 'car';
    const isMoto = vehicleType === 'moto';
    
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [mileage, setMileage] = useState("");

    const handleSave = () => {
        // Simple validation
        if (!make) return;

        const newVehicleId = Date.now().toString(); // Simple ID generation

        const newVehicle = {
            id: newVehicleId,
            type: vehicleType,
            make,
            model: model || (isMoto ? "Modelo Desconocido" : "Modelo Desconocido"),
            mileage: mileage || "0",
            dateAdded: new Date().toISOString()
        };

        // Get existing garage
        const storedGarage = localStorage.getItem('autominder_garage');
        let garage = storedGarage ? JSON.parse(storedGarage) : [];
        
        // Add to garage
        garage.push(newVehicle);
        
        // Save back to storage
        localStorage.setItem('autominder_garage', JSON.stringify(garage));
        
        // Set as active vehicle
        localStorage.setItem('autominder_active_id', newVehicleId);
        
        navigate('/dashboard');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display antialiased text-[#111813] dark:text-white min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary selection:text-black">
            {/* Abstract Background Decoration */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>
            
            {/* Main Layout Container */}
            <div className="layout-container flex h-full grow flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
                {/* Focused Card */}
                <div className="w-full max-w-[580px] bg-white dark:bg-[#1a2920] rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-[#2a3f32] overflow-hidden flex flex-col">
                    {/* Progress Header */}
                    <div className="px-8 pt-8 pb-4">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#608a6e] dark:text-[#6e9c80]">Paso 2 de 4</span>
                                <h2 className="text-sm font-semibold text-[#111813] dark:text-gray-200">Datos del {isMoto ? 'Vehículo' : 'Vehículo'}</h2>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">50% Completado</span>
                        </div>
                        <div className="h-2 w-full bg-[#eef4f0] dark:bg-[#25382e] rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-1/2 rounded-full shadow-[0_0_10px_rgba(13,242,89,0.5)]"></div>
                        </div>
                    </div>
                    
                    {/* Content Body */}
                    <div className="px-8 py-2 flex-1">
                        {/* Heading */}
                        <div className="mb-8">
                            <h1 className="text-[32px] font-bold leading-tight text-[#111813] dark:text-white mb-2 tracking-tight">
                                Vamos a configurar tu {isMoto ? 'moto' : 'coche'}.
                            </h1>
                            <p className="text-[#608a6e] dark:text-[#8bbaa0] text-base leading-relaxed">
                                Introduce los detalles para cargar el plan de mantenimiento oficial de {isMoto ? 'la marca' : 'el fabricante'}.
                            </p>
                        </div>
                        
                        {/* Form Fields */}
                        <div className="flex flex-col gap-6">
                            {/* Make Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#111813] dark:text-gray-200" htmlFor="vehicle-make">
                                    Marca
                                </label>
                                <div className="relative group">
                                    <select 
                                        value={make}
                                        onChange={(e) => setMake(e.target.value)}
                                        className="form-input-transition block w-full h-14 rounded-xl border border-[#dbe6df] dark:border-[#354f40] bg-white dark:bg-[#15231b] px-4 text-base text-[#111813] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer placeholder:text-[#608a6e]" 
                                        id="vehicle-make"
                                    >
                                        <option disabled value="">Selecciona marca</option>
                                        {(isMoto ? MOTO_MAKES : CAR_MAKES).map((brand) => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#608a6e] dark:text-[#8bbaa0] group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Model Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#111813] dark:text-gray-200" htmlFor="vehicle-model">
                                    Modelo
                                </label>
                                <div className="relative">
                                    <input 
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="form-input-transition block w-full h-14 rounded-xl border border-[#dbe6df] dark:border-[#354f40] bg-white dark:bg-[#15231b] px-4 text-base text-[#111813] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-[#9ab8a4] dark:placeholder:text-[#4a6356]" 
                                        id="vehicle-model" 
                                        placeholder={isMoto ? "ej. MT-07, GS 1250..." : "ej. 3008, Corolla, Golf..."} 
                                        type="text"
                                    />
                                </div>
                                <p className="text-xs text-[#608a6e] dark:text-[#6e9c80]">
                                    {isMoto ? 'Necesario para intervalos de cadena/cardán.' : 'Necesario para sugerir el tipo de aceite correcto.'}
                                </p>
                            </div>
                            
                            {/* Mileage Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#111813] dark:text-gray-200" htmlFor="current-mileage">
                                    Kilometraje actual
                                </label>
                                <div className="relative group">
                                    <input 
                                        value={mileage}
                                        onChange={(e) => setMileage(e.target.value)}
                                        className="form-input-transition block w-full h-14 rounded-xl border border-[#dbe6df] dark:border-[#354f40] bg-white dark:bg-[#15231b] px-4 pr-16 text-base text-[#111813] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-[#9ab8a4] dark:placeholder:text-[#4a6356]" 
                                        id="current-mileage" 
                                        placeholder="ej. 25.000" 
                                        type="text"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                                        <span className="text-sm font-semibold text-[#608a6e] dark:text-[#6e9c80] bg-[#f5f8f6] dark:bg-[#1a2920] py-1 px-2 rounded">km</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer / Actions */}
                    <div className="p-8 mt-4 bg-[#fbfdfc] dark:bg-[#15231b] border-t border-[#edf2ef] dark:border-[#2a3f32]">
                        <button 
                            onClick={handleSave}
                            disabled={!make}
                            className={`group w-full h-14 font-bold text-lg rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden ${!make ? 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-[#0bc248] text-[#052912] shadow-primary/20 hover:shadow-primary/40'}`}
                        >
                            <span className="relative z-10">Guardar Vehículo</span>
                            <span className="material-symbols-outlined text-[24px] relative z-10 transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                            {/* Button Glow Effect */}
                            {make && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>}
                        </button>
                        {/* Trust/Psychology Reinforcement */}
                        <div className="mt-4 flex justify-center items-center gap-2 opacity-80">
                            <span className="material-symbols-outlined text-[#608a6e] dark:text-[#6e9c80] text-[18px]">verified_user</span>
                            <p className="text-xs font-medium text-[#608a6e] dark:text-[#6e9c80]">Almacenado de forma segura y solo para alertas.</p>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Link */}
                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-[#608a6e] hover:text-[#111813] dark:text-[#8bbaa0] dark:hover:text-white transition-colors">
                        Omitir por ahora
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleProfileSetup;