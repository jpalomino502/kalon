import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
        {user && <p className="text-lg mb-4">¡Hola, {user.displayName || 'Usuario'}!</p>}
        <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600" onClick={handleSignOut}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Profile;
