import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Listas de marcas
const CAR_MAKES = [ "Abarth", "Alfa Romeo", "Audi", "BMW", "BYD", "Citroën", "Cupra", "Dacia", "DS Automobiles", "Fiat", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia", "Land Rover", "Lexus", "Mazda", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Polestar", "Porsche", "Renault", "Seat", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo" ];
const MOTO_MAKES = [ "Aprilia", "Benelli", "BMW Motorrad", "CFMoto", "Ducati", "Harley-Davidson", "Honda", "Husqvarna", "Indian", "Kawasaki", "KTM", "Kymco", "Moto Guzzi", "MV Agusta", "Piaggio", "Royal Enfield", "Suzuki", "Sym", "Triumph", "Vespa", "Voge", "Yamaha", "Zontes" ];

const VehicleProfileSetup: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);

    // Recuperamos el tipo
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
        if (!make || !user) return;
        setLoading(true);

        // AHORA SÍ: Guardamos en las columnas correctas
        const { error } = await supabase.from('vehicles').insert({
            user_id: user.id,
            type: vehicleType,
            make: make,                // Columna nueva
            model: model || 'Modelo Desconocido', // Columna nueva
            odometer_km: parseInt(mileage) || 0   // Columna nueva
        });

        if (error) {
            console.error(error);
            alert("Error al guardar: " + error.message);
            setLoading(false);
        } else {
            // Si todo va bien, nos vamos al Dashboard
            navigate('/dashboard');
            window.location.reload();
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-[580px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                {/* Header de Progreso */}
                <div className="px-8 pt-8 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Paso 2 de 2</span>
                    <h2 className="text-sm font-semibold text-gray-900 mt-1">Datos del Vehículo</h2>
                    <div className="h-2 w-full bg-gray-100 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-blue-600 w-full rounded-full"></div>
                    </div>
                </div>

                {/* Formulario */}
                <div className="px-8 py-2 flex-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configura tu {isMoto ? 'moto' : 'coche'}.</h1>
                        <p className="text-gray-500">Introduce los detalles para tu plan de mantenimiento.</p>
                    </div>

                    <div className="flex flex-col gap-6 mb-8">
                        {/* Marca */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-900">Marca</label>
                            <div className="relative">
                                <select value={make} onChange={(e) => setMake(e.target.value)} className="block w-full h-14 rounded-xl border border-gray-200 px-4 bg-white text-gray-900 appearance-none cursor-pointer">
                                    <option disabled value="">Selecciona una marca</option>
                                    {(isMoto ? MOTO_MAKES : CAR_MAKES).map((brand) => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">▼</div>
                            </div>
                        </div>

                        {/* Modelo */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-900">Modelo</label>
                            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ej. Golf, Ibiza..." className="block w-full h-14 rounded-xl border border-gray-200 px-4" />
                        </div>

                        {/* Kilómetros */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-900">Kilometraje actual</label>
                            <div className="relative">
                                <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="Ej. 120000" className="block w-full h-14 rounded-xl border border-gray-200 px-4" />
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 bg-gray-50 m-1 rounded-lg text-sm font-bold">km</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-gray-50 border-t border-gray-100">
                    <button onClick={handleSave} disabled={!make || loading} className={`w-full h-14 font-bold text-lg rounded-xl flex items-center justify-center text-white transition-all ${!make || loading ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {loading ? 'Guardando...' : 'Guardar y Entrar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleProfileSetup;
