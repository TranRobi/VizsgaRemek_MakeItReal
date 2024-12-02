import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { NavLink } from "react-router-dom";

function Home() {
	return (
		<>
			<Navbar />

			<div className="text-center m-4">
				<h1 className="font-serif text-6xl">Make it real</h1>
				<h3 className="font-mono mt-4 text-3xl">
					Dream it and we will make it into reality
				</h3>
			</div>
			<section>
				<div>
					<h1>About us</h1>
					<h2>Who are we?</h2>
					<h2>How did we start?</h2>
					<h2>What are we doing?</h2>
					<NavLink to={"/aboutus"}>See for yourself here	{<ReadMoreIcon />}</NavLink>
				</div>
				<img src="1.jpg" alt="asd" />
			</section>
			<section>
				<img src="1.jpg" alt="asd" />
				<div>
					<h1>Contact us</h1>
					<h3>For help or questions, please contact us</h3>
					<NavLink to={"/contactus"}>
						Contanct us now {<ArrowForwardIcon />}
					</NavLink>
				</div>
			</section>
			<section className="block">
				<h1>Slide</h1>
				<h3>For more prouduct click on the button below</h3>
				<NavLink to={"/library"}>Visit library {<ArrowForwardIcon />}</NavLink>
			</section>
			<section>
				<img src="1.jpg" alt="asd" />
				<div>
					<h1>Order now</h1>
					<h3>
						This is for clients with ideas in mind that needed to be modeled and
						make into reality
					</h3>
					<NavLink to={"/order"}>Order now {<LocalShippingIcon />}</NavLink>
				</div>
			</section>
			<Footer />
		</>
	);
}

export default Home;