import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { BasketContext } from "../../components/context/BasketContext";

function Product() {
  const { basketList, setBasketList } = useContext(BasketContext);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(50);
  const [color, setColor] = useState("Black");
  const [material, setMaterial] = useState("PLA");
  const [product, setProduct] = useState(null);
  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/products/${params.id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error(error));
  }, [params.id]);

  function addToBasket() {
    if (basketList.find((basket) => basket.id === product.id)) {
      const updatedBasket = basketList.map((basket) =>
        basket.id === product.id
          ? { ...basket, quantity: basket.quantity + quantity }
          : basket
      );
      setBasketList(updatedBasket);
    }
  }

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12 w-4/5 grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full h-auto"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900">
            {product.name}
          </h2>
          <p className="text-gray-600">{product.description}</p>

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
              className="border p-2 rounded w-full"
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
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Add to Basket Button */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                navigate("/library");
              }}
              className="w-1/3 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
            >
              Back to library
            </button>
            <button
              onClick={addToBasket}
              className="w-1/2 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-900"
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
