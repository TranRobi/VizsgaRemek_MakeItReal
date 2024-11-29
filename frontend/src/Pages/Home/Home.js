import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ReadMoreIcon from "@mui/icons-material/ReadMore";

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
					<h3>short introduction</h3>
					<button>Read more {<ReadMoreIcon />}</button>
				</div>
				<img src="1.jpg" alt="asd" />
			</section>
			<section className="text-right">
				<img src="1.jpg" alt="asd" />
				<div>
					<h1>Contact us</h1>
					<h3>For help or questions, please contact us</h3>
					<button>Contanct us now</button>
				</div>
			</section>
			<section className="block">
				<h1>Slide</h1>
				<h3>For more prouduct click on the button below</h3>
				<button>Visit library</button>
			</section>
			<section className="text-right">
				<img src="1.jpg" alt="asd" />
				<div>
					<h1>Order now</h1>
					<h3>
						This is for clients with ideas in mind that needed to be modeled and
						make into reality
					</h3>
					<button>Order now</button>
				</div>
			</section>
			<Footer />
		</>
	);
}

export default Home;
