import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useEffect } from "react";

function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <section className="mt-12 shadow-2xl">
            <h2 className="text-5xl font-semibold text-center mb-8 text-white">
              Our Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md">
                <img src="mester.jpg" alt="" />
                <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                  Mester Máté
                </h3>
                <p className="text-[#333333]">
                  I have 3 years of experience in 3D printing and designing.
                  With my colleagues, we've taken part in several competitions
                  in which we had to make a lot of 3D designs.
                </p>
                <p className="text-[#333333]">
                  I also have experience in electrical engineering, which I
                  gained during the competitions.
                </p>
              </div>
              <div className="bg-[#E0E0E0] p-6 rounded-lg shadow-md">
                <img src="tran.JPEG" alt="" />
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
                <img src="vzs.jpg" alt="erlany" />
                <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                  Vadász Zsolt
                </h3>
                <p className="text-[#333333]">
                  I have been programming for several years at a hobby level. I
                  mostly dabble in systems programming.
                </p>
                <p className="text-[#333333]">
                  I wrote most of the backend, in the future I do not want to
                  touch web development.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12 shadow-2xl bg-gray-200 p-3 flex flex-col  sm:flex-row md:flex-row items-center rounded-2xl">
            <img src="start.jpg" alt="" className="w-4/5" />
            <div className="w-3/4 md:w-full ">
              <h2 className="text-2xl  font-semibold text-center mb-6 text-[#333333] md:text-4xl">
                How did we start?
              </h2>
              <p className="text-sm md:text-lg max-w-3xl mx-auto text-center text-[#333333]">
                We started working together in 2021 when we participated in a
                national robotics championship. Since then, we have competed in
                several national and international competitions, winning four
                Hungarian championships. The idea for this application was born
                from our experience designing 3D models for competitions.
              </p>
            </div>
          </section>

          <section
            className="mt-12 shadow-2xl bg-gray-200 p-3 flex flex-col  sm:flex-row md:flex-row items-center rounded-2xl
          "
          >
            <div className="w-3/4">
              <h2 className="text-2xl md:text-4xl font-semibold text-center mb-6 text-[#333333]">
                What are we doing?
              </h2>
              <p className="text-sm md:text-lg max-w-3xl mx-auto text-center text-[#333333]">
                We bring your ideas to life. If you know how to 3D model, send
                us your design, and we'll print and ship it to you. If you don’t
                know how to model, no problem! Send us a description, and we’ll
                design, print, and ship it for you.
              </p>
            </div>
            <img src="3dPrintAbout.jpg" className="w-4/5" />
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;
