import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

import Home from "./Pages/Home/Home.jsx";
import Library from "./Pages/Library/Library.jsx";
import Order from "./Pages/Order/Order.jsx";
import ContactUs from "./Pages/ContactUs/ContactUs.jsx";
import AboutUs from "./Pages/AboutUs/AboutUs.jsx";
import Prouduct from "./Pages/Prouducts/Prouduct.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Basket from "./components/Basket/Basket.jsx";

import { BasketContext } from "./context/BasketContext";
import { useContext } from "react";

function App() {
  const { basketList, setBasketList } = useContext(BasketContext);
  useEffect(() => {}, [basketList, setBasketList]);
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
            path="/basket"
            element={
              <Basket basketList={basketList} setBasketList={setBasketList} />
            }
          />
          <Route path="/order" element={<Order />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/library/:id" element={<Prouduct />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
