import React, { useContext } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { EmailContext } from "../../context/EmailContext";

function EmailExample() {
  //getting the informations from the Contexts
  const { info } = useContext(EmailContext);

  return (
    <>
      <Navbar />

      <div className="min-h-[78vh]  w-3/4 md:w-1/3 bg-white p-4 mx-auto rounded m-5 ">
        <div className="flex items-center justify-between md:justify-start">
          <span className="text-xl">Name: </span>
          <p className="ml-4">{info.name}</p>
        </div>
        <div className="flex items-center justify-between md:justify-start">
          <span className="text-xl">Email Address: </span>
          <p className="ml-4">{info["email-address"]}</p>
        </div>
        <div className="flex items-center justify-between md:justify-start">
          <span className="text-xl">Phone Number: </span>
          <p className="ml-4">{info["phone-number"]}</p>
        </div>
        <div className="flex items-center justify-between md:justify-start">
          <span className="text-xl">Street Number: </span>
          <p className="ml-4">{info["street-number"]}</p>
        </div>
        <div className="flex items-center justify-between md:justify-start">
          <span className="text-xl">Postal Code: </span>
          <p className="ml-4">{info["postal-code"]}</p>
        </div>
        <div className="flex items-center justify-between md:justify-start">
          <span className="text-xl">Country: </span>
          <p className="ml-4">{info.country}</p>
        </div>
        <div className="flex items-center justify-between md:justify-start">
          <span className="text-xl">County: </span>
          <p className="ml-4">{info.county}</p>
        </div>
        <div className="flex items-center justify-between md:justify-start">
          <span className="text-xl">County: </span>
          <p className="ml-4">{info.county}</p>
        </div>
        <div className="flex items-center justify-between md:justify-start">
          <span className="text-xl">City: </span>
          <p className="ml-4">{info.city}</p>
        </div>

        <h1 className="text-3xl">Products</h1>
        {info.jobs.map((item) => {
          return (
            <div key={item["product-id"]} className="flex  md:flex-row m-2 ">
              <img
                src={`/api/products/images/${item["product-id"]}`}
                alt=""
                className="w-1/2 md:w-1/4"
              />
              <div className="flex flex-col w-fit justify-between p-2">
                <p className="ml-4">Quantity: {item.quantity}</p>
                <p className="ml-4">Material: {item.material}</p>
                <p className="ml-4">Color: {item.colour}</p>
                <p className="ml-4">Price: {item["price-per-product"]}</p>
                <p className="ml-4">Status: {item.state}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </>
  );
}

export default EmailExample;
