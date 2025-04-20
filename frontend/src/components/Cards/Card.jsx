import React from "react";
import { useNavigate } from "react-router-dom";

import "./Card.css";
function Card({ prod }) {
  const navigate = useNavigate();
  return (
    <div
      className="card h-[45vh] md:h-[35vh]"
      onClick={() => {
        navigate(`/library/${prod.id}`);
      }}
    >
      <img
        src={`/api/products/images/${prod.id}`}
        alt={prod.name}
        className="h-1/2 rounded-lg"
      />
      <h1 className="text-center">{prod.name}</h1>
    </div>
  );
}

export default Card;
