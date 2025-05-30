import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

import PersonalInfoForm from "../../components/PaymentForm/PersonalInfoForm";
import ShippingForm from "../../components/PaymentForm/ShippingForm";
import CardInfoForm from "../../components/PaymentForm/CardInfoForn";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import {
  Container,
  createTheme,
  Typography,
  Card,
  CardContent,
  Divider,
  ThemeProvider,
  Button,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EmailContext } from "../../context/EmailContext";

const MultiStepForm = () => {
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
  const navigate = useNavigate();

  const { storedUser } = useContext(AuthContext);
  const { cartList, productItems } = useContext(CartContext);
  const { setInfo } = useContext(EmailContext);

  const shipPrice = cartList.length === 0 ? 0 : 3000; // Assuming 3000 HUF for shipping cost

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({}); // Loading state for data fetching

  // Fetch all data
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        if (storedUser?.[1]) {
          const userResponse = await axios.get("/api/delivery-information", {
            headers: {
              Cookie: document.cookie,
            },
          });
          setFormData(userResponse.data); // Set delivery information
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [storedUser, productItems]); // Dependency on storedUser and productItems

  // Stepping between forms
  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  //submit order
  const submitOrder = async (finalData) => {
    try {
      const res = await axios.post("/api/order", finalData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        setInfo(res.data);
        localStorage.setItem("orderInfo", res.data);
        localStorage.setItem("cart", []);
        setShowAlert(true);
      }
    } catch {
      (err) => {
        console.log(err);
      };
    }
  };
  // Sending final form to the backend
  const handlePaymentSubmit = async (data) => {
    let productsCart = {
      products: cartList,
    };
    const finalData = { ...formData, ...data, ...productsCart };
    setLoading(true);
    await submitOrder(finalData);
    setLoading(false);
  };

  // Calculate the total price
  const calcTotal = () => {
    let total = 0;
    cartList.forEach((item) => {
      total += item.price * item.quantity;
    });

    return total + shipPrice;
  };

  return (
    <>
      <Navbar />
      {showAlert ? (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          sx={{ width: "75%", margin: "auto" }}
        >
          Order has been submited!
        </Alert>
      ) : (
        ""
      )}
      <ThemeProvider theme={theme}>
        <div className="min-h-[86vh] py-10 px-4 md:px-10 flex flex-col lg:flex-row gap-10">
          {/* Step Form */}
          <div className="w-full lg:w-2/3">
            <Container maxWidth="md">
              <Card className="rounded-2xl shadow-lg">
                <CardContent>
                  <Typography
                    variant="h5"
                    className="text-black font-semibold mb-4"
                  >
                    Payment Process
                  </Typography>
                  {loading ? (
                    <div className="justify-center flex p-2 items-center">
                      <h1 className="text-2xl text-black mr-3">
                        Submitting order!
                      </h1>
                      <CircularProgress color="error" />
                    </div>
                  ) : (
                    ""
                  )}
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
                      onSubmit={handlePaymentSubmit}
                      onBack={handleBack}
                      defaultValues={formData}
                    />
                  )}
                </CardContent>
                {/* Payment logos */}
                <div className="grid grid-cols-3 sm:grid-cols-6 justify-items-center py-6 border-t">
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
              {showAlert ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    navigate("/email-example");
                    location.reload();
                  }}
                >
                  Show email example
                </Button>
              ) : (
                ""
              )}
            </Container>
          </div>

          {/* Summary Card */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
              <Typography variant="h6" className="text-black font-semibold">
                Payment Summary
              </Typography>

              <div className="overflow-y-scroll h-[500px]">
                {cartList?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between border-b pb-4"
                  >
                    <img
                      src={`/api/products/images/${item.id}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-1 space-y-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Qty: {item.quantity}</span>
                        <span>
                          {(item.price * item.quantity).toLocaleString(
                            "hu-HU",
                            { style: "currency", currency: "HUF" }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm text-gray-700">
                <span>Shipping</span>
                <span>
                  {shipPrice.toLocaleString("hu-HU", {
                    style: "currency",
                    currency: "HUF",
                  })}
                </span>
              </div>

              <Divider className="my-2" />

              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>
                  {calcTotal().toLocaleString("hu-HU", {
                    style: "currency",
                    currency: "HUF",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
      <Footer />
    </>
  );
};

export default MultiStepForm;
