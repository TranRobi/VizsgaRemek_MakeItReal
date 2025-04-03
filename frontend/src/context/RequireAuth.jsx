import React, { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

import { useLocation, Outlet, Navigate } from "react-router-dom";

const RequireAuth = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default RequireAuth;
