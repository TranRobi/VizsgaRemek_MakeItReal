import React, { useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import PersonalInfoForm from "../../components/PaymentForm/PersonalInfoForm";
import ShippingForm from "../../components/PaymentForm/ShippingForm";
import { Container, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import CardInfoForm from "../../components/PaymentForm/CardInfoForn";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const MultiStepForm = () => {
  const { storedUser } = React.useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    console.log(storedUser);
    if (storedUser[1]) {
      axios
        .get("/api/delivery-information", {
          Cookie: document.cookie,
        })
        .then((response) => {
          setFormData(response.data);
        });
    }
  }, []);

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePaymentSubmit = (data) => {
    const finalData = { ...formData, ...data };
    console.log("Final Payment Data:", finalData);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[86vh] flex flex-col md:flex-row items-center">
        <div className="w-3/4">
          <Container maxWidth="md">
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
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
                    onSubmit={handlePaymentSubmit}
                    onBack={handleBack}
                    defaultValues={formData}
                  />
                )}
              </CardContent>
            </Card>
          </Container>
          <div className="flex w-full items-center justify-center grid-cols-3">
            <div className="grid grid-cols-3">
              <img src="visa.jpg" alt="" className="w-[80px] m-5 " />
              <img src="mastercard.png" alt="" className="w-[80px] m-5 " />
              <img src="paypal.png" alt="" className="w-[80px] m-5 " />
              <img src="applePay.png" alt="" className="w-[80px] m-5 " />
              <img src="gpay.png" alt="" className="w-[80px] m-5 " />
              <img src="revolut.png" alt="" className="w-[80px] m-5 " />
            </div>
          </div>
        </div>
        <div className="w-3/4 h-[80vh] bg-gray-200 m-5"></div>
      </div>
      <Footer />
    </>
  );
};

export default MultiStepForm;
