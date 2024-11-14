import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

function Login() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="p-5 gray rounded-xl w-1/2">
        <h1 className="text-3xl font-bold beige">Login</h1>
        <div>
          <input
            type="text"
            placeholder="Username/Email Address"
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
          <div className="w-fit mt-4">
            <p className="beige text-center">
              Don't have an account? Create it now!
            </p>
          </div>
          <div className="w-fit mt-4">
            <a href={window.location.pathname} className=" text-red-500">
              <CancelIcon fontSize="large" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
