import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Ajustamos la ruta a tu configuración actual

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
    const [user, setUser] = useState<any>(null);

    // Recuperamos el tipo de vehículo
    const vehicleType = location.state?.vehicleType || 'car';
    const isMoto = vehicleType === 'moto' || vehicleType === 'motorcycle';

    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [mileage, setMileage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUser(user);
            else navigate('/login');
        };
        getUser();
    }, [navigate]);

    const handleSave = async () => {
    // Añadimos model y mileage a la validación
    if (!make || !model || !mileage || !user || !profile) {
        alert("Por favor completa todos los campos");
        return;
    } 
    setLoading(true);

        // --- AQUÍ ESTÁ LA CLAVE PARA QUE NO FALLE ---
        // Tu código original usaba 'make' y 'odometer_km'.
        // Tu base de datos actual pide 'brand' y 'km_current'.
        // Hacemos el puente aquí mismo:
        
        const { error } = await supabase.from('vehicles').insert({
            user_id: user.id,
            type: vehicleType,
            brand: make,                        // Enviamos 'make' a la columna 'brand'
            model: model || "Modelo Desconocido",
            km_current: parseInt(mileage) || 0  // Enviamos 'mileage' a la columna 'km_current'
        });

        if (error) {
            console.error("Error saving vehicle:", error);
            alert("Error al guardar: " + error.message);
        } else {
            navigate('/dashboard');
            window.location.reload();
        }
        setLoading(false);
    };

    return (
        <div className="bg-white dark:bg-[#111813] min-h-screen flex flex-col relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
            {/* Decoración de fondo abstracta (Tu diseño original) */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Contenedor Principal */}
            <div className="layout-container flex h-full grow flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
                {/* Tarjeta Central */}
                <div className="w-full max-w-[580px] bg-white dark:bg-[#1a2920] rounded-2xl shadow-xl border border-gray-100 dark:border-[#2a3f32] overflow-hidden flex flex-col">
                    
                    {/* Header de Progreso */}
                    <div className="px-8 pt-8 pb-4">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Paso 2 de 4</span>
                                <h2 className="text-sm font-semibold text-[#111813] dark:text-gray-200">Datos del Vehículo</h2>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">50% Completado</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-[#25382e] rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-1/2 rounded-full shadow-glow"></div>
                        </div>
                    </div>

                    {/* Cuerpo del Formulario */}
                    <div className="px-8 py-2 flex-1">
                        <div className="mb-8">
                            <h1 className="text-[32px] font-bold leading-tight text-[#111813] dark:text-white mb-2 tracking-tight">
                                Vamos a configurar tu {isMoto ? 'moto' : 'coche'}.
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                                Introduce los detalles para cargar el plan de mantenimiento recomendado.
                            </p>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Campo Marca */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#111813] dark:text-gray-200">Marca</label>
                                <div className="relative group">
                                    <select
                                        value={make}
                                        onChange={(e) => setMake(e.target.value)}
                                        className="block w-full h-14 rounded-xl border border-gray-200 dark:border-[#354f40] bg-white dark:bg-[#15231b] px-4 text-base text-[#111813] dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none appearance-none cursor-pointer"
                                    >
                                        <option disabled value="">Selecciona una marca</option>
                                        {(isMoto ? MOTO_MAKES : CAR_MAKES).map((brand) => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Campo Modelo */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#111813] dark:text-gray-200">Modelo</label>
                                <input
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="block w-full h-14 rounded-xl border border-gray-200 dark:border-[#354f40] bg-white dark:bg-[#15231b] px-4 text-base text-[#111813] dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none placeholder:text-gray-400"
                                    placeholder={isMoto ? "ej. MT-07, GS 1250..." : "ej. 3008, Corolla, Golf..."}
                                    type="text"
                                />
                            </div>

                            {/* Campo Kilometraje */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#111813] dark:text-gray-200">Kilometraje actual</label>
                                <div className="relative group">
                                    <input
                                        value={mileage}
                                        onChange={(e) => setMileage(e.target.value)}
                                        className="block w-full h-14 rounded-xl border border-gray-200 dark:border-[#354f40] bg-white dark:bg-[#15231b] px-4 pr-16 text-base text-[#111813] dark:text-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none placeholder:text-gray-400"
                                        placeholder="ej. 25000"
                                        type="number"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                                        <span className="text-sm font-semibold text-gray-500 bg-gray-50 dark:bg-[#1a2920] py-1 px-2 rounded">km</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Botón */}
                    <div className="p-8 mt-4 bg-gray-50 dark:bg-[#15231b] border-t border-gray-100 dark:border-[#2a3f32]">
                        <button
    onClick={handleSave}
    // ANTES: disabled={!make || loading}
    // AHORA (Corrección):
    disabled={!make || !model || !mileage || loading}
    className={`...`} // el resto de clases igual
>
                        >
                            <span>{loading ? 'Guardando...' : 'Guardar Vehículo'}</span>
                            <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleProfileSetup;
