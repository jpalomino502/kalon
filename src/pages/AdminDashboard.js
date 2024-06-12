import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { userRole } = useAuth();

  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-black mb-6">Panel de Administración</h1>
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-black mb-2">Gestionar Cursos</h2>
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
            <a href="/admin/course/new">Crear Nuevo Curso</a>
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-2xl font-semibold text-black mb-2">Gestionar Blogs</h2>
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
            <a href="/admin/blog/new">Crear Nuevo Blog</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
