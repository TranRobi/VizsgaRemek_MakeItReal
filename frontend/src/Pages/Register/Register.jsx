import React, { useState } from "react";
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
import PersonIcon from "@mui/icons-material/Person";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

import axios from "axios";

function Register({ close, open }) {
  const [registerWasSucceeded, setRegisterWasSucceeded] = useState(false);
  const theme = createTheme({
    palette: {
      warning: {
        main: "#1C1C1C",
      },
    },
  });

  const [formData, setFormData] = useState({
    "display-name": "",
    password: "",
    "email-address": "",
  });
  const [errors, setErrors] = useState({
    short: "",
    mismatch: "",
  });

  const validateFields = () => {
    let error = false;
    if (formData.password && formData.password.length < 5) {
      error = true;
      console.log("password was too short");
      setErrors({
        ...errors,
        short: "Password must contain at least 5 characters",
      });
      console.log("short set");
    }
    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      error = true;
      setErrors({ ...errors, mismatch: "Passwords don't match" });
    }
    return error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      return;
    } else {
      axios
        .post("/api/register", formData, {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setRegisterWasSucceeded(true);
          } else {
            setRegisterWasSucceeded(false);
          }
        })
        .catch((error) => console.log(error));
    }
    document.getElementById("regForm").reset();
  };

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

  const handleOpenLogin = (e) => {
    open(e);
    close(e);
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="w-full h-screen flex justify-center items-center">
        <div className="p-5 rounded-xl w-4/5 login bg-white">
          <div className="flex justify-between align-middle">
            <h1 className="text-3xl font-bold pb-6 ">Register</h1>

            <a href={window.location.pathname} className=" text-red-500">
              <CancelIcon fontSize="large" onClick={(e) => close(e)} />
            </a>
          </div>
          <form id="regForm">
            <FormControl fullWidth>
              <Stack spacing={2}>
                <div className="relative">
                  <TextField
                    required
                    onChange={handleChange}
                    name="display-name"
                    id="display-name"
                    label="Username"
                    placeholder="Enter Username"
                    color="warning"
                    variant="standard"
                    className="w-full"
                  ></TextField>
                  <PersonIcon className="absolute top-1/2 right-0" />
                </div>
                <div className="relative">
                  <TextField
                    required
                    onChange={handleChange}
                    name="email-address"
                    id="email-address"
                    label="Email Address"
                    placeholder="Enter Email Address"
                    type="email"
                    color="warning"
                    variant="standard"
                    className="w-full"
                  ></TextField>
                  <MailOutlineIcon className="absolute top-1/2 right-0" />
                </div>
                <div className="relative">
                  <TextField
                    required
                    onChange={handleChange}
                    name="password"
                    id="password"
                    label="Password"
                    placeholder="Enter password"
                    type="password"
                    color="warning"
                    variant="standard"
                    className="w-full"
                    error={Boolean(errors?.short)}
                    helperText={errors?.short}
                  ></TextField>
                  <KeyIcon className="absolute top-1/2 right-0" />
                </div>
                <div className="relative">
                  <TextField
                    onChange={handleChange}
                    name="confirmPassword"
                    id="confirmPassword"
                    label="Confirm Password"
                    placeholder="Enter password again"
                    type="password"
                    required
                    color="warning"
                    variant="standard"
                    className="w-full"
                    error={Boolean(errors?.mismatch)}
                    helperText={errors?.mismatch}
                  ></TextField>
                  <KeyIcon className="absolute top-1/2 right-0" />
                </div>
                <Button
                  variant="contained"
                  color="warning"
                  className="w-fit"
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  Register
                </Button>
                <div className="flex items-center justify-between">
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    className="mr-4 cursor-pointer"
                    onClick={(e) => handleOpenLogin(e)}
                  >
                    Already have an account? Log in now!
                  </Typography>
                </div>
              </Stack>
            </FormControl>
          </form>
          {registerWasSucceeded ? (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              You're account has been successfuly made.
            </Alert>
          ) : (
            ""
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Register;
