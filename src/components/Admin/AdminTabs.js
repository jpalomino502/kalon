import React from 'react';
import { useLocation } from 'react-router-dom';

const AdminTabs = () => {
  const location = useLocation();

  const showGeneralInfo = !['/admin/blogs', '/admin/courses'].includes(location.pathname);

  return (
    <div className="border-b pb-2">
      {showGeneralInfo && (
        <div className="text-gray-700">
          <h2 className="text-xl font-bold mb-4">Bienvenido al Panel de Administración</h2>
          <p>Aquí puede gestionar su blog y cursos. Seleccione una de las opciones en el menú para comenzar.</p>
        </div>
      )}
    </div>
  );
};

export default AdminTabs;
