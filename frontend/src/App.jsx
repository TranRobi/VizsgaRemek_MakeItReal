import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

import Home from "./Pages/Home/Home.jsx";
import Library from "./Pages/Library/Library.jsx";
import Order from "./Pages/Order/Order.jsx";
import ContactUs from "./Pages/ContactUs/ContactUs.jsx";
import AboutUs from "./Pages/AboutUs/AboutUs.jsx";
import Product from "./Pages/Product/Product.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import Cart from "./components/Cart/Cart.jsx";

import { CartContext } from "./context/CartContext";
import { useContext } from "react";

function App() {
  const { cartList, setCartList } = useContext(CartContext);
  useEffect(() => {}, [cartList, setCartList]);
  return (
    <div className="App">
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route
            path="/cart"
            element={
              <Cart cartList={cartList} setCartList={setCartList} />
            }
          />
          <Route path="/order" element={<Order />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/library/:id" element={<Product />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
