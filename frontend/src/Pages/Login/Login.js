import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, TextField } from "@mui/material";
import { blue } from "@mui/material/colors";

function Login() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="p-5 gray rounded-xl w-1/2">
        <h1 className="text-3xl font-bold beige pb-6">Login</h1>
        <div className="h-fit">
          <TextField
            type="text"
            placeholder="Username/Email Address"
            className="w-full py-3 mt-5 mb-4 border rounded-md bg-white"
            variant="outlined"
          />
          <TextField
            type="password"
            placeholder="Password"
            className="w-full py-3 mt-5 border rounded-md bg-white"
            variant="outlined"
          />
          <Button
            className="w-full py-3 mt-5 bg-blue-500 text-white rounded-md"
            variant="outlined"
          >
            Login
          </Button>
        </div>
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
