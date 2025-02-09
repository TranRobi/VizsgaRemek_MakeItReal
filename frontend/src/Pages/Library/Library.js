import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Cards/Card";

import axios from "axios";
function Library() {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <>
      <Navbar />
      <div>
        <div className="cards justify-center">
          {product.map((prod, index) => {
            return <Card key={index} prod={prod} />;
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Library;
