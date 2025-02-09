import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

import { NavLink } from "react-router-dom";
import { BasketContext } from "../../components/context/BasketContext";

function Prouduct() {
  const { basket, setBasket } = useContext(BasketContext);
  const [prodInfo, setProdInfo] = useState({
    id: 0,
    title: "",
    price: 0,
    quantity: 0,
  });
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
    setProdInfo({
      id: parseInt(product.id),
      title: product.title,
      price: parseInt(product.price),
      quantity: 1,
    });
    setBasket((prev) => {
      return [...prev, prodInfo];
    });
  }
  return (
    <>
      <Navbar />
      <div className="w-[500px] m-auto">
        <h1>Prouduct id: {params.id}</h1>
        <h2>A {product.name}</h2>
        <p>Price: {product.description}</p>
        <NavLink to="/library">Go Back</NavLink>
        <button
          onClick={() => {
            addToBasket();
          }}
        >
          Add to basket
        </button>
      </div>
      <Footer />
    </>
  );
}

export default Prouduct;
