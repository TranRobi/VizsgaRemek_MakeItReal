import React, { useContext, useState } from "react";
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
import ProfileNav from "../ProfileNav/ProfileNav";
function Profile() {
  const [activeTab, setActiveTab] = useState(1);
  const renderComponent = () => {
    switch (activeTab) {
      case 1:
        return <Delivery />;
      case 2:
        return <MyOrders />;
      case 3:
        return <MyModels />;
      case 4:
        return <Statistics />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full ">
      <Navbar />
      <div className=" flex">
        <div className="h-screen w-full ">
          <ProfileNav setActiveTab={setActiveTab} />
          <div>{renderComponent()}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
