import React from "react";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function AboutUs() {
	return (
		<>
			<Navbar />
			<div className="aboutus">
			<div className="h-screen">
				<h1>About us</h1>
				<h2>Who are we?</h2>
				<div className="members">
					<div className="Mate">
						<h3>Mester Máté</h3>
						<p class="description">
							I have 3 years of experience in 3D printing and designing. With my colleagues, we've
							taken part in several competitions in which we had to make a lot of 3D designs.
						</p>
					</div>
					<div className="Trani">
						<h3>Tran Duy Dat</h3>
						<p class="description">Self description</p>
					</div>
					<div className="Zsolt">
						<h3>Vadász Zsolt</h3>
						<p class="description">Self description</p>
					</div>
				</div>
				<h2>How did we start?</h2>
				<p>
					We started working together in 2021 when we took part in a national robotics championship.
					Since then, we competed in several national and international competitions, we are four times 
					Hungarian champions. In the preparations for the championships, we had to make lots of 3D models
					so we learnt how to design models in 3D. That is where the idea came for this application. It is
					for those, who want to make an idea real but don't have the resources to make it real.
				</p>


				<h2>What are we doing?</h2>
				<p>
					We are making your ideas real. If you know how to 3D model, you can send your design and we will
					print it out and send it to you. If you don't know how to model, don't worry we got you. You can 
					send a description of what you need. We'll contact you and design the model for you, then print and ship.
				</p>
			</div>
			</div>
			<Footer />
		</>
	);
}

export default AboutUs;
