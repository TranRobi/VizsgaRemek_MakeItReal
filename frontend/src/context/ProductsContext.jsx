import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const ProductsContext = createContext();

const ProductsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  function getHistory() {
    if (user) {
      axios
        .get("/api/order-history", {
          Cookie: document.cookie,
        })
        .then((response) => {
          setOrders(response.data);
        });
    }
  }

  function getProducts() {
    axios
      .get("/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function addProduct(formData) {
    axios
      .post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        Cookie: document.cookie,
      })
      .then((response) => {
        getProducts();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function modifyProducts() {
    getProducts();
  }
  function deleteProduct() {
    getProducts();
  }

  useEffect(() => {
    getHistory();
    getProducts();
  }, []);
  return (
    <ProductsContext.Provider value={{ products, addProduct, orders }}>
      {children}
    </ProductsContext.Provider>
  );
};

export { ProductsProvider, ProductsContext };
