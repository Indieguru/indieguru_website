import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Pencil } from "lucide-react";
import axiosInstance from "../../config/axios.config";
import useUserStore from "../../store/userStore";
import { auth } from "../../config/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";

export default function InputBox({
    field,
    value, // Ensure a default value is provided
    otpRequired,
}) {
    // console.log("Rendering InputBox with props:", { field, value, otpRequired }); // Debug log

    const { user, fetchUser } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [val, setVal] = useState(""); // Initialize with the provided value or default to an empty string
    const [error, setError] = useState(""); // State to track error messages
    const [otpSent, setOtpSent] = useState(false); // Track OTP sent status
  // Set the initial value from props
    useEffect(() => {
        setVal(value || ""); // Ensure value is never undefined
    }, [value]); // Update whenever the value prop changes

    const handleOnSave = async (e) => {
        e.preventDefault();

        setError(""); // Clear any previous error

        if (val.trim() === "") {
            setError("This field cannot be empty.");
            return;
        }

        if (field === "Email") {
            try {
                // First check if email exists
                const response = await axiosInstance.get(`/user/check-email/${val}`);
                if (response.status === 200) {
                    // Email is available, proceed with verification
                    const actionCodeSettings = {
                        url: `${window.location.origin}/finishSignIn`,
                        handleCodeInApp: true,
                    };
                    try {
                        await sendSignInLinkToEmail(auth, val, actionCodeSettings);
                        window.localStorage.setItem('emailForSignIn', val);
                        
                        // Update both email and gid in the database
                        console.log(auth.currentUser?.uid)
                        await axiosInstance.put("/user/update", {
                            email: val,
                            gid: auth.currentUser?.uid || null // Include the Google UID if available
                        });
                        
                        alert('Verification email sent! Please check your inbox and click the link to verify.');
                        setIsEditing(false);
                        fetchUser(); // Refresh user data
                    } catch (error) {
                        console.error('Error sending verification email:', error);
                        setError('Failed to send verification email. Please try again.');
                    }
                }
            } catch (error) {
                if (error.response?.status === 400) {
                    setError(error.response.data.message);
                } else {
                    setError("Failed to verify email. Please try again.");
                }
                return;
            }
        } else {
            setIsEditing(false);
            if (otpRequired) {
                alert("OTP required. Please verify before saving.");
            } else {
                updateField();
            }
        }
    };

    const updateField = () => {
        let update = "";
        if (field == "Contact No") {
            update = "phone";
        }  else if (field == "First Name") {
            update = "firstName";
        } else if (field == "Last Name") {
            update = "lastName";
        } else if (field == "Gender") {
            update = 'gender';
        }
        
        axiosInstance
            .put("/user/update", {
                [update]: val,
            })
            .then((res) => {
                if (res.status === 200) {
                    fetchUser();
                } else {
                    setError("Failed to update. Please try again.");
                }
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to update. Please try again.");
            });
    };

    const handleGetOtp = () => {
        // Simulate OTP request
        alert("OTP sent successfully!");
        setOtpSent(true); // Mark OTP as sent
    };

    return (
        <div>
            <label className="block text-sm font-medium text-[#232636] mb-1">{field}</label>
            <div className="relative group">
                {isEditing ? (
                    <div>
                        {field === "Gender" ? (
                            <select
                                value={val || ""} // Ensure value is never undefined
                                onChange={(e) => setVal(e.target.value)}
                                className="w-full border-[#d8d8d8] p-2"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        ) : (
                            <Input
                                name={field}
                                value={val || ""} // Ensure value is never undefined
                                onChange={(e) => {
                                    setVal(e.target.value);
                                }}
                                className="w-full border-[#d8d8d8]"
                            />
                        )}
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        <div className="flex gap-2 mt-2">
                            {field === "Email" ? (
                                <>
                                    <Button
                                        onClick={handleOnSave}
                                        className="bg-blue-800 text-white hover:bg-[#143d65]"
                                    >
                                        Verify
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsEditing(false);
                                            setVal(value);
                                            setError("");
                                            setOtpSent(false);
                                        }}
                                        className="bg-gray-300 text-black hover:bg-gray-400"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {otpRequired && !otpSent && (
                                        <Button
                                            onClick={handleGetOtp}
                                            className="bg-blue-800 text-white hover:bg-[#143d65]"
                                        >
                                            Get OTP
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleOnSave}
                                        className="bg-blue-800 text-white hover:bg-[#143d65]"
                                        disabled={otpRequired && !otpSent}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsEditing(false);
                                            setVal(value);
                                            setError("");
                                            setOtpSent(false);
                                        }}
                                        className="bg-gray-300 text-black hover:bg-gray-400"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    
                    <div className="relative">
                        <Input
                            value={val || ""} // Ensure value is never undefined
                            readOnly
                            className="w-full border-[#d8d8d8] bg-[#f9fbff] pr-10"
                        />
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#003265] bg-transparent hover:bg-[#f5f5f5] p-1"
                        >
                            <Pencil size={16} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}