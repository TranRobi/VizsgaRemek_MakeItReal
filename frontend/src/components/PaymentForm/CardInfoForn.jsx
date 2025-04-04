import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Grid } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const CardInfoForm = ({ onSubmit, onBack, defaultValues }) => {
  const { user } = React.useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, user]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Card Number"
            fullWidth
            {...register("cardNumber", { required: true })}
            error={!!errors.cardNumber}
            helperText={errors.cardNumber ? "Card Number is required" : ""}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Expiration Date (MM/YY)"
            fullWidth
            {...register("expiry", { required: true })}
            error={!!errors.expiry}
            helperText={errors.expiry ? "Expiration Date is required" : ""}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="CVV"
            fullWidth
            {...register("cvv", { required: true })}
            error={!!errors.cvv}
            helperText={errors.cvv ? "CVV is required" : ""}
          />
        </Grid>
        <Grid item xs={6}>
          <Button onClick={onBack} variant="outlined" fullWidth>
            Back
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Pay Now
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CardInfoForm;
