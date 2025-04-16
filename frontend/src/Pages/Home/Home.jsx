import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { NavLink } from "react-router-dom";

import "./Home.css";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <Navbar />
      <div className="w-4/5 mx-auto py-12">
        <section className=" p-8 rounded-lg mb-12 flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2 text-center">
            <h1 className="sm:text-5xl md:7xl text-4xl font-bold text-white">
              Make it real
            </h1>
            <h3 className="text-2xl text-white mt-4">
              {" "}
              Dream it and we will make it into reality
            </h3>
          </div>
          <img
            src="spiderModel.jpg"
            alt="Contact us"
            className="w-full md:w-1/2 rounded-full shadow-lg"
          />
        </section>

        {/* About Us Section */}
        <section className=" p-8 rounded-lg mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-semibold text-white">About us</h1>
            <h2 className="text-2xl text-white mt-2">Who are we?</h2>
            <h2 className="text-2xl text-white">How did we start?</h2>
            <h2 className="text-2xl text-white">What are we doing?</h2>
            <NavLink
              to="/aboutus"
              className="mt-4 inline-block bg-[#333333] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#000000] transition">
              See for yourself here <ReadMoreIcon className="ml-2" />
            </NavLink>
          </div>
          <img
            src="team.JPEG"
            alt="About us"
            className="w-full md:w-1/2 rounded-2xl shadow-lg"
          />
        </section>

        {/* Contact Section */}
        <section className=" p-8 rounded-lg shadow-lg mb-12 flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-semibold text-white">Contact us</h1>
            <h3 className="text-xl text-white mt-2">
              For help or questions, please contact us
            </h3>
            <NavLink
              to="/contactus"
              className="mt-4 inline-block bg-[#333333] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#000000] transition">
              Contact us now <ArrowForwardIcon className="ml-2" />
            </NavLink>
          </div>
          <img
            src="contactUs.jpg"
            alt="Contact us"
            className="w-full md:w-1/2 rounded-lg shadow-lg"
          />
        </section>

        {/* Library Section */}
        <section className="p-8 rounded-lg shadow-lg mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-semibold text-white">Explore More</h1>
            <h3 className="text-xl text-white mt-2">
              For more products click on the button below
            </h3>
            <NavLink
              to="/library"
              className="mt-4 inline-block bg-[#333333] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#000000] transition">
              Visit Library <ArrowForwardIcon className="ml-2" />
            </NavLink>
          </div>
          <img
            src="arrow.PNG"
            alt="Arrow"
            className="w-full md:w-1/2 rounded-lg shadow-lg"
          />
        </section>

        {/* Order Section */}
        <section className=" p-8 rounded-lg shadow-lg mb-12 flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-5xl font-semibold text-white">Custom order</h1>
            <h3 className="text-xl text-white mt-2">
              This is for clients with special needs or custom orders
            </h3>
            <NavLink
              to="/order"
              className="mt-4 inline-block bg-[#333333] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#000000] transition">
              Order now <ArrowForwardIcon className="ml-2" />
            </NavLink>
          </div>
          <img
            src="delivery.gif"
            alt="Contact us"
            className="w-full md:w-1/2 rounded-lg shadow-lg"
          />
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Home;
