import React from "react";
import RazorpayButton from "../components/paymentGateway/RazorpayButton";

const PayTestPage = () => {
  const handleSuccess = (paymentData) => {
    alert("Payment Successful!");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Make a Test Payment</h1>
      <RazorpayButton
        amount={500}
        name="Aditya Narang"
        email="aditya@example.com"
        label="Pay ₹500"
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default PayTestPage;
