'use client';
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomToast from "../../components/reusableComponent/CustomToast";
import { CountryCode, ValidationErrors, ValidationState } from "@/types/register";
import Link from "next/link";
import { api } from "@/lib/apiUtils";
import { USER_DATA_KEY } from "@/constants/loginConst";
import { LoadingScreen } from "@/components/animations/LoadingScreen";

const ResetPassword = () => {
    // const [deviceInfo, setDeviceInfo] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const forgotPasswordDetails = JSON.parse(
        sessionStorage.getItem("forgotPasswordDetails") || "false"
    );

    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const [validation, setValidation] = useState<ValidationState>({
        values: {
            password: "",
            confirmPassword: "",
        },
        errors: {},
        touched: {},
    });

    const handleFormSubmit = async (event: any) => {
        event.preventDefault();
        const { mobileno, countryCode, password, confirmPassword } = validation.values;

        let errors: ValidationErrors = {};
        if (!password) errors.password = "Password is required";
        if (password !== confirmPassword)
            errors.confirmPassword = "Passwords do not match";

        setValidation((prev) => ({ ...prev, errors }));

        if (Object.keys(errors).length > 0) return;

        const payload = {
            password,
            clientId: forgotPasswordDetails.clientId,
            // deviceInfo,
            // captcha: captchaValue,
        };

        try {
            setLoading(true);
            const response: any = await api.resetPassword(payload)
            if (response?.token) {
                toast.success(
                    <CustomToast
                        title="Reset password"
                        message="Sucessfully resetted the password"
                    />
                );
                localStorage.setItem("accessToken", response.token);
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.details));
                sessionStorage.clear()
                setTimeout(() => {
                    router.push("/");
                }, 1000);
            } else {
                toast.error(response?.error || response?.message ||"Something went wrong");
            }
        } catch (error : any) {
            console.error("Registration failed", error);
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target as HTMLInputElement | HTMLSelectElement;
        const errors = { ...validation.errors };

        if (name === "password" && !value) {
            errors.password = "Password is required";
        } else if (name === "password" && value.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        } else if (name === "password") {
            delete errors.password;
        }
        
        if (name === "confirmPassword" && value !== validation.values.password) {
            errors.confirmPassword = "Passwords do not match.";
        } else if (name === "confirmPassword") {
            delete errors.confirmPassword;
        }

        setValidation((prev) => ({
            ...prev,
            values: { ...prev.values, [name]: value },
            errors,
            touched: { ...prev.touched, [name]: true },
        }));
    };

    return (
    <> 
        <ToastContainer />
        {loading ? (
            <LoadingScreen />
        ) : (
        <div className="bg-white shadow-md rounded-lg mt-56">
            <div className="grid grid-cols-12">
                <div className="col-span-12 md:col-span-12 py-2 px-2 shadow-md">
                    <div className="flex justify-center h-full">
                        <div className="w-full max-w-md p-6">
                            <h1 className="text-center text-[#000000] text-2xl font-medium my-4">Reset Password</h1>
                            {/* <div className="login-bottom mb-4"></div> */}

                            <form onSubmit={handleFormSubmit} className="space-y-4 my-4">
                            {/* <div className="text-slate-600 text-sm">
                                <p>Confirm password should be match to the password</p>
                            </div> */}
                                <div>
                                    <input
                                        type="password"
                                        id="typePassword"
                                        placeholder="Password"
                                        className="w-full text-[#7f758e] p-3 text-sm border border-gray-300 cursor-auto focus:outline-none focus:ring-2 focus:border-none"
                                        name="password"
                                        value={validation.values.password}
                                        onChange={handleChange}
                                    />
                                    {validation.errors.password && (
                                        <div className="text-red-500 text-xs tracking-wide">{validation.errors.password}</div>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        id="typeConfirmPassword"
                                        placeholder="Confirm Password"
                                        className="w-full text-[#7f758e] p-3 text-sm font-normal border border-gray-300 cursor-auto focus:outline-none focus:ring-2 focus:border-none"
                                        name="confirmPassword"
                                        value={validation.values.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    {validation.errors.confirmPassword && (
                                        <div className="text-red-500 text-xs tracking-wide">{validation.errors.confirmPassword}</div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-300"
                                >
                                    {loading ? "Loading..." : "Reset Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>)}
    </>
    );
};

export default ResetPassword;