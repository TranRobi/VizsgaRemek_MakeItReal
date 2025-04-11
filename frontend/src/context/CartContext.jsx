import React, { useEffect } from "react";
import { createContext } from "react";

const CartContext = createContext();
const CartProvider = ({ children }) => {
  const [cartList, setCartList] = React.useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [productItems, setProductItems] = React.useState(() => {
    const storedItems = localStorage.getItem("items");
    return storedItems ? JSON.parse(storedItems) : [];
  });



  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartList));
    localStorage.setItem("items", JSON.stringify(productItems));
  }, [cartList]);

  return (
    <CartContext.Provider
      value={{
        cartList,
        setCartList,
        setProductItems,
        productItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
