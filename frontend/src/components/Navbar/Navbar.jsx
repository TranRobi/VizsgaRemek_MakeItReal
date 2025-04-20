import { Modal, useMediaQuery } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
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
  //getting the informations from the Contexts
  const { cartList } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  //declaring states
  const [isNavbarMenu, setIsNavbarMenu] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const [isOpenedRegister, setIsOpenedRegister] = useState(false);
  //navigation function
  const navigate = useNavigate();
  //media query for responsive design
  const media = useMediaQuery("(min-width:766px)");

  const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
      top: -12px;
      right: -6px;
    }
  `;

  useEffect(() => {
    media ? setIsNavbarMenu(false) : setIsNavbarMenu(true);
  }, [media]);

  //closing and opening the login modal
  const openLogin = (e) => {
    e.preventDefault();
    setIsOpened(true);
  };
  const closeLogin = (e) => {
    e.preventDefault();
    setIsOpened(false);
  };
  //closing and opening the register modal
  const openRegister = (e) => {
    e.preventDefault();
    setIsOpenedRegister(true);
  };
  const closeRegister = (e) => {
    e.preventDefault();
    setIsOpenedRegister(false);
  };
  //navigating to the home page
  const home = () => {
    navigate("/");
  };
  return (
    <>
      <div>
        <nav className="h-fit">
          <img
            className="logo"
            src="../../logo2.svg"
            alt="logo"
            onClick={home}
          />
          <div className="w-full md:mr-4  flex flex-col md:justify-end md:flex-row">
            <div>
              <MenuIcon
                sx={{ color: "red", display: media ? "none" : "block" }}
                onClick={() => {
                  setIsNavbarMenu(!isNavbarMenu);
                }}
              />
            </div>
            <div className={isNavbarMenu ? "hidden" : "block"}>
              <ul className="flex-col md:flex-row">
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
                    Custom order<span></span>
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
