import React, { useState } from 'react';
import { auth } from '../../config/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import logo from '../../assets/headerBackground2.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Correo de recuperación enviado. Verifique su bandeja de entrada.');
      setError('');
    } catch (error) {
      setError(error.message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl h-auto md:h-full">
        <div className="hidden md:flex md:w-1/2 items-center justify-center rounded-l-2xl overflow-hidden">
          <img src={logo} alt="Logo Kalon" className="object-cover h-full w-full" />
        </div>
        <div className="flex flex-col justify-center p-8 md:w-1/2">
          <h2 className="text-3xl font-bold text-center text-black">Olvidé mi Contraseña</h2>
          <p className="text-center text-gray-600 mb-6">Ingrese su correo electrónico para recuperar su contraseña.</p>
          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 md:space-y-6">
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
          <div className="flex justify-center mt-6 text-sm text-gray-600">
            <Link to="/login" className="hover:underline">Iniciar Sesión</Link>
            <span className="mx-2 text-gray-600">|</span>
            <Link to="/register" className="hover:underline">Registrarse</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
