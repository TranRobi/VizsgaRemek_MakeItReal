import { Modal } from "@mui/material";
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import { useState } from "react";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import "./Navbar.css";
import { AuthContext } from "../../context/AuthContext";
function Navbar() {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpenedRegister, setIsOpenedRegister] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const closeLogin = (e) => {
    e.preventDefault();
    setIsOpened(false);
  };
  const closeRegister = (e) => {
    e.preventDefault();
    setIsOpenedRegister(false);
  };
  const openLogin = (e) => {
    e.preventDefault();
    setIsOpened(true);
  };
  const openRegister = (e) => {
    e.preventDefault();
    setIsOpenedRegister(true);
  };

  const home = () => {
    navigate("/");
  };
  return (
    <>
      <div>
        <nav className="h-fit">
          <img
            className="logo"
            src="../../logo.png"
            alt="logo"
            onClick={home}
          />
          <div className="mr-4">
            <ul className="items-center mobile">
              <li>
                <NavLink to="/library">
                  Library<span></span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/aboutus">
                  About us<span></span>
                </NavLink>
              </li>
              <li>
                {user ? (
                  <AccountBoxIcon
                    sx={{
                      fontSize: "4xxl",
                      color: "#212121",
                      ":hover": {
                        scale: "1.2",
                        transition: "ease-in 0.1s",
                        color: "red",
                      },
                    }}
                    onClick={() => {
                      navigate("/profile");
                    }}
                  />
                ) : (
                  <LoginIcon
                    onClick={openLogin}
                    sx={{
                      fontSize: "4xxl",
                      color: "#212121",
                      scale: "1",
                      "&:hover": {
                        scale: "1.2",
                        transition: "ease-in 0.1s",
                        color: "red",
                      },
                    }}
                  />
                )}
              </li>
              <li>
                <ShoppingCartIcon
                  sx={{
                    fontSize: "4xxl",
                    color: "#212121",
                    marginLeft: "20px",
                    ":hover": {
                      scale: "1.2",
                      transition: "ease-in 0.1s",
                      color: "red",
                    },
                  }}
                  onClick={() => {
                    navigate("/cart");
                  }}
                />
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <Modal open={isOpened}>
        <div>
          <Login close={closeLogin} open={openRegister} />
        </div>
      </Modal>
      <Modal open={isOpenedRegister}>
        <div>
          <Register close={closeRegister} open={openLogin} />
        </div>
      </Modal>
    </>
  );
}

export default Navbar;
