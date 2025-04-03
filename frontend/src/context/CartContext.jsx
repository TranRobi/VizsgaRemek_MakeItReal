import React, { useEffect } from "react";
import { createContext } from "react";

const CartContext = createContext();
const CartProvider = ({ children }) => {
	const [cartList, setCartList] = React.useState([]);
	useEffect(() => {}, []);
	return (
		<CartContext.Provider value={{ cartList, setCartList }}>
			{children}
		</CartContext.Provider>
	);
};

export { CartContext, CartProvider };
