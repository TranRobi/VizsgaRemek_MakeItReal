import React, { useEffect } from "react";
import { createContext } from "react";

const BasketContext = createContext();
const BasketProvider = ({ children }) => {
  const [basketList, setBasketList] = React.useState([]);
  return (
    <BasketContext.Provider value={{ basketList, setBasketList }}>
      {children}
    </BasketContext.Provider>
  );
};

export { BasketContext, BasketProvider };
