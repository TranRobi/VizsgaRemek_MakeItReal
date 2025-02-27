import { Modal } from "@mui/material";
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import { useState } from "react";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

import "./Navbar.css";
import { AuthContext } from "../context/AuthContext";
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
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="logo"
            onClick={home}
          />

          <div className="mr-4">
            <ul>
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
                  <NavLink to="/profile">
                    Profile<span></span>
                  </NavLink>
                ) : (
                  <Button onClick={openLogin} variant="contained">
                    Login<span></span>
                  </Button>
                )}
              </li>
              <li>
                <NavLink to="/basket">
                  <ShoppingBasketIcon className="text-6xl m-2 pr-3 text-white hover:text-blue-500 transition" />
                </NavLink>
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
