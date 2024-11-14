import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from "./Pages/Home/Home.js";
import Login from "./Pages/Login/Login.js";
import Library from "./Pages/Library/Library.js";
import Register from "./Pages/Register/Register.js";
import Order from "./Pages/Order/Order.js";
import ContactUs from "./Pages/ContactUs/ContactUs.js";
import AboutUs from "./Pages/AboutUs/AboutUs.js";
function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<div>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/library" element={<Library />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/order" element={<Order />} />
						<Route path="/contactus" element={<ContactUs />} />
						<Route path="/aboutus" element={<AboutUs />} />
					</Routes>
				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
