// src/screens/WelcomeOffer.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeOffer() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Contenido Principal */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 text-center pt-20 pb-10">
        {/* Icono o Imagen Grande */}
        <div className="text-8xl mb-6">
          🚗
        </div>

        {/* Título Gancho */}
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Empieza <span className="text-blue-600">Gratis</span>.
          <br />
          Gestiona tu primer vehículo.
        </h1>

        {/* Subtítulo Explicativo */}
        <p className="mt-6 text-xl text-gray-600 max-w-md mx-auto">
          Sin coste, para siempre. Mantén el control total del mantenimiento de tu coche.
        </p>

        {/* Botón de Acción Principal (Lleva al Login/Registro) */}
        <button
          onClick={() => navigate('/login')}
          className="mt-10 w-full max-w-sm py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
        >
          Probar ahora gratis
        </button>

        {/* Enlace secundario */}
        <p className="mt-6 text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Inicia sesión
          </button>
        </p>
      </div>

      {/* Sección Inferior: Mención a los Planes de Pago */}
      <div className="bg-gray-50 py-6 px-4 text-center border-t border-gray-100">
        <p className="text-sm text-gray-600">
          ¿Necesitas más? Descubre nuestros planes
          <span className="font-bold text-gray-900"> Home </span> y
          <span className="font-bold text-gray-900"> Familiar </span>
          una vez dentro.
        </p>
      </div>
    </div>
  );
}
