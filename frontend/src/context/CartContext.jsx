import React, { useEffect } from "react";
import { createContext } from "react";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cartList, setCartList] = React.useState([]);
  const storedCart = localStorage.getItem("cart");

  useEffect(() => {
    if (storedCart) {
      setCartList(JSON.parse(storedCart));
    } else {
      localStorage.setItem("cart", JSON.stringify(cartList));
    }
  }, [storedCart]);

  return (
    <CartContext.Provider value={{ cartList, setCartList }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
