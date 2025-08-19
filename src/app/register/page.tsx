'use client';
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomToast from "../../components/reusableComponent/CustomToast";
import { CountryCode, ValidationErrors, ValidationState } from "@/types/register";
import Link from "next/link";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { api } from "@/lib/apiUtils";
import { OTP_EXPIRE_TIME, USER_DATA_KEY } from "@/constants/loginConst";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { useApp } from "../providers";
// import { jwtDecode } from "jwt-decode";

declare global {
  interface Window {
    OTPlessSignin: any;
  }
}

const Register = () => {
    // const [deviceInfo, setDeviceInfo] = useState<string>("");
    const [privacyPolicy, setPrivacyPolicy] = useState<boolean>(false);
    const [isRecaptcha, setIsRecaptcha] = useState<boolean>(false);
    const [recaptchaClientId, setRecaptchaClientId] = useState<string>("");
    const [captchaValue, setCaptchaValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [otpType, setOtpType] = useState<number>(1);
    const [countryCodes, setCountryCodes] = useState<CountryCode[]>([]);
    const router = useRouter();

    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const [validation, setValidation] = useState<ValidationState>({
        values: {
            mobileno: "",
            countryCode: countryCodes.length > 0 ? countryCodes[0]?.countryCode : "",
            password: "",
            confirmPassword: "",
        },
        errors: {},
        touched: {},
    });
    const { configData } = useApp();

    // const fetchLoginCred = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await api.getConfigData();
    //         const domain = response?.domain;
    //         setRecaptchaClientId(domain?.recatchKey || "");
    //         setIsRecaptcha(domain?.isRecatchEnable);
    //         setOtpType(domain?.sendMobileOTPType);
    //     } catch (error) {
    //         console.error("Error fetching config data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchCountryCodes = async () => {
        try {
            setLoading(true);
            const response = await api.countryCodes();
            setCountryCodes(response || []);
            setValidation((prev) => ({
                ...prev,
                values: {
                ...prev.values,
                countryCode: response?.[0]?.countryCode || "+91",
                },
            }));
        } catch (error) {
            console.error("Error fetching config data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(configData) {
            setRecaptchaClientId(configData?.domain?.recatchKey || "");
            setIsRecaptcha(configData?.domain?.isRecatchEnable);
            setOtpType(configData?.domain?.sendMobileOTPType);
        }
    },[configData])

    useEffect(() => {
        // fetchLoginCred();
        fetchCountryCodes();
        // setDeviceInfo(navigator.userAgent);
    }, []);

    const handleFormSubmit = async (event: any) => {
        event.preventDefault();
        const { mobileno, countryCode, password, confirmPassword } = validation.values;

        let errors: ValidationErrors = {};
        if (!mobileno) errors.mobileno = "Mobile Number is required";
        if (!password) errors.password = "Password is required";
        if (isRecaptcha && !captchaValue) errors.captchaValue = "Captcha is required";
        if (!privacyPolicy)
            errors.privacyPolicy = "Please accept the terms & conditions";
        if (password !== confirmPassword)
            errors.confirmPassword = "Passwords do not match";

        setValidation((prev) => ({ ...prev, errors }));

        if (Object.keys(errors).length > 0) return;

        const payload = {
            mobileNo: mobileno,
            countryCode: countryCode ? countryCode.replace("+", "") : countryCodes?.[0]?.countryCode.replace("+", ""),
            password,
            // deviceInfo,
            // captcha: captchaValue,
        };

        try {
            setLoading(true);
            const response: any = await api.signupClient(payload)
            if (response?.clientId) {
                if (otpType === 2 && typeof window !== "undefined" && window.OTPlessSignin) {
                    window.OTPlessSignin.initiate({
                        channel: "PHONE",
                        phone: mobileno,
                        countryCode: countryCode || "+91",
                    });
                }
                toast.success(
                    <CustomToast
                        title="Sign Up App"
                        message="Otp sent successfully"
                    />
                )
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(response));
                const expiryTime = response?.otpExpired * 60;
                sessionStorage.setItem(OTP_EXPIRE_TIME, expiryTime.toString());
                setTimeout(() => {
                    router.push("/otp-validation");
                }, 1000);
            } else {
                toast.error(response.message ||"Otp validation failed");
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

        let updatedValues = { ...validation.values, [name]: value };
        if (name === "countryCode") {
            updatedValues.countryCode = value;
        }
        const selectedCountry = countryCodes.find(c => c.countryCode === updatedValues.countryCode);
        const maxNumberLength = selectedCountry?.maxNumber || 10;

        if (name === "mobileno") {
            const mobileRegex = /^[0-9]*$/;
            if(!value) {
              errors.mobileno = "Mobile Number is required.";
            } else if (!mobileRegex.test(value)) {
              errors.mobileno = "Mobile number must be numeric.";
            } else if (value.length !== maxNumberLength) {
              errors.mobileno = `Mobile number must be ${maxNumberLength} digits.`;
            } else {
              delete errors.mobileno;
            }
        }
        
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

    // const handleSuccess = (response: any) => {
    //     if (response.credential) {
    //       // Decode the JWT token to get user details
    //       const decoded: any = jwtDecode(response.credential);
    //       console.log("User Info:", decoded);
    //       /**
    //        * decoded contains:
    //        * - name: User's full name
    //        * - email: User's email
    //        * - picture: Profile picture URL
    //        * - sub: Google user ID
    //        */
    
    //       // Send user data to the backend
    //     //   console.log("decoded",decoded);
    //     }
    // };

    const onCaptchaChange = (value: string | null) => {
        setCaptchaValue(value || "");
    };

    const handlePrivacyPolicy = () => {
        setPrivacyPolicy((prev) => !prev);
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
                            <h1 className="text-center text-[#000000] text-2xl font-medium my-4">Sign Up</h1>
                            <div className="login-bottom mb-4"></div>

                            <form onSubmit={handleFormSubmit} className="space-y-4 my-4">
                                <div className="mb-4">
                                    <div className="flex align-items-center">
                                        <select
                                            value={validation.values.countryCode}
                                            onChange={handleChange}
                                            name="countryCode"
                                            className="w-30 text-[#7f758e] p-3 text-sm border border-gray-300 cursor-auto focus:outline-none focus:ring-2 focus:border-none"
                                            >
                                            {countryCodes.map((country) => (
                                                <option key={country.id} value={country.countryCode}>
                                                  {country.countryName} ({country.countryCode})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            id="typeMobile"
                                            placeholder={otpType === 2 ? "WhatsApp Mobile No." : "Mobile No."}
                                            className="w-full text-[#7f758e] p-3 text-sm border border-gray-300 cursor-auto focus:outline-none focus:ring-2 focus:border-none"
                                            name="mobileno"
                                            maxLength={countryCodes.find(c => c.countryCode === validation.values.countryCode)?.maxNumber || 10}
                                            value={validation.values.mobileno}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                                                    e.preventDefault(); // Blocks non-numeric keys
                                                }
                                            }}
                                        />
                                    </div>
                                    {validation.errors.mobileno && (
                                        <div className="text-red-500 text-xs tracking-wide">{validation.errors.mobileno}</div>
                                    )}
                                </div>

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

                                {isRecaptcha && (
                                    <div className="my-4">
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={recaptchaClientId}
                                            onChange={onCaptchaChange}
                                        />
                                        {!captchaValue && (
                                            <div className="text-red-500 text-xs tracking-wide">{validation.errors.captchaValue}</div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                        // value={privacyPolicy}
                                        checked={privacyPolicy}
                                        id="privacy-policy"
                                        onChange={handlePrivacyPolicy}
                                    />
                                    <label htmlFor="privacy-policy" className="text-sm text-gray-700">
                                        I agree to the{" "}
                                        <Link href={"#"} className="text-blue-600 underline">
                                            Privacy Policy
                                        </Link>{" "}
                                        and{" "}
                                        <Link href={"#"} className="text-blue-600 underline">
                                            T & C
                                        </Link>
                                    </label>
                                </div>
                                {!privacyPolicy && (
                                    <div className="text-red-500 text-xs tracking-wide">{validation.errors.privacyPolicy}</div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-300"
                                >
                                    {loading ? "Loading..." : "Register"}
                                </button>
                            </form>

                            <hr className="my-5" />
                            {/* <GoogleOAuthProvider clientId={'433497461384-j2b7489oi25j8pbn6ag5rvn9gv1pj7u3.apps.googleusercontent.com'}>
                                <GoogleLogin
                                    onSuccess={handleSuccess}
                                    onError={() => console.log("Login Failed")}
                                />
                            </GoogleOAuthProvider> */}

                            <div className="text-center mt-5 text-sm text-[#7f758e] tracking-wide">
                                <p>
                                    Already have an account?{" "}
                                    <a href="/login" className="text-[#007bff] font-medium underline-none">
                                        Sign In
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)}
    </>
    );
};

export default Register;
