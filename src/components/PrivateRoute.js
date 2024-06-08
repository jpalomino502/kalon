// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ redirectPath = '/login' }) => {
  const { currentUser, userRole } = useAuth();

  // Verifica si el usuario no está autenticado o no es un administrador
  if (!currentUser || userRole !== 'admin') {
    return <Navigate to={redirectPath} replace />;
  }

  // Si el usuario es un administrador, renderiza la ruta protegida
  return <Outlet />;
};

export default PrivateRoute;
