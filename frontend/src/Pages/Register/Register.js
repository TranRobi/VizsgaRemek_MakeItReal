import React from "react";

function Register() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="p-5 gray rounded-xl w-1/2">
        <h1 className="text-3xl font-bold beige">Register</h1>
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full py-3 mt-5 border rounded-md"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full py-3 mt-5 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full py-3 mt-5 border rounded-md"
          />
        </div>
        <button className="w-full py-3 mt-5 bg-blue-500 text-white rounded-md">
          Login
        </button>
        <div className="flex items-center w-full justify-between">
          <div className="text-left mt-4">
            <p className="beige">Already have an account? Log in now!</p>
          </div>
          <div className="w-fit mt-4">
            <a href="/login" className=" text-blue-500 mr-5">
              Login
            </a>
            <a href="/" className=" text-blue-500">
              Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
