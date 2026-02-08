// src/screens/Login.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('¡Revisa tu correo! Te hemos enviado un enlace mágico.');
    }
    setLoading(false);
  };

  return (
    // Fondo claro y diseño limpio sin contenedor tipo "caja"
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-sm text-center">
        {/* Título y subtítulo minimalistas */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Car Care <span className="text-blue-600">App</span>
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Tu garaje, bajo control.
        </p>
        
        <form onSubmit={handleLogin} className="mt-10 space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600 transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-white font-bold rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 disabled:opacity-70 text-lg"
          >
            {loading ? 'Enviando...' : 'Continuar con Email'}
          </button>
        </form>

        {/* Botón para volver a la pantalla de bienvenida */}
        <button 
            onClick={() => navigate('/')}
            className="mt-8 text-sm text-gray-500 hover:text-gray-700 transition"
        >
            ← Volver al inicio
        </button>
      </div>
    </div>
  );
}
