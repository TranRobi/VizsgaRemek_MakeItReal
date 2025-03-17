import React from "react";

import axios from "axios";
import Button from "@mui/material/Button";

function MyOrders() {
  const sendUserCookie = () => {
    axios.post(
      "http://localhost:8080/api/products",
      {
        name: "asd",
        description: "Product",
      },
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        Cookie: document.cookie,
      }
    );
  };
  return (
    <div>
      <h1>My Orders</h1>
      <Button onClick={sendUserCookie}>Send</Button>
      <div>
        <p>Order 1</p>
        <p>Order 2</p>
        <p>Order 3</p>
      </div>
    </div>
  );
}

export default MyOrders;
