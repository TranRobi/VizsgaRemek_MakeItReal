import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
function Cart({ cartList, setCartList }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const removeItem = (index) => {
    cartList.splice(index, 1);
    setCartList([...cartList]);
  };

  return (
    <>
      <Navbar />
      <div className="h-screen">
        <div className="flex justify-between items-center h-fit p-4">
          <h1 className="text-black text-4xl">Shopping Cart</h1>
        </div>
        <div className="flex flex-col p-4 text-black ">
          {cartList.length === 0 ? (
            <p>No items found</p>
          ) : (
            cartList.map((cart, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-between w-full p-2 shadow-md"
                >
                  <p>{cart.name + " x" + cart.quantity}</p>
                  <IconButton
                    onClick={() => {
                      removeItem(index);
                    }}
                  >
                    <ClearIcon fontSize="small" color="error" />
                  </IconButton>
                </div>
              );
            })
          )}
          <Button
            className="w-fit"
            sx={{ marginTop: "10px" }}
            variant="contained"
            color="success"
            onClick={() => {
              if (user) {
                navigate("/payment");
              } else {
                navigate("/order");
              }
            }}
          >
            Checkout
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Cart;
