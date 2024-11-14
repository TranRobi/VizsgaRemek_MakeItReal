import React from "react";
import { Link } from "react-router-dom";

function Card() {
  return (
    <div className="card">
      <img src="image1.png" alt="Product" />
      <h2>Product Name</h2>
      <p>Price: </p>
      <Link>Add to Cart</Link>
      <span></span>
    </div>
  );
}

export default Card;
