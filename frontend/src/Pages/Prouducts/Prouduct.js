import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import { NavLink } from "react-router-dom";

function Prouduct() {
	const params = useParams();

	return (
		<>
			<Navbar />
			<div className="h-screen">
				<h1>Product: {params.id}</h1>
				<NavLink to={"/library"}>Go back</NavLink>
			</div>
			<Footer />
		</>
	);
}

export default Prouduct;
