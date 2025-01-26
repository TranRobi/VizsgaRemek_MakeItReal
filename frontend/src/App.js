import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useState } from "react";

import Home from "./Pages/Home/Home.js";
import Library from "./Pages/Library/Library.js";
import Order from "./Pages/Order/Order.js";
import ContactUs from "./Pages/ContactUs/ContactUs.js";
import AboutUs from "./Pages/AboutUs/AboutUs.js";
import Prouduct from "./Pages/Prouducts/Prouduct.js";
function App() {
  const [basketList, setBasketList] = useState([]);
  return (
    <div className="App">
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Home setBasketList={setBasketList} basketList={basketList} />
            }
          />
          <Route
            path="/library"
            element={
              <Library setBasketList={setBasketList} basketList={basketList} />
            }
          />
          <Route
            path="/order"
            element={
              <Order setBasketList={setBasketList} basketList={basketList} />
            }
          />
          <Route
            path="/contactus"
            element={
              <ContactUs
                setBasketList={setBasketList}
                basketList={basketList}
              />
            }
          />
          <Route
            path="/aboutus"
            element={
              <AboutUs setBasketList={setBasketList} basketList={basketList} />
            }
          />
          <Route
            path="/library/:id"
            element={
              <Prouduct setBasketList={setBasketList} basketList={basketList} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
