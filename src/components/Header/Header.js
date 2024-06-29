import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  BookOpenIcon,
  UserCircleIcon,
  LoginIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";
import { auth } from "../../config/firebaseConfig";
import Cart from "../Cart/Cart"; // Importa el componente del carrito

const Header = ({ cartItems, onClearCart, onCheckout }) => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // Estado para el carrito móvil
  const location = useLocation();
  const navigate = useNavigate();
  const cartRef = useRef(null);

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

  const handleClickOutsideCart = (event) => {
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      setCartOpen(false); // Cierra el carrito cuando se hace clic fuera
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideCart);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCart);
    };
  }, []);

  return (
    <header className="bg-cover bg-center py-2 md:py-3 px-4 md:px-6 shadow md:shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Kalon Musical Academy Logo"
            className="h-12 md:h-16 lg:h-15"
          />
        </Link>
        <nav className="hidden md:flex space-x-6 items-center text-sm lg:text-base text-black">
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
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="flex items-center hover:text-gray-800"
            >
              <ShoppingCartIcon className="h-6 w-6 mr-1 text-black" />
              {cartItems.length > 0 && (
                <span className="bg-red-600 text-white rounded-full px-2 py-1 text-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
            <AnimatePresence>
              {cartOpen && (
                <motion.div
                  ref={cartRef}
                  className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg p-4 rounded"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Cart
                    cartItems={cartItems}
                    onClearCart={onClearCart}
                    onCheckout={onCheckout}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {user ? (
            <ButtonLink
              to="/profile"
              text="Perfil"
              isActive={location.pathname === "/profile"}
            />
          ) : (
            <ButtonLink
              to="/login"
              text="Acceder"
              isActive={location.pathname === "/login"}
            />
          )}
        </nav>
        {/* Menú para móviles */}
        <div className="md:hidden relative z-50 flex items-center gap-4">
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="flex items-center hover:text-gray-800"
          >
            <ShoppingCartIcon className="h-6 w-6 text-black" />
            {cartItems.length > 0 && (
              <span className="bg-red-600 text-white rounded-full px-2 py-1 text-xs">
                {cartItems.length}
              </span>
            )}
          </button>
          <button
            className="focus:outline-none"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <XIcon className="h-8 w-8 text-black" />
            ) : (
              <MenuIcon className="h-8 w-8 text-black" />
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
                  <div className="p-4 text-black">
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
        <AnimatePresence>
          {cartOpen && (
            <motion.div
              ref={cartRef}
              className="fixed top-16 right-0 mt-2 w-80 bg-white shadow-lg p-4 rounded z-50"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Cart
                cartItems={cartItems}
                onClearCart={onClearCart}
                onCheckout={onCheckout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

const NavLink = ({ to, text, isActive }) => (
  <Link to={to} className={`nav-link ${isActive ? "active" : ""}`}>
    {text}
  </Link>
);

const ButtonLink = ({ to, text, isActive }) => (
  <Link
    to={to}
    className={`inline-block py-2 px-4 text-white font-bold hover:bg-gray-200 transition duration-300 ${isActive ? "active" : ""}`}
    style={{ backgroundColor: "#D91604" }}
  >
    {text}
  </Link>
);

const MenuItem = ({ path, text, Icon, onClick, location }) => (
  <motion.button
    className={`flex items-center w-full px-4 py-4 text-lg nav-link cursor-pointer text-left text-black focus:outline-none transition-colors duration-200 hover:bg-gray-100 ${
      location.pathname === path ? "active" : ""
    }`}
    onClick={() => onClick(path)}
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="h-6 w-6 mr-3 text-black" />
    {text}
  </motion.button>
);

export default Header;
