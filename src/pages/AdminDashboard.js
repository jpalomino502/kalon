// src/pages/AdminDashboard.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { userRole } = useAuth();

  // Verifica si el usuario no es un administrador
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Manage Courses</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <a href="/admin/course/new">Create New Course</a>
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Manage Blogs</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <a href="/admin/blog/new">Create New Blog Post</a>
          </button>
        </div>
        {/* Añade más secciones según sea necesario */}
      </div>
    </div>
  );
};

export default AdminDashboard;
