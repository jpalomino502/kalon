import React, { useState } from 'react';
import { auth, googleProvider, db, storage } from '../../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaGoogle } from 'react-icons/fa';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import logo from '../../assets/headerBackground1.jpg'; // Asegúrate de importar correctamente tu logo

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name
      });

      await setDoc(doc(db, 'profiles', user.uid), {
        email: user.email,
        name: name,
        createdAt: user.metadata.creationTime,
        photoURL: ''
      });

      navigate('/profile');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user.photoURL) {
        const storageRef = ref(storage, `profiles/${user.uid}/profile.jpg`);
        await uploadBytes(storageRef, await fetch(user.photoURL).then(res => res.blob()));
        const photoURL = await getDownloadURL(storageRef);

        await setDoc(doc(db, 'profiles', user.uid), {
          email: user.email,
          name: user.displayName,
          createdAt: user.metadata.creationTime,
          photoURL: photoURL
        });
      } else {
        await setDoc(doc(db, 'profiles', user.uid), {
          email: user.email,
          name: user.displayName,
          createdAt: user.metadata.creationTime,
          photoURL: ''
        });
      }

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
          <h2 className="text-3xl font-bold text-center text-black">Registrarse</h2>
          <p className="text-center text-gray-600 mb-6">Cree una cuenta nueva.</p>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            />
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
            <button type="submit" className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-gray-800">
              <FaUserPlus className="mr-2" /> Registrarse
            </button>
          </form>
          <div className="flex justify-center items-center my-4">
            <span className="text-gray-600">o continuar con</span>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleGoogleRegister} className="flex items-center justify-center w-full px-4 py-2 font-bold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <FaGoogle className="mr-2" /> Google
            </button>
          </div>
          <div className="flex justify-center mt-6 text-sm text-gray-600">
            <Link to="/login" className="hover:underline">Iniciar Sesión</Link>
            <span className="mx-2 text-gray-600">|</span>
            <Link to="/forgot-password" className="hover:underline">Olvidé mi Contraseña</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
