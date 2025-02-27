import React, { useContext } from "react";

import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
function ProfileNav({ setActiveTab }) {
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
    setUser(false);
    navigate("/");
  };
  return (
    <div>
      <ul className="flex w-3/4 justify-between m-auto bg-neutral-900 text-white h-fit p-2 border rounded items-center">
        <li>
          <a
            onClick={() => {
              setActiveTab(1);
            }}
          >
            Delivery-information
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setActiveTab(2);
            }}
          >
            Order history
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setActiveTab(3);
            }}
          >
            My models
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setActiveTab(4);
            }}
          >
            Statistics
          </a>
        </li>
        <li className="justify-end">
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
        </li>
      </ul>
    </div>
  );
}

export default ProfileNav;
