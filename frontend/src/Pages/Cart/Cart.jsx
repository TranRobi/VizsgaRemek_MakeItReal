import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { CartContext } from "../../context/CartContext";
import axios from "axios";

function Cart() {
  const {
    cartList,
    setCartList,
    setProductItems,
    productItems,
    prices,
    setPrices,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Set loading to false initially

  // Remove item from the cart
  const removeItem = (index) => {
    cartList.splice(index, 1);
    productItems.splice(index, 1);
    prices.splice(index, 1);
    setCartList([...cartList]);
    setProductItems([...productItems]);
    setPrices[[...prices]];
    localStorage.setItem("cart", JSON.stringify(cartList));
    localStorage.setItem("items", JSON.stringify(productItems));
    localStorage.setItem("prices", JSON.stringify(prices));
  };

  // Fetch prices from the backend
  async function getPrices(items) {
    try {
      const response = await axios.put("/api/checkout", items, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setPrices(response.data); // Set the fetched prices data
      localStorage.setItem("prices", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  }

  // Perform the checkout process
  const calc = async () => {
    const items = [];
    cartList.forEach((element) => {
      const item = {
        id: element.id,
        material: element.material,
        quantity: element.quantity,
      };
      items.push(item);
    });

    // Set loading state to true before fetching prices
    setLoading(true);

    // Fetch prices from backend
    await getPrices(items);

    localStorage.setItem("items", JSON.stringify(items));

    // Redirect to the payment page after prices are fetched
    navigate("/payment");

    // Set loading to false after everything is completed
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[100vh] w-full md:w-2/5 items-center mx-auto">
        {/* Show loading spinner for the entire page only after the "Checkout" button is clicked */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[100vh]">
            <CircularProgress color="error" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center h-fit p-4">
              <Typography variant="h4" className="text-white">
                Your Cart
              </Typography>
            </div>
            <div className="flex flex-col p-4 text-white">
              {cartList.length === 0 ? (
                <p>No items found</p>
              ) : (
                cartList.map((cart, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row border-2 p-4 rounded-lg mb-2 w-full justify-between"
                    >
                      <img
                        src={`/api/products/images/${cart.id}`}
                        alt="image of product"
                        className="w-1/3"
                      />
                      <div className="w-3/5">
                        <div className="">
                          <Typography variant="h6" className="text-3xl">
                            {cart.name}
                          </Typography>
                          <p className="text-left w-full md:w-3/4 p-1">
                            {cart.description}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <input
                            type="number"
                            min="1"
                            value={cart.quantity}
                            onChange={(e) => {
                              cartList[index].quantity = parseInt(
                                e.target.value
                              );
                              setCartList([...cartList]);
                            }}
                            className="border p-2 rounded w-full md:w-2/3 h-8 text-center mb-3"
                          />
                          <Button
                            variant="outlined"
                            color="error"
                            className="h-8 w-full md:w-2/3"
                            onClick={() => {
                              removeItem(index);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Show the "Checkout" button */}
              <Button
                className="w-fit"
                sx={{ marginTop: "10px" }}
                variant="contained"
                color="success"
                onClick={() => {
                  calc(); // Trigger the checkout process
                }}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Cart;
