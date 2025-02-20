import React, { useState, useEffect } from "react";
import { createContext } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  useEffect(() => {
    const storedUser = document.cookie.split("=");
    if (storedUser[1]) {
      setUser(true);
    } else {
      setUser(false);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
