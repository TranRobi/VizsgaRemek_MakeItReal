import React from "react";

function Card() {
	return (
		<div className="card">
			<img src="./image1.png" alt="Product" />
			<h2>Product Name</h2>
			<p>Product Description</p>
			<button>Add to Cart</button>
			<span></span>
		</div>
	);
}

export default Card;
