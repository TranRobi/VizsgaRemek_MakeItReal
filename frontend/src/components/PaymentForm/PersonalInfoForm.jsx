import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { TextField, Button, Box } from "@mui/material";

const PersonalInfoForm = ({ onNext, defaultValues }) => {
  //getting the informations from the Contexts
  const { user } = React.useContext(AuthContext);
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
  }, [defaultValues, reset, user]);
  //submitting the form data to the parent component
  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Full Name */}
        <Box>
          <TextField
            label="Full Name"
            fullWidth
            {...register("name", { required: true })}
            error={!!errors.name}
            helperText={errors.name ? "Full Name is required" : ""}
            InputLabelProps={user ? { shrink: true } : {}}
          />
        </Box>

        {/* Phone Number */}
        <Box>
          <TextField
            label="Phone Number"
            fullWidth
            {...register("phone-number", { required: true })}
            error={!!errors["phone-number"]}
            helperText={
              errors["phone-number"] ? "Phone Number is required" : ""
            }
            InputLabelProps={user ? { shrink: true } : {}}
          />
        </Box>

        {/* Email */}
        <Box>
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register("email-address", { required: true })}
            error={!!errors["email-address"]}
            helperText={errors["email-address"] ? "Email is required" : ""}
          />
        </Box>

        {/* Submit Button */}
        <Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Next
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default PersonalInfoForm;
