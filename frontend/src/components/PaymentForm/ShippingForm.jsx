import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { TextField, Button, Grid } from "@mui/material";

const ShippingForm = ({ onNext, onBack, defaultValues }) => {
  //getting the informations from the Contexts
  const { storedUser } = React.useContext(AuthContext);
  //setting the default values for the form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //reload the form values when the user changes the default values
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, storedUser]);
  //submitting the form data to the parent component
  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Country"
            fullWidth
            {...register("country", { required: true })}
            error={!!errors.country}
            helperText={errors.country ? "Address is required" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="County"
            fullWidth
            {...register("county", { required: true })}
            error={!!errors.county}
            helperText={errors.county ? "Address is required" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            fullWidth
            {...register("street-number", { required: true })}
            error={!!errors["street-number"]}
            helperText={errors["street-number"] ? "Address is required" : ""}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="City"
            fullWidth
            {...register("city", { required: true })}
            error={!!errors.city}
            helperText={errors.city ? "City is required" : ""}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Zip Code"
            fullWidth
            {...register("postal-code", { required: true })}
            error={!!errors["postal-code"]}
            helperText={errors["postal-code"] ? "Zip Code is required" : ""}
          />
        </Grid>
        <Grid item xs={6}>
          <Button onClick={onBack} variant="outlined" fullWidth>
            Back
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Next
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
export default ShippingForm;
