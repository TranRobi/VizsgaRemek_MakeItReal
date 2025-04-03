import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const ProductsContext = createContext();

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

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
    getProducts();
  }, []);
  return (
    <ProductsContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export { ProductsProvider, ProductsContext };
