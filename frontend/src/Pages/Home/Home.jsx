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
            <h1 className="sm:text-5xl md:7xl text-4xl font-bold text-[#950101]">
              Make it real
            </h1>
            <h3 className="text-2xl text-[#5e0505] mt-4">
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
            <h1 className="text-4xl font-semibold text-[#333333]">About us</h1>
            <h2 className="text-2xl text-[#5A738E] mt-2">Who are we?</h2>
            <h2 className="text-2xl text-[#5A738E]">How did we start?</h2>
            <h2 className="text-2xl text-[#5A738E]">What are we doing?</h2>
            <NavLink
              to="/aboutus"
              className="mt-4 inline-block bg-[#333333] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#000000] transition"
            >
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
            <h1 className="text-4xl font-semibold text-[#333333]">
              Contact us
            </h1>
            <h3 className="text-xl text-[#5A738E] mt-2">
              For help or questions, please contact us
            </h3>
            <NavLink
              to="/contactus"
              className="mt-4 inline-block bg-[#333333] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#000000] transition"
            >
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
        <section className=" p-8 rounded-lg shadow-lg text-center mb-12">
          <h1 className="text-4xl font-semibold text-[#333333]">
            Explore More
          </h1>
          <h3 className="text-xl text-[#5A738E] mt-2">
            For more products click on the button below
          </h3>
          <NavLink
            to="/library"
            className="mt-4 inline-block bg-[#333333] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#000000] transition"
          >
            Visit Library <ArrowForwardIcon className="ml-2" />
          </NavLink>
        </section>

        {/* Order Section */}
        <section className=" p-8 rounded-lg shadow-lg text-center mb-12">
          <h1 className="text-4xl font-semibold text-[#333333]">Order now</h1>
          <h3 className="text-xl text-[#5A738E] mt-2">
            This is for clients with ideas in mind that need to be modeled and
            made into reality
          </h3>
          <NavLink
            to="/order"
            className="mt-4 inline-block bg-[#333333] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#000000] transition"
          >
            Order now <LocalShippingIcon className="ml-2" />
          </NavLink>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Home;
