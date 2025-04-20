import React, { useState, useEffect } from "react";
import { createContext } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  //getting user data from cookie
  const storedUser = document.cookie.split("=");
  //getting user data from local storage
  const userID = localStorage.getItem("userID");
  useEffect(() => {
    //checking if user is logged in or not
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
