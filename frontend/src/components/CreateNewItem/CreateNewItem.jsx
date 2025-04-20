import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  createTheme,
  Paper,
  ThemeProvider,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { ProductsContext } from "../../context/ProductsContext";

function CreateNewItem({ setOpen }) {
  //creating a theme for the page
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
  //declaring states
  const [STL, setSTL] = useState();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    "stl-file": null,
  });
  //getting the informations from the Contexts
  const { addProduct } = useContext(ProductsContext);

  useEffect(() => {
    //checking if the file is selected and setting the formData
    setFormData((prev) => ({ ...prev, "stl-file": STL }));
  }, [STL]);

  //handling the changes in the input fields
  const handleChange = (event) => {
    if (!event.target) return;
    setFormData((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  //handling the submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct(formData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        className="flex justify-center items-center min-h-screen w-full backdrop-blur-sm"
        sx={{ p: 4 }}
      >
        <Paper
          elevation={5}
          sx={{
            width: { xs: "100%", md: "50%" },
            padding: 4,
            backgroundColor: "#fff",
            color: "#000",
            border: "2px solid #d32f2f",
            borderRadius: "16px",
          }}
        >
          <Box className="flex justify-between items-center mb-4">
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#d32f2f" }}
            >
              Add New Product
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CancelIcon fontSize="large" sx={{ color: "#d32f2f" }} />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              variant="outlined"
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              variant="outlined"
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{ mb: 1, fontWeight: 500, color: "#000" }}
              >
                STL File
              </Typography>
              <input
                type="file"
                name="stl-file"
                accept="*.stl"
                onChange={(e) => setSTL(e.target.files[0])}
                className="bg-[#f0f0f0] p-2 w-full text-black border-2 rounded"
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#d32f2f",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#9a0007",
                },
                fontWeight: "bold",
                textTransform: "none",
                px: 4,
                py: 1,
              }}
            >
              Add Product
            </Button>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default CreateNewItem;
