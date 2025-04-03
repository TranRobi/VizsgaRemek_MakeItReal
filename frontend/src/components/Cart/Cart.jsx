import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Button } from "@mui/material";
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
      <div className="h-screen w-4/6 items-center mx-auto ">
        <div className="flex justify-between items-center h-fit p-4">
          <h1 className="text-white text-4xl">Your cart</h1>
        </div>
        
        <div className="flex flex-col p-4 text-white ">
          {cartList.length === 0 ? (
            <p>No items found</p>
          ) : (
            cartList.map((cart, index) => {
              return (
                <div
                  key={index}
                  className="flex space-x-4  border-2 p-4 rounded-lg mb-2"
                >
                  <img src="../../image1.png" alt="image of product" className="w-36"/>
                  <h1 className="text-3xl">{cart.name}</h1>
                  <h2 className="text-2xl">{cart.description}</h2>
                  <input
                    type="number"
                    min="1"
                    value={cart.quantity}
                    onChange={(e) => {
                      cartList[index].quantity = parseInt(e.target.value);
                      setCartList([...cartList]);
                    }}
                    className="border p-2 rounded w-16 h-8 text-center"
                  />
                  <Button variant="outlined" color="error" className="h-8" onClick={() => {
                      removeItem(index);
                    }}>
                    Remove
                  </Button>
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
