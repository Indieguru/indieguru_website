import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Pencil } from "lucide-react";
import axiosInstance from "../../config/axios.config";
import useUserStore from "../../store/userStore";

export default function InputBox({
    field,
    value = "", // Ensure a default value is provided
    otpRequired,
}) {
    console.log("Rendering InputBox with props:", { field, value, otpRequired }); // Debug log

    const { user, fetchUser } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [val, setVal] = useState(value); // Initialize with the provided value or default to an empty string
    const [error, setError] = useState(""); // State to track error messages
    const [otpSent, setOtpSent] = useState(false); // Track OTP sent status

    const handleOnSave = (e) => {
        e.preventDefault();

        setError(""); // Clear any previous error

        if (val.trim() === "") {
            setError("This field cannot be empty."); // Set error message
            return;
        }
        setIsEditing(false);
        if (otpRequired) {
            alert("OTP required. Please verify before saving.");
        } else {
            axiosInstance
                .put("/user/update", {
                    lastName: val,
                })
                .then((res) => {
                    if (res.status === 200) {
                        fetchUser();
                        setVal(res.data.lastName); // Update the local state with the new value
                    } else {
                        setError("Failed to update. Please try again."); // Set error message
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setError("Failed to update. Please try again."); // Set error message
                });
        }
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
                        <Input
                            name={field}
                            value={val}
                            onChange={(e) => {
                                setVal(e.target.value);
                            }}
                            className="w-full border-[#d8d8d8]"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        <div className="flex gap-2 mt-2">
                            {otpRequired && !otpSent && (
                                <Button
                                    onClick={handleGetOtp}
                                    className="bg-[#003265] text-white hover:bg-[#143d65]"
                                >
                                    Get OTP
                                </Button>
                            )}
                            <Button
                                onClick={handleOnSave}
                                className="bg-[#003265] text-white hover:bg-[#143d65]"
                                disabled={otpRequired && !otpSent} // Disable save if OTP is required but not sent
                            >
                                Save
                            </Button>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsEditing(false);
                                    setVal(value); // Reset to original value
                                    setError(""); // Clear error on cancel
                                    setOtpSent(false); // Reset OTP sent status
                                }}
                                className="bg-gray-300 text-black hover:bg-gray-400"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <Input
                            value={val} // Use the controlled state value
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