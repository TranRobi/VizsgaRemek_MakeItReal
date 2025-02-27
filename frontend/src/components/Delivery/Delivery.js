import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import { FormControl, Stack, Paper, TextField, Button } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

function Delivery() {
  const [deliveryInformation, setDeliveryInformation] = useState([]);
  useEffect(() => {
    axios
      .get("/api/delivery-information", {
        Cookie: document.cookie,
      })
      .then((response) => {
        setDeliveryInformation(response.data);
      });
  }, []);

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
                variant="standard"
                disabled
                value={deliveryInformation["name"]}
              ></TextField>
              <TextField
                variant="standard"
                disabled
                value={deliveryInformation["phone-number"]}
              ></TextField>
              <TextField
                variant="standard"
                value={deliveryInformation["country"]}
                disabled
              ></TextField>
              <TextField
                variant="standard"
                value={deliveryInformation["city"]}
                disabled
              ></TextField>
              <TextField
                variant="standard"
                value={
                  deliveryInformation["postal-code"] +
                  " " +
                  deliveryInformation["street-number"]
                }
                disabled
              ></TextField>

              <Button variant="contained" className="w-fit" onClick={() => {}}>
                Edit delivery information
              </Button>
            </Stack>
          </Paper>
        </FormControl>
      </div>
    </div>
  );
}

export default Delivery;
