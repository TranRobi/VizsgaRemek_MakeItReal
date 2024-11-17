import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function Home() {
	return (
		<>
			<Navbar />
			<section>Company name, slogan</section>
			<section>About us</section>
			<section>Contact us</section>
			<section>Libtary</section>
			<section>Order</section>
			<Footer />
		</>
	);
}

export default Home;
