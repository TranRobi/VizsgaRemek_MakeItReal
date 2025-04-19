import React, { useEffect } from "react";

const EmailContext = React.createContext();

const EmailProvider = ({ children }) => {
  const [info, setInfo] = React.useState(() => {
    const infoOrder = localStorage.getItem("orderInfo");
    return infoOrder ? JSON.parse(infoOrder) : [];
  });
  useEffect(() => {
    localStorage.setItem("orderInfo", JSON.stringify(info));
  }, [info]);
  return (
    <EmailContext.Provider value={{ info, setInfo }}>
      {children}
    </EmailContext.Provider>
  );
};

export { EmailContext, EmailProvider };
