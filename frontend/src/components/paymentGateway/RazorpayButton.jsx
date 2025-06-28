import React from "react";
import axios from "axios";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayButton = ({
  amount,
  name,
  email,
  label = "Pay Now",
}) => {
  const handlePayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load. Check your internet.");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/api/v1/payment/create-order", {
        amount,
      });
      const options = {
        key: "rzp_test_MVbXb0Dlze7Suw",
        amount: data.amount,
        currency: data.currency,
        name: "Your App",
        description: "Payment for Order",
        order_id: data.orderId,
        prefill: {
          name,
          email,
        },
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:3000/api/v1/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.success) {
            if (verifyRes.data.success) {
              window.location.href = "/payment-success";
            }
            } else {
              alert("❌ Payment Verification Failed");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            alert("❌ Error verifying payment");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      console.log(options)
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Create Order Error:", err);
      alert("❌ Failed to initiate payment");
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        backgroundColor: "#3399cc",
        color: "#fff",
        padding: "12px 24px",
        fontSize: "16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = "#287ba7";
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = "#3399cc";
      }}
    >
      {label}
    </button>
  );
};

export default RazorpayButton;
