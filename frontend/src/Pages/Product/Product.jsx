import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import { CircularProgress } from "@mui/material";
import axios from "axios";
import { CartContext } from "../../context/CartContext";

function Product() {
  const { cartList, setCartList } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(50);
  const [color, setColor] = useState("Black");
  const [material, setMaterial] = useState("PLA");
  const [product, setProduct] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const [prodPrice, setProdPrice] = useState(0);

  const getPrices = async (items) => {
    try {
      const response = await axios.put("/api/checkout", items);
      setProdPrice(response.data[0].price);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const calc = async () => {
    const items = [];

    const item = {
      id: product.id,
      material: material,
      quantity: quantity,
    };
    items.push(item);

    // Set loading state to true before fetching prices
    setLoading(true);

    // Fetch prices from backend
    await getPrices(items);

    localStorage.setItem("items", JSON.stringify(items));

    // Set loading to false after everything is completed
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getProductID();
  }, [params.id]);

  function addToCart() {
    const item = {
      id: product.id,
      name: product.name,
      description: product.description,
      quantity: quantity,
      size: size,
      colour: color,
      material: material,
      price: prodPrice,
    };

    if (cartList.some((item) => item.id === product.id)) {
      const index = cartList.findIndex((item) => item.id === product.id);
      cartList[index].quantity += quantity;
      setCartList([...cartList]);
    } else {
      console.log(item);
      setCartList([...cartList, item]);
    }

    localStorage.setItem("cart", JSON.stringify(cartList));
  }
  function getProductID() {
    axios
      .get(`/api/products/${params.id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error(error));
  }

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12 w-4/5 grid md:grid-cols-2 gap-12 min-h-[80vh] h-full">
        {/* Product Image */}
        <>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex justify-center">
            <img
              src={`/api/products/images/${params.id}`}
              alt={product.name}
              className="max-w-full h-auto"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6 text-[#EEEEEE] self-center ">
            <h2 className="text-3xl font-semibold ">{product.name}</h2>
            <p className="text-[#EEEEEE]">{product.description}</p>

            {/* Size Scale */}
            <div>
              <label className="block font-semibold">Size:</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="border p-2 rounded w-full bg-red-950"
              >
                {[50, 100, 150].map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}%
                  </option>
                ))}
              </select>
            </div>

            {/* Material Selector */}
            <div>
              <label className="block font-semibold">Material:</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="border p-2 rounded w-full bg-red-950"
              >
                {["PLA", "PETG", "ABS"].map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Selector */}
            <div>
              <label className="block font-semibold">Color:</label>
              <div className="flex space-x-2">
                {[
                  "Red",
                  "Green",
                  "Blue",
                  "Yellow",
                  "Black",
                  "White",
                  "Gray",
                ].map((col) => (
                  <button
                    key={col}
                    className={`w-8 h-8 rounded-full border-2 ${
                      color === col ? "border-black" : ""
                    }`}
                    style={{ backgroundColor: col.toLowerCase() }}
                    onClick={() => setColor(col)}
                  ></button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="justify-center h-fit w-full">
                <div className="flex flex-row w-fit">
                  <h1 className="text-2xl text-white ">Calculating price...</h1>
                  <CircularProgress color="error" />
                </div>
              </div>
            ) : (
              <div>
                {prodPrice.toLocaleString("hu-HU", {
                  style: "currency",
                  currency: "HUF",
                })}
                /db
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex flex-col md:flex-row justify-between">
              <button
                onClick={() => {
                  navigate("/library");
                }}
                className="w-full md:w-1/3 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
              >
                Back to library
              </button>

              <button
                onClick={() => {
                  addToCart();
                }}
                className="w-full md:w-1/3 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
              >
                Add to cart
              </button>
            </div>
            <button
              onClick={() => {
                calc();
              }}
              className="w-full md:w-1/3 bg-orange-400 text-white py-3 rounded-lg font-semibold hover:bg-red-900"
            >
              Calculate price
            </button>
          </div>
        </>
      </div>
      <Footer />
    </>
  );
}

export default Product;
