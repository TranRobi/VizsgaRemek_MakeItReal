import React, { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

import { useLocation, Outlet, Navigate } from "react-router-dom";

const RequireAuth = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  console.log("RequireAuth: " + user);
  if (user == false) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default RequireAuth;
