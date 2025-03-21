import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Cards/Card";

import { IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import axios from "axios";
function Library() {
  let [search, setSearch] = useState("");
  const [product, setProduct] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  function searchFilter() {
    let searchArray = product.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );

    return searchArray;
  }
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
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <Navbar />
      <div>
        <form>
          <input
            type="search"
            className="bg-white block mr-auto ml-auto p-2 w-4/5 mt-4 mb-4"
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search items here"
          />
        </form>
      </div>
      <div>
        <div className="cards justify-center h-4/5 min-h-96 flex-wrap flex">
          {searchFilter().length > 0 ? (
            searchFilter()
              .map((prod, index) => {
                return <Card key={index} prod={prod} />;
              })
              .slice(currentPage * pageSize - pageSize, currentPage * pageSize)
          ) : (
            <p>No items found</p>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <IconButton
          onClick={() => {
            if (currentPage !== 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <span>Page {currentPage}</span>
        <IconButton
          onClick={() => {
            if (
              currentPage * pageSize <
              product.filter((e) =>
                search.toLowerCase() === ""
                  ? e
                  : e.name.includes(search) || e.description.includes(search)
              ).length
            ) {
              setCurrentPage(currentPage + 1);
            }
          }}
        >
          <ArrowForwardIcon fontSize="large" />
        </IconButton>
      </div>
      <Footer />
    </>
  );
}

export default Library;
