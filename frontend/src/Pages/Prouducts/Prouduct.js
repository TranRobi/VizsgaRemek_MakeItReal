import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import { NavLink } from "react-router-dom";

function Prouduct({ setBasketList, basketList }) {
  console.log(props);
  function addToBasket() {}
  return (
    <>
      <Navbar basketList={basketList} />
      <div className="w-[500px] m-auto">
        <NavLink to="/library">Go Back</NavLink>
        <button>Add to basket</button>
      </div>
      <Footer />
    </>
  );
}

export default Prouduct;
