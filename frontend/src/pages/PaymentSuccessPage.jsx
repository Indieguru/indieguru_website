import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle } from "lucide-react";
import { confirmPaymentSuccess } from "../services/emailService";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const hasSent = useRef(false);
  
  const courseDetails = {
    title: "Resume building workshop",
    date: "18-05-2025",
    price: "49"
  };

  useEffect(() => {
    const confirmPayment = async () => {
      if (hasSent.current) return;
      hasSent.current = true;

      try {
        const registrationId = localStorage.getItem('registrationId');
        await confirmPaymentSuccess(registrationId);
        // Clear the registration ID from local storage after successful confirmation
        localStorage.removeItem('registrationId');
      } catch (error) {
        console.error("Payment confirmation failed:", error);
        alert("Failed to confirm payment. Please contact support.");
      }
    };

    confirmPayment();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div>
            <CheckCircle className="w-24 h-24 text-green-500" />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for enrolling in our course. Your payment has been processed successfully.
          </p>

          <div className="bg-gray-50 p-5 rounded-lg mb-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">Order Details</h3>
            {courseDetails ? (
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium">{courseDetails.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{courseDetails.date?.split('-')[0] || "To be announced"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium text-green-600">₹{courseDetails.price}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">Course details not available</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800">
              <p className="font-medium">What happens next?</p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-left">
                <li>You'll receive a confirmation email shortly</li>
                <li>Course access details will be sent before the start date</li>
                <li>Our team will contact you with any additional information</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')}
            className="bg-blue-800 hover:bg-blue-700 text-white"
          >
            Return to Courses
          </Button>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => window.open('mailto:team@myindieguru.com')}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;