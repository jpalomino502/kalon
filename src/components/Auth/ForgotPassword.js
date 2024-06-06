// ForgotPassword.js
import React, { useState } from 'react';
import { auth } from '../../config/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Correo de recuperación enviado. Verifique su       bandeja de entrada.');
      setError('');
    } catch (error) {
      setError(error.message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Olvidé mi Contraseña</h2>
        <p className="text-center text-gray-600">Ingrese su correo electrónico para recuperar su contraseña.</p>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
          />
          <button type="submit" className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black">
            <FaEnvelope className="mr-2" /> Enviar Correo de Recuperación
          </button>
        </form>
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          <Link to="/login" className="hover:text-black">Iniciar Sesión</Link>
          <span className="text-gray-600">|</span>
          <Link to="/register" className="hover:text-black">Registrarse</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

