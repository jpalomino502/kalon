import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-white h-screen shadow-md">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Blog & Courses</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <NavLink 
                to="/admin/blogs"
                className={({ isActive }) => 
                  isActive ? "text-blue-500" : "text-gray-700"
                }
              >
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/courses"
                className={({ isActive }) => 
                  isActive ? "text-blue-500" : "text-gray-700"
                }
              >
                Courses
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
