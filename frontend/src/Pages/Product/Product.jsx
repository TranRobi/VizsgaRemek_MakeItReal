import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
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

  useEffect(() => {
    window.scrollTo(0, 0);
    getProductID();
  }, [params.id]);

  function addToCart() {
    const item = {
      id: product.id,
      name: product.name,
      quantity,
      size,
      color,
      material,
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
            <label className="block font-semibold">Size: {size}%</label>
            <input
              type="range"
              min="50"
              max="150"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full"
            />
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
              {["Red", "Green", "Blue", "Yellow", "Black", "White", "Gray"].map(
                (col) => (
                  <button
                    key={col}
                    className={`w-8 h-8 rounded-full border-2 ${
                      color === col ? "border-black" : ""
                    }`}
                    style={{ backgroundColor: col.toLowerCase() }}
                    onClick={() => setColor(col)}
                  ></button>
                )
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block font-semibold">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>

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
              Add to bag
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Product;
