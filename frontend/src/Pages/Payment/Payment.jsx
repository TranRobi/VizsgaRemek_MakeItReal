import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import PersonalInfoForm from "../../components/PaymentForm/PersonalInfoForm";
import ShippingForm from "../../components/PaymentForm/ShippingForm";
import { Container, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import CardInfoForm from "../../components/PaymentForm/CardInfoForn";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { CartContext } from "../../context/CartContext";

const MultiStepForm = () => {
  const { storedUser } = React.useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { cartList } = useContext(CartContext);

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
      <div className="min-h-[86vh]  flex flex-col md:flex-row items-center">
        <div className="w-3/4 h-full">
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
        <div class=" bg-white shadow-md rounded-2xl p-6 space-y-4 w-2/3  md:w-full">
          <h2 class="text-xl font-semibold text-gray-800">Payment Summary</h2>
          {cartList.map((item) => {
            return (
              <div class="flex justify-between text-gray-700">
                <img
                  src={`/api/products/images/${item.id}`}
                  className="w-1/9"
                />
                <div className="flex justify-between w-full">
                  <div>
                    <h4>Name: </h4>
                    <span>{item.name}</span>
                  </div>
                  <div>
                    <h4>Description: </h4>
                    <span className="w-1/3 ">{item.description}</span>
                  </div>
                  <div>
                    <h4>Quantity: </h4>
                    <span>{item.quantity}</span>
                  </div>
                  <div>
                    <h4>Price: </h4>
                    <span>{0}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div class="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span>$5.00</span>
          </div>
          <div className="">
            <hr class="my-2 border-gray-300" />

            <div class="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>$50.48</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MultiStepForm;
