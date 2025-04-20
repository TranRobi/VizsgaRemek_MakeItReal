import React, { useContext } from "react";

import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
function ProfileNav({ setActiveTab }) {
  //getting user data from context
  const { user, setUser, storedUser } = useContext(AuthContext);
  //navitagtion hook
  const navigate = useNavigate();
  //handle logout function
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
  //delete account function
  const deleteAccount = () => {
    axios
      .delete("/api/user", {
        Cookie: document.cookie,
      })
      .then((res) => {
        if (res.status === 204) {
          console.log("asd");
          localStorage.clear();
          location.reload();
        }
      });
  };
  return (
    <ul className=" w-full md:w-fit bg-neutral-900 text-white h-fit md:h-full p-2 flex-col justify-between text-center">
      <div className="flex flex-col gap-2 items-center justify-between ">
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
        <Button
          onClick={() => {
            deleteAccount();
          }}
          className="p-2"
          color="error"
          variant="contained"
          sx={{ marginX: "auto", fontSize: "15px", width: "fit-content" }}
        >
          Delete Account
        </Button>
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
      </div>
    </ul>
  );
}

export default ProfileNav;
