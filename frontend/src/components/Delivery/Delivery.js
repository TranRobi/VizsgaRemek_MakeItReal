import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import { FormControl, Stack, Paper, TextField, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

function Delivery() {
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
  useEffect(() => {
    axios
      .get("/api/delivery-information", {
        Cookie: document.cookie,
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
  }, []);

  function sendChanges() {
    console.log("updated delivery information");
  }

  return (
    <div>
      <div className=" m-4">
        <FormControl fullWidth className="flex items-center">
          <Paper elevation={3} className="w-1/2 p-6">
            <h1 className="text-4xl font-serif text-black w-fit p-2 ">
              Order now
            </h1>
            <Stack gap={3}>
              <TextField
                label="Full name"
                variant="standard"
                disabled={enabled}
                value={deliveryInformation.name}
              ></TextField>
              <TextField
                variant="standard"
                disabled={enabled}
                value={deliveryInformation.phone_number}
              ></TextField>
              <TextField
                variant="standard"
                value={deliveryInformation.country}
                disabled={enabled}
              ></TextField>
              <TextField
                variant="standard"
                value={deliveryInformation.city}
                disabled={enabled}
              ></TextField>
              <TextField
                variant="standard"
                value={
                  deliveryInformation.postal_code +
                  " " +
                  deliveryInformation.street
                }
                disabled={enabled}
              ></TextField>

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
