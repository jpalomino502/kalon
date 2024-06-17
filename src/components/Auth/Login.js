import React, { useState } from 'react';
import { auth, googleProvider, db } from '../../config/firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import logo from '../../assets/headerBackground.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, 'profiles', user.uid);
      let userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName,
          createdAt: user.metadata.creationTime,
          photoURL: user.photoURL || ''
        });
      }

      navigate('/profile');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl">
        <div className="hidden md:flex md:w-1/2 items-center justify-center rounded-l-2xl overflow-hidden">
          <img src={logo} alt="Logo Kalon" className="object-cover h-full w-full" />
        </div>
        <div className="flex flex-col p-8 md:w-1/2">
          <h2 className="text-3xl font-bold text-center text-black">Iniciar Sesión</h2>
          <p className="text-center text-gray-600 mb-6">¡Bienvenido de nuevo!</p>
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
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
            <div className="flex justify-between items-center">
              <Link to="/forgot-password" className="text-sm text-black hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
            <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-gray-800">
              Iniciar Sesión
            </button>
          </form>
          <div className="flex justify-center items-center my-4">
            <span className="text-gray-600">o continuar con</span>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full px-4 py-2 font-bold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <FaGoogle className="mr-2" /> Google
            </button>
          </div>
          <div className="flex justify-center mt-6 text-sm text-gray-600">
            <Link to="/register" className="hover:underline">Regístrate gratis</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
