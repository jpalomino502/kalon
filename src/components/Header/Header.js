import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MenuIcon,
  XIcon,
  SearchIcon,
  HomeIcon,
  BookOpenIcon,
  UserCircleIcon,
  LoginIcon,
} from "@heroicons/react/outline";
import { motion, AnimatePresence } from "framer-motion";
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
    <header className="bg-cover bg-center py-2 md:py-3 px-4 md:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Kalon Musical Academy Logo"
            className="h-12 md:h-16 lg:h-15"
          />
        </Link>
        <nav className="hidden md:flex space-x-6 items-center text-sm lg:text-base">
          <NavLink to="/" text="Inicio" isActive={location.pathname === "/"} />
          <NavLink
            to="/courses"
            text="Cursos"
            isActive={location.pathname === "/courses"}
          />
          <NavLink
            to="/blog"
            text="Blog"
            isActive={location.pathname === "/blog"}
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              className="p-2 pl-10 rounded-md text-black border border-gray-400"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {user ? (
            <NavLink
              to="/profile"
              text="Perfil"
              isActive={location.pathname === "/profile"}
            />
          ) : (
            <NavLink
              to="/login"
              text="Acceder"
              isActive={location.pathname === "/login"}
            />
          )}
        </nav>

        <div className="md:hidden relative z-50">
          <button
            className="focus:outline-none mr-4"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <XIcon className="h-8 w-8" />
            ) : (
              <MenuIcon className="h-8 w-8" style={{ fontWeight: 'normal' }} />
            )}
          </button>
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  className="fixed inset-0 z-40 bg-black bg-opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  className="fixed top-0 right-0 h-full w-64 bg-white border-l border-black z-50"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4">
                    <MenuItem
                      path="/"
                      text="Inicio"
                      Icon={HomeIcon}
                      onClick={handleNavigation}
                      location={location}
                    />
                    <MenuItem
                      path="/courses"
                      text="Cursos"
                      Icon={BookOpenIcon}
                      onClick={handleNavigation}
                      location={location}
                    />
                    <MenuItem
                      path="/blog"
                      text="Blog"
                      Icon={BookOpenIcon}
                      onClick={handleNavigation}
                      location={location}
                    />
                    <MenuItem
                      path={user ? "/profile" : "/login"}
                      text={user ? "Perfil" : "Acceder"}
                      Icon={user ? UserCircleIcon : LoginIcon}
                      onClick={handleNavigation}
                      location={location}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, text, isActive }) => (
  <Link to={to} className={`nav-link ${isActive ? "active" : ""}`}>
    {text}
  </Link>
);

const MenuItem = ({ path, text, Icon, onClick, location }) => (
  <button
    className={`flex items-center w-full px-4 py-4 text-lg nav-link cursor-pointer text-left focus:outline-none transition-colors duration-200 hover:bg-gray-100 ${
      location.pathname === path ? "active" : ""
    }`}
    onClick={() => onClick(path)}
  >
    <Icon className="h-6 w-6 mr-3 text-gray-500" />
    {text}
  </button>
);

export default Header;
