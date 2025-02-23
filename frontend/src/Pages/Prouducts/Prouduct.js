import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import "./Product.css";
import Button from "@mui/material/Button";

import { NavLink } from "react-router-dom";
import { BasketContext } from "../../components/context/BasketContext";
import { TextField } from "@mui/material";

function Prouduct() {
  const { basketList, setBasketList } = useContext(BasketContext);

  const [quantity, setQuantity] = useState([]);

  const params = useParams();
  const [product, setProduct] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/products/${params.id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function addToBasket() {
    const item = {
      id: product.id,
      name: product.name,
      quantity: quantity,
    };
    setBasketList([...basketList, item]);
    // localStorage.setItem("basketList", JSON.stringify(basketList));
    // console.log(localStorage.getItem("basketList"));
  }
  return (
    <>
      <Navbar />

      <div className="w-[800px] m-auto h-screen flex">
        <div id="images">
          <img src="/image1.png" />
        </div>
        <div>
          <div>
            <h2 id="productName">A {product.name}</h2>
            <p id="desc">{product.description}</p>
            <p>Quantity: {quantity}</p>
            <TextField
              onChange={(e) => setQuantity(e.target.value)}
            ></TextField>
          </div>
          <div>
            <NavLink to="/library" className="mr-3">
              Back to Library
            </NavLink>

            <Button
              variant="outlined"
              className="h-fit"
              onClick={() => {
                addToBasket();
              }}
            >
              Add to basket
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Prouduct;
