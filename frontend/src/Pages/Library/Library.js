import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Cards/Card";

function Library() {
	return (
		<>
			<Navbar />
			<div className="flex">
				<div className="">Basket</div>
				<div className="w-fit">
					<div className="cards">
						<Card />
						<Card />
						<Card />
						<Card />
					</div>
					<div className="cards">
						<Card />
						<Card />
						<Card />
						<Card />
					</div>
					<div className="cards">
						<Card />
						<Card />
						<Card />
						<Card />
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}

export default Library;
