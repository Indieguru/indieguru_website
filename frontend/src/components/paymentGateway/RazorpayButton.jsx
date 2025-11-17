import axios from "axios";
import axiosInstance from "../../config/axios.config";

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

const initiateRazorpayPayment = async ({ amount,bookingType,id}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Razorpay SDK failed to load. Check your internet.");
    return;
  }

  try {
    const order_response = await axiosInstance.post("/payment/create-order", {
      amount,bookingType,id});      
    const order_data = order_response.data
    console.log(order_data)
    if (order_data.success === false){
      alert ("FAILED TO FIND SESSION, TRY AGAIN")
      return
    } 
    return new Promise( (resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // KEY IN ENV
        amount: order_data.amount,
        currency: order_data.currency,
        name: "Indieguru",
        description: "Payment for ",
        order_id: order_data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axiosInstance.post("/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
              if (verifyRes.data.success) {
                resolve({
                  status: "success",
                  message: "Payment and booking successful",
                  data: verifyRes.data,
                });
              } else {
                reject({ status: "failed", message: "Payment verification failed" });
              }
            } catch (err) {
              console.error("Verification Error:", err);
              reject({ status: "failed", message: "Error verifying payment", error: err });
            }
          },
        theme: {
          color: "#3399cc",
        },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  })

  } catch (err) {
    console.error("Create Order Error:", err);
    alert('FAILED TO GENERATE PAYMENT LINK')
  }
};

export default initiateRazorpayPayment;