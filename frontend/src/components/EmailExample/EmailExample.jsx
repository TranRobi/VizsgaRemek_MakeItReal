import React, { useContext } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { EmailContext } from "../../context/EmailContext";

function EmailExample() {
  const { info } = useContext(EmailContext);
  return (
    <>
      <Navbar />

      <div className="min-h-[78vh] text-white">
        <p>{info["email-address"]}</p>
        <p>{info["phone-number"]}</p>
        <p>{info["street-number"]}</p>
        <p>{info["postal-code"]}</p>
        <p>{info.country}</p>
        <p>{info.county}</p>
        <p>{info.city}</p>
        {info.jobs.map((item) => {
          return <div>{item.quantity}</div>;
        })}
      </div>
      <Footer />
    </>
  );
}

export default EmailExample;
