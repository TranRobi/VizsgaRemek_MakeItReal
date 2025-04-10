import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  FormControl,
  Stack,
  TextareaAutosize,
  TextField,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";

import Paper from "@mui/material/Paper";

function Order() {
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
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    country: "",
    city: "",
    address: "",
    description: "",
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
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <div className="m-4 h-screen flex items-center justify-center">
          <FormControl fullWidth className="flex items-center ">
            <Paper elevation={3} className="w-full lg:w-1/2 p-6 ">
              <h1 className="text-4xl font-serif text-black w-fit p-2">
                Order now
              </h1>
              <Stack gap={3}>
                <TextField
                  label="Full name"
                  variant="standard"
                  placeholder="Enter your full name"
                  id="fullname"
                  name="fullname"
                  onChange={handleChange}
                ></TextField>
                <TextField
                  label="Email"
                  variant="standard"
                  placeholder="Enter your email address"
                  id="email"
                  name="email"
                  onChange={handleChange}
                ></TextField>
                <TextField
                  label="Phone number"
                  variant="standard"
                  placeholder="Enter your phone number"
                  id="phonenumber"
                  name="phonenumber"
                  onChange={handleChange}
                ></TextField>
                <TextField
                  label="Country"
                  variant="standard"
                  placeholder="Enter your country"
                  id="country"
                  name="country"
                  onChange={handleChange}
                ></TextField>
                <TextField
                  label="City"
                  variant="standard"
                  placeholder="Enter your city"
                  id="city"
                  name="city"
                  onChange={handleChange}
                ></TextField>
                <TextField
                  label="Address"
                  variant="standard"
                  placeholder="Enter city address"
                  id="address"
                  name="address"
                  onChange={handleChange}
                ></TextField>
                <label>Product description</label>
                <TextareaAutosize
                  aria-label="minimum height"
                  variant="outlined"
                  minRows={3}
                  placeholder="Descripe your prouduct, that you need us to make and design"
                  name="description"
                  onChange={handleChange}
                ></TextareaAutosize>
                <Button
                  variant="contained"
                  className="w-fit"
                  onClick={() => {
                    console.log(formData);
                  }}
                >
                  Submit order!
                </Button>
              </Stack>
            </Paper>
          </FormControl>
        </div>
      </ThemeProvider>
      <Footer />
    </>
  );
}

export default Order;
