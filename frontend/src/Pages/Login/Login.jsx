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
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { AuthContext } from "../../context/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#b71c1c", // Dark red
    },
    secondary: {
      main: "#000000", // Black
    },
    background: {
      default: "#ffffff", // White
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

function Login({ close, open }) {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    "email-address": "",
    password: "",
  });

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenRegister = (e) => {
    open(e);
    close(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/api/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((response) => {
        if (response.status === 201) {
          setUser(true);
          localStorage.setItem("userID", response.data.id);
          close(e);
        }
      })
      .catch((err) => {
        if (err.response) {
          const status = err.response.status;
          if (status === 404) {
            setError("Account not found. Please register first.");
          } else if (status === 406) {
            setError("Incorrect password. Please try again.");
          } else {
            setError("Something went wrong. Please try again later.");
          }
        } else {
          setError("Unable to connect to the server.");
        }
      });
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
              Login
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
                    name="email-address"
                    id="email-address"
                    label="Email Address / Username"
                    variant="standard"
                    fullWidth
                    color="primary"
                    placeholder="Enter your email or username"
                    value={formData["email-address"]}
                    onChange={handleChange}
                  />
                  <MailOutlineIcon className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600" />
                </div>
                <div className="relative">
                  <TextField
                    name="password"
                    id="password"
                    label="Password"
                    type="password"
                    variant="standard"
                    fullWidth
                    color="primary"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <KeyIcon className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600" />
                </div>
                {error && (
                  <Alert
                    icon={<CancelIcon fontSize="inherit" />}
                    severity="error"
                  >
                    {error}
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5, fontWeight: "bold" }}
                >
                  Sign In
                </Button>
                <Typography
                  variant="body2"
                  color="secondary"
                  align="center"
                  className="cursor-pointer underline"
                  onClick={handleOpenRegister}
                >
                  Don't have an account? Register here!
                </Typography>
              </Stack>
            </FormControl>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Login;
