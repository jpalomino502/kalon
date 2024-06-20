import React, { useState, useEffect, useRef } from "react";
import { BsTrash } from 'react-icons/bs';

const Cart = ({ cartItems, onClearCart, onCheckout }) => {
  const [expandedItemId, setExpandedItemId] = useState(null);
  const cartRef = useRef(null);

  const toggleExpand = (itemId) => {
    setExpandedItemId(itemId === expandedItemId ? null : itemId);
  };

  const handleDeleteItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    onClearCart(updatedCart);
    setExpandedItemId(null);
  };

  const handleClearCart = () => {
    onClearCart([]);
    setExpandedItemId(null);
  };

  const handleCheckout = () => {
    onCheckout();
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setExpandedItemId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={cartRef} className="bg-white shadow-lg p-4 rounded relative">
      <h2 className="text-lg font-semibold mb-4">Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>No hay elementos en el carrito.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p>COP$ {item.price},00</p>
                  <div className="mt-2">
                    {expandedItemId === item.id && (
                      <>
                        <p>{item.description}</p>
                        <p>Duración: {item.duration} horas</p>
                      </>
                    )}
                    <button
                      className="text-blue-500"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {expandedItemId === item.id ? "Cerrar detalles" : "Ver más detalles"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <BsTrash
                    className="h-5 w-5 text-red-600 cursor-pointer mr-2"
                    onClick={() => handleDeleteItem(item.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <>
          <button
            className="mt-4 w-full bg-white text-black border border-black py-2 rounded hover:bg-gray-200"
            onClick={handleClearCart}
          >
            Vaciar Carrito
          </button>
          <button
            className="mt-2 w-full bg-white text-black border border-black py-2 rounded hover:bg-gray-200"
            onClick={handleCheckout}
          >
            Pagar
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
