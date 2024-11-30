import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Cards/Card";

import prouduct from "../../dummy";

function Library() {
	return (
		<>
			<Navbar />
			<div>
				<div className="cards justify-center">
					{prouduct.map((prod, index) => {
						return <Card key={index} props={prod} />;
					})}
				</div>
			</div>
			<Footer />
		</>
	);
}

export default Library;
