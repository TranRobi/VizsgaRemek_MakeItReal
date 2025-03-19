import React, { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function ContactUs() {
  useEffect(()=> {
    window.scrollTo(0,0)
  })
  return (
    <>
      <Navbar />
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl" id="asd2">
              Get in touch
            </h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:max-w-5xl lg:grid-cols-3 justify-center text-center">
            <article className="flex flex-col items-center">
              <img src="address_icon.png" className="w-24" alt="Address Icon" />
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                Address
              </h3>
              <p className="mt-5 text-sm text-gray-600">
                3828 Piermont Dr, Albuquerque, NM
              </p>
            </article>

            <article className="flex flex-col items-center">
              <img src="phone_icon.png" className="w-24" alt="Phone Icon" />
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                Phone
              </h3>
              <p className="mt-5 text-sm text-gray-600">
                Mobile: 36(69)324-04-45
              </p>
            </article>

            <article className="flex flex-col items-center">
              <img src="email_icon.jpg" className="w-24" alt="Email Icon" />
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                E-mail
              </h3>
              <p className="mt-5 text-sm text-gray-600">info@makeitreal.com</p>
            </article>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ContactUs;
