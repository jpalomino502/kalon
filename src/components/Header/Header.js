import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { MenuIcon, XIcon, SearchIcon } from "@heroicons/react/outline";
import logo from '../../assets/logo.svg';
import { auth } from '../../config/firebaseConfig';

const Header = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="WebNova Logo" className="h-10 mr-3" />
          <span className="text-2xl font-bold">WebNova</span>
        </Link>
        <nav className="hidden md:flex space-x-6 items-center">
          <NavLink to="/" className="nav-link" activeClassName="active" exact>
            Inicio
          </NavLink>
          <NavLink to="/courses" className="nav-link" activeClassName="active">
            Cursos
          </NavLink>
          <NavLink to="/blog" className="nav-link" activeClassName="active">
            Blog
          </NavLink>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar" 
              className="p-2 pl-10 rounded-md text-black"
            />
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
          </div>
          {user ? (
            <NavLink to="/profile" className="nav-link" activeClassName="active">
              Perfil
            </NavLink>
          ) : (
            <NavLink to="/login" className="nav-link" activeClassName="active">
              Acceder
            </NavLink>
          )}
        </nav>
        <Menu 
          as="div" 
          className="md:hidden relative z-50" 
          onClose={() => setOpen(false)} // Cerrar el menú después de la navegación
        >
          <Menu.Button className="focus:outline-none" onClick={() => setOpen(!open)}>
            {open ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </Menu.Button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md">
              <Menu.Item>
                {({ active }) => (
                  <NavLink
                    to="/"
                    className={`block px-4 py-2 text-sm nav-link ${
                      active ? "font-bold text-black" : ""
                    }`}
                    activeClassName="active"
                    onClick={closeMenu}
                  >
                    Inicio
                  </NavLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <NavLink
                    to="/courses"
                    className={`block px-4 py-2 text-sm nav-link ${
                      active ? "font-bold text-black" : ""
                    }`}
                    activeClassName="active"
                    onClick={closeMenu}
                  >
                    Cursos
                  </NavLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <NavLink
                    to="/blog"
                    className={`block px-4 py-2 text-sm nav-link ${
                      active ? "font-bold text-black" : ""
                    }`}
                    activeClassName="active"
                    onClick={closeMenu}
                  >
                    Blog
                  </NavLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <NavLink
                    to={user ? "/profile" : "/login"}
                    className={`block px-4 py-2 text-sm nav-link ${
                      active ? "font-bold text-black" : ""
                    }`}
                    activeClassName="active"
                    onClick={closeMenu}
                  >
                    {user ? "Perfil" : "Acceder"}
                  </NavLink>
                )}
              </Menu.Item>
            </div>
          )}
        </Menu>
      </div>
    </header>
  );
};

export default Header;
