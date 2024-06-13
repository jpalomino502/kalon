import React, { useState } from 'react';
import { auth, googleProvider, db, storage } from '../../config/firebaseConfig'; // Importamos los servicios de Firebase
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'; // Funciones de autenticación de Firebase
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaGoogle } from 'react-icons/fa';
import { doc, setDoc } from 'firebase/firestore'; // Funciones de Firestore
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Funciones de Storage

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

      // Actualizamos el perfil del usuario con su nombre
      await updateProfile(user, {
        displayName: name
      });

      // Guardamos la fecha de creación del usuario en Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        email: user.email,
        name: name,
        createdAt: user.metadata.creationTime,
        photoURL: ''
      });

      // Navegamos al perfil del usuario
      navigate('/profile');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Subir la foto de perfil a Firebase Storage si está disponible
      if (user.photoURL) {
        const storageRef = ref(storage, `profiles/${user.uid}/profile.jpg`);
        await uploadBytes(storageRef, await fetch(user.photoURL).then(res => res.blob()));
        const photoURL = await getDownloadURL(storageRef);
        
        // Guardamos la fotoURL en Firestore
        await setDoc(doc(db, 'profiles', user.uid), {
          email: user.email,
          name: user.displayName,
          createdAt: user.metadata.creationTime,
          photoURL: photoURL
        });
      } else {
        // Si el usuario no tiene fotoURL, guardamos los datos sin fotoURL
        await setDoc(doc(db, 'profiles', user.uid), {
          email: user.email,
          name: user.displayName,
          createdAt: user.metadata.creationTime,
          photoURL: ''
        });
      }

      // Navegamos al perfil del usuario
      navigate('/profile');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center my-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Registrarse</h2>
        <p className="text-center text-gray-600">Cree una cuenta nueva.</p>
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
          <button type="submit" className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-[#D91604] rounded-md hover:bg-red-700">
            <FaUserPlus className="mr-2" /> Registrarse
          </button>
        </form>
        <button onClick={handleGoogleRegister} className="flex items-center justify-center w-full px-4 py-2 font-bold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <FaGoogle className="text-blue-500 mr-2" /> Registrarse con Google
        </button>
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          <Link to="/login" className="hover:text-black">Iniciar Sesión</Link>
          <span className="text-gray-600">|</span>
          <Link to="/forgot-password" className="hover:text-black">Olvidé mi Contraseña</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
