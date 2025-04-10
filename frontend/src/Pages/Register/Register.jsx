import React, { useState } from "react";
import {
  Button,
  createTheme,
  FormControl,
  TextField,
  ThemeProvider,
  Typography,
  Alert,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#b71c1c", // Red
    },
    secondary: {
      main: "#000000", // Black
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

function Register({ close, open }) {
  const [registerWasSucceeded, setRegisterWasSucceeded] = useState(false);
  const [formData, setFormData] = useState({
    "display-name": "",
    "email-address": "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    short: "",
    mismatch: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({ short: "", mismatch: "" }); // Reset on change
  };

  const validateFields = () => {
    let errorFound = false;
    const newErrors = { short: "", mismatch: "" };

    if (formData.password.length < 5) {
      newErrors.short = "Password must contain at least 5 characters";
      errorFound = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.mismatch = "Passwords don't match";
      errorFound = true;
    }

    setErrors(newErrors);
    return errorFound;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) return;

    axios
      .post("/api/register", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setRegisterWasSucceeded(true);
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setRegisterWasSucceeded(false);
      });
  };

  const handleOpenLogin = (e) => {
    open(e);
    close(e);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="w-full h-screen flex justify-center items-center backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-11/12 max-w-md">
          <div className="flex justify-between items-center mb-6">
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "black" }}
            >
              Register
            </Typography>
            <CancelIcon
              fontSize="large"
              className="text-red-700 cursor-pointer"
              onClick={close}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <Stack spacing={3}>
                <div className="relative">
                  <TextField
                    required
                    name="display-name"
                    id="display-name"
                    label="Username"
                    variant="standard"
                    fullWidth
                    color="primary"
                    placeholder="Enter your username"
                    value={formData["display-name"]}
                    onChange={handleChange}
                  />
                  <PersonIcon className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600" />
                </div>
                <div className="relative">
                  <TextField
                    required
                    name="email-address"
                    id="email-address"
                    label="Email Address"
                    variant="standard"
                    fullWidth
                    color="primary"
                    placeholder="Enter your email"
                    value={formData["email-address"]}
                    onChange={handleChange}
                  />
                  <MailOutlineIcon className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600" />
                </div>
                <div className="relative">
                  <TextField
                    required
                    name="password"
                    id="password"
                    type="password"
                    label="Password"
                    variant="standard"
                    fullWidth
                    color="primary"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.short}
                    helperText={errors.short}
                  />
                  <KeyIcon className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600" />
                </div>
                <div className="relative">
                  <TextField
                    required
                    name="confirmPassword"
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    variant="standard"
                    fullWidth
                    color="primary"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.mismatch}
                    helperText={errors.mismatch}
                  />
                  <KeyIcon className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600" />
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5, fontWeight: "bold" }}
                >
                  Create Account
                </Button>
                <Typography
                  variant="body2"
                  color="secondary"
                  align="center"
                  className="cursor-pointer underline"
                  onClick={handleOpenLogin}
                >
                  Already have an account? Log in now!
                </Typography>
              </Stack>
            </FormControl>
          </form>
          {registerWasSucceeded && (
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
              sx={{ mt: 3 }}
            >
              Your account has been successfully created.
            </Alert>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Register;
