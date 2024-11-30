import React from "react";
import { NavLink } from "react-router-dom";

function Card({ props }) {
	return (
		<div className="card">
			<img src={props.img} alt="Product" />
			<h2>{props.name}</h2>
			<p>Price: {props.price}</p>
			<p>{props.description}</p>
			<div>
				<NavLink to={`/library/${props.id}`}>View prouduct</NavLink>
			</div>
			<span></span>
		</div>
	);
}

export default Card;
