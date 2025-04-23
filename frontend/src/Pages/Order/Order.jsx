import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import Alert from "@mui/material/Alert";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import {
  createTheme,
  ThemeProvider,
  Card,
  Button,
  Container,
  Typography,
  CardContent,
} from "@mui/material";

import { CircularProgress } from "@mui/material";
import axios from "axios";

import PersonalInfoForm from "../../components/PaymentForm/PersonalInfoForm";
import CardInfoForm from "../../components/PaymentForm/CardInfoForn";
import ShippingForm from "../../components/PaymentForm/ShippingForm";
import { EmailContext } from "../../context/EmailContext";
import { useNavigate } from "react-router-dom";

function Order() {
  const theme = createTheme({
    palette: {
      primary: { main: "#b71c1c" },
      secondary: { main: "#000000" },
      background: { default: "#ffffff" },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
  });
  const navigate = useNavigate();

  const { setInfo } = useContext(EmailContext);

  const [size, setSize] = useState(100);
  const [material, setMaterial] = useState("PLA");
  const [colour, setColor] = useState("Black");
  const [STL, setSTL] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleFinalSubmit = async (cardData) => {
    try {
      const fullData = { ...formData, ...cardData };

      const formPayload = new FormData();
      formPayload.append("size", size);
      formPayload.append("material", material);
      formPayload.append("colour", colour);
      formPayload.append("quantity", quantity);

      if (STL) {
        formPayload.append("stl-file", STL);
      }

      // Append all form fields
      Object.entries(fullData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      const response = await axios.post("/api/order-custom", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      if (response.status === 201) {
        localStorage.setItem("orderInfo", res.data);
        setInfo(response.data);
      }
    } catch (error) {
      if (error.status === 406) {
        setError("Please upload a stl file");
      }
    }
  };

  const getPriceForStl = async () => {
    setLoading(true);
    const response = await axios
      .put(
        "/api/calculate-price",
        {
          material: material,
          "stl-file": STL,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .catch((err) => {
        if (err.status === 406) {
          setError("Please upload a stl file");
        }
      });

    setPrice(response.data.price);
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" className="m-6">
          <Card className="rounded-2xl shadow-lg p-4">
            {success && (
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                Order successfuly submitted!
              </Alert>
            )}
            {success ? (
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  navigate("/email-example");
                }}>
                Show email example
              </Button>
            ) : (
              ""
            )}
            <CardContent>
              <Typography
                variant="h5"
                className="text-black font-semibold mb-4">
                Payment Process
              </Typography>

              {step === 1 && (
                <PersonalInfoForm
                  onNext={handleNext}
                  defaultValues={formData}
                />
              )}
              {step === 2 && (
                <ShippingForm
                  onNext={handleNext}
                  onBack={handleBack}
                  defaultValues={formData}
                />
              )}
              {step === 3 && (
                <CardInfoForm
                  onSubmit={handleFinalSubmit}
                  onBack={handleBack}
                  defaultValues={formData}
                />
              )}
            </CardContent>

            {/* Size */}
            <div>
              <label className="block font-semibold">Size:</label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="border p-2 rounded w-full bg-red-950 text-white">
                {[50, 100, 150].map((s) => (
                  <option key={s} value={s}>
                    {s}%
                  </option>
                ))}
              </select>
            </div>

            {/* Material */}
            <div>
              <label className="block font-semibold mt-4">Material:</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="border p-2 rounded w-full bg-red-950 text-white">
                {["PLA", "PETG", "ABS"].map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="mt-4">
              <label className="block font-semibold mb-1">Color:</label>
              <div className="flex space-x-2">
                {[
                  "Red",
                  "Green",
                  "Blue",
                  "Yellow",
                  "Black",
                  "White",
                  "Gray",
                ].map((col) => (
                  <button
                    key={col}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      colour === col ? "border-black" : "border-white"
                    }`}
                    style={{ backgroundColor: col.toLowerCase() }}
                    onClick={() => setColor(col)}></button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-4">
              <label className="block font-semibold mb-1">Quantity:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="border p-2 rounded w-full bg-red-950 text-white"
              />
            </div>

            {/* STL File */}
            <div className="mt-4">
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, color: "#000" }}>
                STL File
              </Typography>
              <input
                type="file"
                accept=".stl"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.name.toLowerCase().endsWith(".stl")) {
                    setSTL(file);
                  } else {
                    alert("Please upload a valid .stl file");
                  }
                }}
                className="bg-[#f0f0f0] p-2 w-full text-black border-2 rounded"
              />
              {STL && (
                <Typography variant="body2" className=" text-sm text-gray-700">
                  Selected file: {STL.name}
                </Typography>
              )}
            </div>
            {error && (
              <Alert
                icon={<CancelIcon fontSize="inherit" />}
                severity="error"
                sx={{ marginTop: "10px" }}>
                {error}
              </Alert>
            )}
            <div className=" flex justify-between m-2">
              <Button
                onClick={() => {
                  getPriceForStl();
                }}
                variant="contained"
                color="primary">
                Calculate price
              </Button>
              {loading ? (
                <div className="justify-center flex p-2 items-center">
                  <h1 className="text-2xl text-black mr-3">
                    Calculating stl price...
                  </h1>
                  <CircularProgress color="error" />
                </div>
              ) : (
                <div className="text-2xl text-right">
                  {(price * quantity).toLocaleString("hu-HU", {
                    style: "currency",
                    currency: "HUF",
                  })}
                </div>
              )}
            </div>

            {/* Logos */}
            <div className="grid grid-cols-3 sm:grid-cols-6 justify-items-center py-6 border-t mt-6">
              {[
                "visa",
                "mastercard",
                "paypal",
                "applepay",
                "gpay",
                "revolut",
              ].map((img) => (
                <img
                  key={img}
                  src={`/${img}.svg`}
                  alt={img}
                  className="w-[60px] grayscale hover:grayscale-0 transition"
                />
              ))}
            </div>
          </Card>
        </Container>
      </ThemeProvider>
      <Footer />
    </>
  );
}

export default Order;
