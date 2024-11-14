import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Cards/Card";

function Library() {
	return (
		<>
			<Navbar />
			<div>
				<div></div>
				<div className="cards">
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
				</div>
			</div>

			<Footer />
		</>
	);
}

export default Library;
