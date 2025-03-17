import React, { useContext, useState } from "react";
import {
  Button,
  createTheme,
  FormControl,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyIcon from "@mui/icons-material/Key";

import axios from "axios";
import { AuthContext } from "../../components/context/AuthContext";

function Login({ close, open }) {
  const { user, setUser } = useContext(AuthContext);
  const theme = createTheme({
    palette: {
      warning: {
        main: "#1C1C1C",
      },
    },
  });

  const [formData, setFormData] = useState({
    "email-address": "",
    password: "",
  });

  const handleChange = (event) => {
    if (!event.target) {
      setFormData((values) => ({ ...values, expire_at: event.$d }));
    } else {
      setFormData((values) => ({
        ...values,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const handleOpenRegister = (e) => {
    open(e);
    close(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/login", formData, {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      })
      .then((response) => {
        if (response.status === 201) {
          localStorage.setItem("token", response.data.token);
          setUser(true);
          console.log("Sikeres bejelentkezés " + user);

          close(e);
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="p-5 rounded-xl w-1/3 login h-fit">
          <div className="flex justify-between align-middle">
            <h1 className="text-3xl font-bold pb-6 ">Login</h1>

            <a href={window.location.pathname} className=" text-red-500">
              <CancelIcon fontSize="large" onClick={(e) => close(e)} />
            </a>
          </div>
          <form>
            <FormControl fullWidth>
              <Stack spacing={2}>
                <div className="relative">
                  <TextField
                    onChange={handleChange}
                    name="email-address"
                    id="email-address"
                    label="Email Address/Username"
                    placeholder="Enter Email Address/Username"
                    color="warning"
                    variant="standard"
                    className="w-full"
                  ></TextField>
                  <MailOutlineIcon className="absolute top-1/2 right-0" />
                </div>
                <div className="relative">
                  <TextField
                    onChange={handleChange}
                    name="password"
                    id="password"
                    label="Password"
                    placeholder="Enter password"
                    type="password"
                    color="warning"
                    variant="standard"
                    className="w-full"
                  ></TextField>
                  <KeyIcon className="absolute top-1/2 right-0" />
                </div>
                <Button
                  variant="contained"
                  color="warning"
                  className="w-fit "
                  onClick={(e) => handleSubmit(e)}
                >
                  Login
                </Button>
                <div className="flex items-center justify-between">
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    className="mr-4 cursor-pointer"
                    onClick={(e) => handleOpenRegister(e)}
                  >
                    Don't have an account? Register here!
                  </Typography>
                </div>
              </Stack>
            </FormControl>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Login;
