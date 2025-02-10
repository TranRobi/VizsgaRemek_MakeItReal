import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import "./Product.css";
import Button from '@mui/material/Button';


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
      <div>
        <Button variant="outlined" className="h-fit"><NavLink to="/library"></NavLink></Button>
        <Button variant="outlined" className="h-fit" onClick={() => 
          {
            addToBasket();
          }}>Add to basket</Button>
      </div>  
      <div className="w-[800px] m-auto h-screen flex">
        
        <div id="images">
          <img src="/image1.png"/>
        </div>
        <div>
          <h2 id="productName">A {product.name}</h2>
          <p id="desc">{product.description}</p>
        </div>
        

      </div>
      

      <Footer />
    </>
  );
}

export default Prouduct;
