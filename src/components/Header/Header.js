import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { MenuIcon, XIcon, SearchIcon } from "@heroicons/react/outline";
import logo from "../../assets/logo.png";
import { auth } from "../../config/firebaseConfig";

const Header = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigation = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-white text-black shadow-md">
      <div className="container mx-auto flex justify-between items-center py-2">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Kalon Musical Academy Logo" className="h-16 ml-3 mr-3 lg:ml-4" />
        </Link>
        <nav className="hidden md:flex space-x-6 items-center">
          <NavLink to="/" text="Inicio" isActive={location.pathname === "/"} />
          <NavLink to="/courses" text="Cursos" isActive={location.pathname === "/courses"} />
          <NavLink to="/blog" text="Blog" isActive={location.pathname === "/blog"} />
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              className="p-2 pl-10 rounded-md text-black border border-gray-400"
            />
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
          </div>
          {user ? (
            <NavLink to="/profile" text="Perfil" isActive={location.pathname === "/profile"} />
          ) : (
            <NavLink to="/login" text="Acceder" isActive={location.pathname === "/login"} />
          )}
        </nav>

        <Menu as="div" className="md:hidden relative z-50">
          <Menu.Button className="focus:outline-none mr-4" onClick={() => setOpen(!open)}>
            {open ? (
              <XIcon className="h-8 w-8" />
            ) : (
              <MenuIcon className="h-8 w-8" />
            )}
          </Menu.Button>
          {open && (
            <div className="absolute right-4 mt-2 w-48 bg-white text-black shadow-lg rounded-md">
              <MenuItem path="/" text="Inicio" onClick={handleNavigation} location={location} />
              <MenuItem path="/courses" text="Cursos" onClick={handleNavigation} location={location} />
              <MenuItem path="/blog" text="Blog" onClick={handleNavigation} location={location} />
              <MenuItem
                path={user ? "/profile" : "/login"}
                text={user ? "Perfil" : "Acceder"}
                onClick={handleNavigation}
                location={location}
              />
            </div>
          )}
        </Menu>
      </div>
    </header>
  );
};

const NavLink = ({ to, text, isActive }) => (
  <Link
    to={to}
    className={`nav-link ${isActive ? "active" : ""}`}
  >
    {text}
  </Link>
);

const MenuItem = ({ path, text, onClick, location }) => (
  <button
    className={`block w-full px-4 py-2 text-sm nav-link cursor-pointer text-left focus:outline-none ${location.pathname === path ? "active" : ""}`}
    onClick={() => onClick(path)}
  >
    {text}
  </button>
);

export default Header;
