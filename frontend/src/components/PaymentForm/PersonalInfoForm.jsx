import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { TextField, Button, Grid } from "@mui/material";

const PersonalInfoForm = ({ onNext, defaultValues }) => {
  const { storedUser, user } = React.useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, user]);

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Full Name"
            fullWidth
            {...register("name", { required: true })}
            error={!!errors.fullName}
            helperText={errors.fullName ? "Full Name is required" : ""}
            InputLabelProps={user ? { shrink: true } : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            fullWidth
            {...register("phone-number", { required: true })}
            error={!!errors.fullName}
            helperText={errors.fullName ? "Full Name is required" : ""}
            InputLabelProps={user ? { shrink: true } : "{ shrink: true }"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register("email", { required: true })}
            error={!!errors.email}
            helperText={errors.email ? "Email is required" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Next
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PersonalInfoForm;
