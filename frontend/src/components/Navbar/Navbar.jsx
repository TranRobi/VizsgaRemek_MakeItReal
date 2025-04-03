import { Modal } from "@mui/material";
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Badge, { badgeClasses } from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";

import "./Navbar.css";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
function Navbar() {
  const { cartList } = useContext(CartContext);
  const [isOpened, setIsOpened] = useState(false);
  const [isOpenedRegister, setIsOpenedRegister] = useState(false);
  const navigate = useNavigate();
  const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
      top: -12px;
      right: -6px;
    }
  `;
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
          <div className="w-full md:mr-4  flex justify-end ">
            <ul className=" mobile items-center p-2 hidden">
              <li>
                <NavLink to="/aboutus">
                  About us<span></span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/library">
                  Library<span></span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/contactus">
                  Contact us<span></span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/order">
                  Order now<span></span>
                </NavLink>
              </li>

              <li>
                {user ? (
                  <AccountBoxIcon
                    sx={{
                      fontSize: "4xxl",
                      color: "#ff0000",
                      scale: "1",
                      margin: "2px",
                      "&:hover": {
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
                      color: "#ff0000",
                      scale: "1",
                      "&:hover": {
                        scale: "1.2",
                        transition: "ease-in 0.1s",
                        color: "red",
                      },
                    }}
                  />
                )}
                <ShoppingCartIcon
                  sx={{
                    fontSize: "4xxl",
                    color: "#ff0000",
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
                <CartBadge
                  badgeContent={cartList.length}
                  color="error"
                  showZero
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
