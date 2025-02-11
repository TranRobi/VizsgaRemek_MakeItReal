import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Cards/Card";

import { IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import axios from "axios";
function Library() {
  const [product, setProduct] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
      <div className=" relative ">
        <div className="cards justify-center h-[80vh] ">
          {product
            .map((prod, index) => {
              return <Card key={index} prod={prod} />;
            })
            .slice(currentPage * pageSize - pageSize, currentPage * pageSize)}
        </div>
        <div className="bottom-0 flex justify-center items-center">
          <IconButton>
            <ArrowBackIcon
              onClick={() => {
                if (currentPage != 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              fontSize="large"
            />
          </IconButton>
          <span>Page {currentPage}</span>
          <IconButton>
            <ArrowForwardIcon
              onClick={() => {
                if (currentPage * pageSize < product.length) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              fontSize="large"
            />
          </IconButton>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Library;
