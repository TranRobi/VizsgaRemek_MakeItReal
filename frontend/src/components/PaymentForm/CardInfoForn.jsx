import React, { useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const formatCardNumber = (value) => {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1-")
    .replace(/-$/, "");
};

const formatExpiry = (value) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 4);
  if (cleaned.length < 3) return cleaned;
  return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
};

const CardInfoForm = ({ onSubmit, onBack, defaultValues }) => {
  const { user } = useContext(AuthContext);

  const {
    control,
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
        {/* Card Number */}
        <Grid item xs={12}>
          <Controller
            name="card-number"
            control={control}
            rules={{
              required: "Card Number is required",
              validate: (value) =>
                value.replace(/\D/g, "").length === 16 || "Must be 16 digits",
            }}
            render={({ field: { onChange, value = "", ...field } }) => (
              <TextField
                {...field}
                value={formatCardNumber(value)}
                onChange={(e) => onChange(e.target.value)}
                label="Card Number"
                fullWidth
                error={!!errors["card-number"]}
                helperText={errors["card-number"]?.message}
              />
            )}
          />
        </Grid>

        {/* Expiration Date */}
        <Grid item xs={6}>
          <Controller
            name="expiration-date"
            control={control}
            rules={{
              required: "Expiration date is required",
              pattern: {
                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                message: "Invalid format MM/YY",
              },
            }}
            render={({ field: { onChange, value = "", ...field } }) => (
              <TextField
                {...field}
                value={formatExpiry(value)}
                onChange={(e) => onChange(e.target.value)}
                label="Expiration Date (MM/YY)"
                fullWidth
                error={!!errors["expiration-date"]}
                helperText={errors["expiration-date"]?.message}
              />
            )}
          />
        </Grid>

        {/* CVV */}
        <Grid item xs={6}>
          <Controller
            name="cvv"
            control={control}
            rules={{
              required: "CVV is required",
              pattern: {
                value: /^\d{3}$/,
                message: "Must be 3 digits",
              },
            }}
            render={({ field: { onChange, value = "", ...field } }) => (
              <TextField
                {...field}
                value={value.replace(/\D/g, "").slice(0, 3)}
                onChange={(e) => onChange(e.target.value)}
                label="CVV"
                type="password"
                fullWidth
                inputProps={{ maxLength: 3 }}
                error={!!errors["cvv"]}
                helperText={errors["cvv"]?.message}
              />
            )}
          />
        </Grid>

        {/* Buttons */}
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
