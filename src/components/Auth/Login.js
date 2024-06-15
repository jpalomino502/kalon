import React, { useState } from 'react';
import { auth, googleProvider, db } from '../../config/firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaGoogle } from 'react-icons/fa';

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

      // Si no existe el documento del usuario, crear uno nuevo
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName,
          createdAt: user.metadata.creationTime,
          photoURL: user.photoURL || ''
        });

        // Volver a obtener el documento después de la creación
        userDoc = await getDoc(userDocRef);
      }

      // Verificar si el documento se creó correctamente
      if (userDoc.exists()) {
        console.log('User logged in and document created/checked:', user.uid);
        navigate('/profile');
      } else {
        console.error('Error: User document not created.');
        setError('Error: User document not created.');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        navigate('/register'); // Redirigir al registro si no se encuentra el usuario
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center my-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
        <p className="text-center text-gray-600">Ingrese sus credenciales para acceder a su cuenta.</p>
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
          <button type="submit" className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-[#D91604] text-white rounded-md hover:bg-red-700">
            <FaSignInAlt className="mr-2" /> Iniciar Sesión
          </button>
        </form>
        <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full px-4 py-2 font-bold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <FaGoogle className="text-blue-500 mr-2" /> Iniciar sesión con Google
        </button>
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          <Link to="/register" className="hover:text-black">Registrarse</Link>
          <span className="text-gray-600">|</span>
          <Link to="/forgot-password" className="hover:text-black">Olvidé mi Contraseña</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
