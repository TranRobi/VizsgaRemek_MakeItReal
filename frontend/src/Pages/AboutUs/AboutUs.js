import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center bg-[#5A738E] text-white py-16 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4">Who are we?</h1>
            <p className="text-lg max-w-2xl mx-auto">
              We have brought together a description of who we are, what we are
              doing, and how we started.
            </p>
          </div>

          <section className="mt-12">
            <h2 className="text-3xl font-semibold text-center mb-8 text-[#333333]">
              Our Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                  Mester Máté
                </h3>
                <p className="text-[#333333]">
                  I have 3 years of experience in 3D printing and designing.
                  With my colleagues, we've taken part in several competitions
                  in which we had to make a lot of 3D designs.
                </p>
              </div>
              <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                  Tran Duy Dat
                </h3>
                <p className="text-[#333333]">
                  In the previous years, my colleagues and I competed in various
                  robotics competitions, where my role was documenting the
                  process of making the robot. The documentation was implemented
                  for the web. I also took part in 3D designing and assembling
                  the robot.
                </p>
                <p className="mt-2 text-[#333333]">
                  In the future, I want to start and finish my college education
                  and gain more work experience during my studies.
                </p>
              </div>
              <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                  Vadász Zsolt
                </h3>
                <p className="text-[#333333]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-semibold text-center mb-6 text-[#333333]">
              How did we start?
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-center text-[#333333]">
              We started working together in 2021 when we participated in a
              national robotics championship. Since then, we have competed in
              several national and international competitions, winning four
              Hungarian championships. The idea for this application was born
              from our experience designing 3D models for competitions.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-3xl font-semibold text-center mb-6 text-[#333333]">
              What are we doing?
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-center text-[#333333]">
              We bring your ideas to life. If you know how to 3D model, send us
              your design, and we'll print and ship it to you. If you don’t know
              how to model, no problem! Send us a description, and we’ll design,
              print, and ship it for you.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;
