import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Cards/Card";

import { IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import axios from "axios";
function Library() {
  //declaring states
  const [search, setSearch] = useState("");
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
    window.scrollTo(0, 0);
    // Fetching data from the API
    axios
      .get("/api/products")
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [pageSize]);
  return (
    <>
      <Navbar />
      <div>
        <form className="flex justify-between w-4/5 mx-auto items-center">
          <input
            type="search"
            className="bg-white block mr-auto ml-auto p-2 w-full mt-4 mb-4"
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search items here"
          />
          <select
            className="text-white w-fit h-fit"
            onChange={(e) => {
              setPageSize(e.target.value);
            }}
          >
            <option value={10} className="text-black">
              10 items per page
            </option>
            <option value={5} className="text-black">
              5 items per page
            </option>
            <option value={1} className="text-black">
              1 items per page
            </option>
          </select>
        </form>
      </div>
      <div>
        <div className=" justify-center h-1/4 flex-wrap flex min-h-[78vh]">
          {searchFilter().length > 0 ? (
            searchFilter()
              .map((prod, index) => {
                return <Card key={index} prod={prod} />;
              })
              .slice(currentPage * pageSize - pageSize, currentPage * pageSize)
          ) : (
            <p className="h-screen text-4xl text-[white]">No items found</p>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center text-white">
        <IconButton
          onClick={() => {
            if (currentPage !== 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <span>
          Page {currentPage} / {Math.ceil(searchFilter().length / pageSize)}
        </span>
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
