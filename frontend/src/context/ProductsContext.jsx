import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
const ProductsContext = createContext();

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showDelAlert, setShowDelAlert] = useState(false);

  function getHistory() {
    axios
      .get("/api/order-history", {
        Cookie: document.cookie,
      })
      .then((response) => {
        setOrders(response.data);
      });
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
  function deleteProduct(id) {
    axios.delete(`/api/products/${id}`).then((res) => {
      if (res.status === 204) {
        setShowDelAlert(true);
        getProducts();
      } else {
        setShowDelAlert(false);
      }
    });
  }

  useEffect(() => {
    getHistory();
    getProducts();
  }, []);
  return (
    <ProductsContext.Provider
      value={{ products, addProduct, orders, deleteProduct, showDelAlert }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export { ProductsProvider, ProductsContext };
