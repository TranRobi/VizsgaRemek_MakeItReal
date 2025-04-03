import React, { useState, useEffect } from "react";
import { createContext } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const storedUser = document.cookie.split("=");
  const userID = localStorage.getItem("userID");
  useEffect(() => {
    console.log("userID: " + userID);
    if (storedUser[1]) {
      setUser(true);
    } else {
      setUser(false);
    }
  }, [storedUser]);
  return (
    <AuthContext.Provider value={{ user, setUser, storedUser, userID }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
