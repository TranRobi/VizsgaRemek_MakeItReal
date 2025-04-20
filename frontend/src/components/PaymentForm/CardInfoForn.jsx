import React, { useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const CardInfoForm = ({ onSubmit, onBack, defaultValues }) => {
  //getting the informations from the Contexts
  const { user } = useContext(AuthContext);
  //setting the default values for the form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //reload the form values when the user changes the default values
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, user]);

  //formatting the expiration date to be MM/YY
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length < 3) return cleaned;
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
  };
  
  //formatting the card number to be 4 digits separated by a dash
  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1-")
      .replace(/-$/, "");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Card Number */}
        <Box>
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
        </Box>

        {/* Expiration Date */}
        <Box display="flex" gap={2}>
          <Box flex={1}>
            <Controller
              name="expiration-date"
              control={control}
              rules={{
                required: "Expiration date is required",
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d[2-4]/,
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
          </Box>

          {/* CVV */}
          <Box flex={1}>
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
          </Box>
        </Box>

        {/* Buttons */}
        <Box display="flex" gap={2}>
          <Box flex={1}>
            <Button onClick={onBack} variant="outlined" fullWidth>
              Back
            </Button>
          </Box>
          <Box flex={1}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Pay Now
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default CardInfoForm;
