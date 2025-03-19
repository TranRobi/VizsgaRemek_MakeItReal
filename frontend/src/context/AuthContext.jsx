import React, { useState, useEffect } from "react";
import { createContext } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const storedUser = document.cookie.split("=");
  useEffect(() => {
    if (storedUser[1]) {
      setUser(true);
    } else {
      setUser(false);
    }
  }, [storedUser]);
  return (
    <AuthContext.Provider value={{ user, setUser, storedUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
