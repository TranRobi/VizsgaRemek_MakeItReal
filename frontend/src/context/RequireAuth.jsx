import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

import { useLocation, Outlet, Navigate } from "react-router-dom";

const RequireAuth = () => {
  const { user } = useContext(AuthContext);
  if (user == false) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default RequireAuth;
