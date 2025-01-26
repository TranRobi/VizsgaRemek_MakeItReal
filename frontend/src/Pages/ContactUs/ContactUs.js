import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function ContactUs({ setBasketList, basketList }) {
  return (
    <>
      <Navbar basketList={basketList} />
      <div className="h-screen">Contact Us</div>
      <Footer />
    </>
  );
}

export default ContactUs;
