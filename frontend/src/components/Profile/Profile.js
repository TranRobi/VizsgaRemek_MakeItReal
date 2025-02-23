import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { Button } from "@mui/material";

import "./Profile.css";
import Footer from "../Footer/Footer";
import Delivery from "../Delivery/Delivery";
import MyOrders from "../MyOrders/MyOrders";
import MyModels from "../MyModels/MyModels";
import Statistics from "../Statistics/Statistics";
function Profile() {
  const { user, setUser, storedUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(!user);
    axios.post(
      "/api/logout",
      {
        LOGIN_TOKEN: storedUser,
      },
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      }
    );

    navigate("/");
  };

  return (
    <div className="h-screen w-full bg-white">
      <Navbar />
      <div className=" flex">
        <div className="h-screen w-full bg-white">
          <Delivery />
          <MyOrders />
          <MyModels />
          <Statistics />
          <Button
            onClick={() => {
              handleLogout();
            }}
            className="p-2"
            color="error"
            variant="contained"
          >
            Log out
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
