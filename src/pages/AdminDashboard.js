import React from 'react';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminTabs from '../components/Admin/AdminTabs';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <AdminTabs />
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
