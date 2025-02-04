import React from "react";
import { NavLink } from "react-router-dom";

function Card({ prod }) {
  return (
    <div className="card">
      <img src={prod.img} alt="Product" />
      <h2>{prod.name}</h2>
      <p>Price: {prod.price}</p>
      <p>{prod.description}</p>
      <div>
        <NavLink to={`/library/${prod.id}`}>View prouduct</NavLink>
      </div>
      <span></span>
    </div>
  );
}

export default Card;
