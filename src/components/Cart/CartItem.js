import React from 'react';

const CartItem = ({ item }) => {
  // Lógica para mostrar un elemento individual del carrito
  return (
    <div className="cart-item">
      <h3>{item.title}</h3>
      <p>Precio: </p>
      {/* Otras detalles del elemento del carrito */}
    </div>
  );
};

export default CartItem;
