import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  FormControl,
  Stack,
  Paper,
  TextField,
  Button,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

function Delivery() {
  const { user } = useContext(AuthContext);
  const [deliveryInformation, setDeliveryInformation] = useState({
    name: "",
    phone_number: "",
    country: "",
    city: "",
    county: "",
    street: "",
    postal_code: "",
  });
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
  const [enabled, setEnabled] = useState(true);

  const handleChange = (event) => {
    if (!event.target) {
      setDeliveryInformation((values) => ({ ...values, expire_at: event.$d }));
    } else {
      setDeliveryInformation((values) => ({
        ...values,
        [event.target.name]: event.target.value,
      }));
    }
  };

  useEffect(() => {
    if (user) {
      axios
        .get("/api/delivery-information", {
          cookie: document.cookie,
        })
        .then((response) => {
          if (response.status === 200) {
            setDeliveryInformation({
              name: response.data.name,
              phone_number: response.data["phone-number"],
              country: response.data.country,
              city: response.data.city,
              county: response.data.county,
              street: response.data["street-number"],
              postal_code: response.data["postal-code"],
            });
          }
        });
    }
  }, [user]);

  function sendChanges() {
    axios
      .put(
        "/api/delivery-information",
        {
          name: deliveryInformation.name,
          country: deliveryInformation.country,
          city: deliveryInformation.city,
          county: deliveryInformation.county,
          "street-number": deliveryInformation.street,
          "postal-code": deliveryInformation.postal_code,
          "phone-number": deliveryInformation.phone_number,
        },
        {
          headers: { "content-type": "application/x-www-form-urlencoded" },
        }
      )
      .then((response) => {
        console.log(response);
      });
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen text-white p-6">
        <FormControl fullWidth className="flex items-center">
          <Paper
            elevation={4}
            className="w-full md:w-1/2 p-8 bg-white rounded-xl border border-red-600"
          >
            <Typography
              variant="h4"
              className="font-serif text-red-600 font-bold border-b border-red-600 pb-2 "
            >
              Delivery Information
            </Typography>

            <Stack gap={3}>
              <TextField
                label="Full name"
                variant="standard"
                disabled={enabled}
                name="name"
                value={deliveryInformation.name}
                onChange={handleChange}
                InputLabelProps={{ style: { color: "#111" } }}
              />
              <TextField
                variant="standard"
                disabled={enabled}
                name="phone_number"
                label="Phone number"
                value={deliveryInformation.phone_number}
                onChange={handleChange}
                InputLabelProps={{ style: { color: "#111" } }}
              />
              <TextField
                variant="standard"
                name="country"
                label="Country"
                value={deliveryInformation.country}
                onChange={handleChange}
                disabled={enabled}
                InputLabelProps={{ style: { color: "#111" } }}
              />
              <TextField
                variant="standard"
                name="county"
                label="County"
                value={deliveryInformation.county}
                onChange={handleChange}
                disabled={enabled}
                InputLabelProps={{ style: { color: "#111" } }}
              />
              <TextField
                variant="standard"
                name="city"
                label="City"
                value={deliveryInformation.city}
                onChange={handleChange}
                disabled={enabled}
                InputLabelProps={{ style: { color: "#111" } }}
              />
              <div className="flex w-full gap-4">
                <TextField
                  sx={{ width: "30%" }}
                  name="postal_code"
                  label="Postal Code"
                  variant="standard"
                  value={deliveryInformation.postal_code}
                  disabled={enabled}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: "#111" } }}
                />
                <TextField
                  sx={{ flexGrow: 1 }}
                  variant="standard"
                  name="street"
                  label="Street"
                  value={deliveryInformation.street}
                  disabled={enabled}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: "#111" } }}
                />
              </div>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#b30000",
                  },
                  width: "fit-content",
                  px: 3,
                }}
                onClick={() => {
                  if (enabled) {
                    setEnabled(false);
                  } else {
                    sendChanges();
                    setEnabled(true);
                  }
                }}
              >
                {enabled ? "Edit Delivery Information" : "Save Changes"}
              </Button>
            </Stack>
          </Paper>
        </FormControl>
      </div>
    </ThemeProvider>
  );
}

export default Delivery;
