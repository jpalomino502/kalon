// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Crear un contexto de autenticación
const AuthContext = createContext();

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscribirse al estado de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Obtener el rol del usuario desde Firestore
        const roleDoc = await getDoc(doc(db, 'roles', user.uid));
        if (roleDoc.exists()) {
          setUserRole(roleDoc.data().role);
        } else {
          // Si no hay un rol, dejar el userRole como null
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    // Limpiar la suscripción al desmontar el componente
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
