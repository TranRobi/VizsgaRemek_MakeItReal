import React, { useContext, useState } from "react";

import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
function ProfileNav({ setActiveTab }) {
  const { user, setUser, storedUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(!user);
    axios
      .post(
        "/api/logout",
        {
          LOGIN_TOKEN: storedUser,
        },
        {
          headers: { "content-type": "application/x-www-form-urlencoded" },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setUser(false);
          localStorage.clear();
          console.log("Sikeres kijelentkezés " + user);
        } else {
          console.log("Nem sikerült kijelentkezni: " + response.data.error);
        }
      });

    navigate("/");
  };
  return (
    <ul className="w-full md:w-fit bg-neutral-900 text-white h-fit md:h-full p-2 flex-col justify-between text-center">
      <div className="flex items-center justify-between ">
        <Button
          onClick={() => {
            handleLogout();
          }}
          className="p-2"
          color="error"
          variant="contained"
          sx={{ marginX: "auto" }}
        >
          Log out
        </Button>
      </div>

      <div className={" block "}>
        <li className="mb-2">
          <a
            onClick={() => {
              setActiveTab(1);
            }}
          >
            Delivery-information
          </a>
        </li>
        <li className="mb-2">
          <a
            onClick={() => {
              setActiveTab(2);
            }}
          >
            Order history
          </a>
        </li>
        <li className="mb-2">
          <a
            onClick={() => {
              setActiveTab(3);
            }}
          >
            My models
          </a>
        </li>
        <li className="mb-2">
          <a
            onClick={() => {
              setActiveTab(4);
            }}
          >
            Statistics
          </a>
        </li>
      </div>
    </ul>
  );
}

export default ProfileNav;
