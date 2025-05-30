import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home/Home.jsx";
import Library from "./Pages/Library/Library.jsx";
import Order from "./Pages/Order/Order.jsx";
import ContactUs from "./Pages/ContactUs/ContactUs.jsx";
import AboutUs from "./Pages/AboutUs/AboutUs.jsx";
import Product from "./Pages/Product/Product.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import Cart from "./Pages/Cart/Cart.jsx";
import Payment from "./Pages/Payment/Payment.jsx";

import RequireAuth from "./context/RequireAuth.jsx";
import EmailExample from "./components/EmailExample/EmailExample.jsx";

function App() {
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/library/:id" element={<Product />} />
          <Route element={<RequireAuth />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/payment" element={<Payment />} />
          <Route path="/email-example" element={<EmailExample />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
