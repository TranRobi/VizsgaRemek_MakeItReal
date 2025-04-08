import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import { FormControl, Stack, Paper, TextField, Button } from "@mui/material";
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
  const [enabled, setEnabled] = useState(true);

  const handleChange = (event) => {
    console.log(event.target.value);
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
    console.log(document.cookie);
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
    <div>
      <div className="m-4">
        <FormControl fullWidth className="flex items-center">
          <Paper
            elevation={3}
            className="w-full md:w-1/2 p-6 active:text-red-700 ease-in duration-75 transition"
          >
            <h1 className="text-4xl font-serif text-black w-fit p-2 ">
              Delivery information
            </h1>
            <Stack gap={3}>
              <TextField
                label="Full name"
                variant="standard"
                disabled={enabled}
                name="name"
                value={deliveryInformation.name}
                onChange={(e) => {
                  console.log("delivery informatio");
                  handleChange(e);
                }}
              ></TextField>
              <TextField
                variant="standard"
                disabled={enabled}
                name="phone_number"
                label="Phone number"
                value={deliveryInformation.phone_number}
                onChange={(e) => {
                  handleChange(e);
                }}
              ></TextField>
              <TextField
                variant="standard"
                name="country"
                label="Country"
                value={deliveryInformation.country}
                onChange={(e) => {
                  handleChange(e);
                }}
                disabled={enabled}
              ></TextField>
              <TextField
                variant="standard"
                name="county"
                label="County"
                value={deliveryInformation.county}
                onChange={(e) => {
                  handleChange(e);
                }}
                disabled={enabled}
              ></TextField>
              <TextField
                variant="standard"
                name="city"
                label="City"
                value={deliveryInformation.city}
                onChange={(e) => {
                  handleChange(e);
                }}
                disabled={enabled}
              ></TextField>
              <div className="flex w-full">
                <TextField
                  sx={{ width: "10%", marginRight: "1.5rem" }}
                  name="postal_code"
                  label="Postal Code"
                  variant="standard"
                  value={deliveryInformation.postal_code}
                  disabled={enabled}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                ></TextField>
                <TextField
                  sx={{ width: "100%" }}
                  variant="standard"
                  name="street"
                  label="Street"
                  value={deliveryInformation.street}
                  disabled={enabled}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                ></TextField>
              </div>

              <Button
                variant="contained"
                className="w-fit"
                onClick={() => {
                  if (enabled) {
                    setEnabled(false);
                  } else {
                    //send changes to the backend server
                    sendChanges();
                    setEnabled(true);
                  }
                }}
              >
                {enabled ? "Edit delivery information" : "Save changes"}
              </Button>
            </Stack>
          </Paper>
        </FormControl>
      </div>
    </div>
  );
}

export default Delivery;
