import React from "react";
import { NavLink } from "react-router-dom";

import "./Card.css";

function Card({ prod }) {
  return (
    <div className="card h-[45vh] md:h-[35vh]">
      <img
        src="../../image1.png"
        alt={prod.name}
        className="h-1/2 rounded-lg"
      />
      <h2>{prod.name}</h2>
      <p className="cardp">{prod.description}</p>
      <div>
        <NavLink to={`/library/${prod.id}`} className="w-fit absolute bottom-4">
          View product
        </NavLink>
      </div>
      <span></span>
    </div>
  );
}

export default Card;
