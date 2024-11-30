import React from "react";
import { Link } from "react-router-dom";

function Card({ props }) {
	return (
		<div className="card ">
			<img src={props.img} alt="Product" />
			<h2>{props.name}</h2>
			<p>Price: {props.price}</p>
			<p>{props.description}</p>
			<Link>Add to Cart</Link>
			<span></span>
		</div>
	);
}

export default Card;
