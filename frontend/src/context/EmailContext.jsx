import React, { useEffect } from "react";

const EmailContext = React.createContext();

const EmailProvider = ({ children }) => {
  // State to hold the email information
  const [info, setInfo] = React.useState(() => {
    const infoOrder = localStorage.getItem("orderInfo");
    return infoOrder ? JSON.parse(infoOrder) : [];
  });
  useEffect(() => {
    // Update local storage whenever info changes
    localStorage.setItem("orderInfo", JSON.stringify(info));
  }, [info]);
  return (
    <EmailContext.Provider value={{ info, setInfo }}>
      {children}
    </EmailContext.Provider>
  );
};

export { EmailContext, EmailProvider };
