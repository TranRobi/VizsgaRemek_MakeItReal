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

  const [prices, setPrices] = React.useState(() => {
    const storedPrices = localStorage.getItem("prices");
    return storedPrices ? JSON.parse(storedPrices) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartList));
    localStorage.setItem("items", JSON.stringify(productItems));
    localStorage.setItem("prices", JSON.stringify(prices));
  }, [cartList]);

  return (
    <CartContext.Provider
      value={{
        cartList,
        setCartList,
        setProductItems,
        productItems,
        prices,
        setPrices,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
