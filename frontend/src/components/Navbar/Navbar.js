import { Modal } from "@mui/material";
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import { useState } from "react";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import Basket from "../Basket/Basket";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { BasketContext } from "../context/BasketContext";
import Profile from "../Profile/Profile";

import "./Navbar.css";
import { AuthContext } from "../context/AuthContext";
function Navbar() {
  const { basketList, setBasketList } = useContext(BasketContext);
  const [isOpened, setIsOpened] = useState(false);
  const [isOpenedRegister, setIsOpenedRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [basket, setBasket] = useState(false);

  const { user, setUser } = useContext(AuthContext);
  const openPorfile = (e) => {
    setIsLoggedIn(!isLoggedIn);
  };
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
  function closeBasket() {
    setBasket(!basket);
  }
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
                <ShoppingBasketIcon
                  onClick={() => {
                    setBasket(!basket);
                  }}
                  className="text-6xl m-2 pr-3 text-white hover:text-blue-500 transition"
                />
              </li>
              <li>
                {user ? (
                  <Button onClick={openPorfile} variant="contained">
                    View Profile
                  </Button>
                ) : (
                  <Button onClick={openLogin} variant="contained">
                    Login<span></span>
                  </Button>
                )}
              </li>
            </ul>
          </div>
        </nav>
        <div
          className={
            basket
              ? "w-1/3 h-full absolute top-0 bg-slate-50 bg-opacity-35 right-0 z-10"
              : "w-1/3 h-full absolute top-0 bg-slate-50 bg-opacity-35 right-0 z-10 hidden"
          }
        >
          <Basket close={closeBasket} basketList={basketList} />
        </div>
      </div>
      <Modal open={isLoggedIn}>
        <div className="w-full h-screen flex justify-center items-center">
          <Profile close={openPorfile} />
        </div>
      </Modal>
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
