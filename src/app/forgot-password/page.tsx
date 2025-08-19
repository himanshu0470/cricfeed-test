'use client';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import {
    OTP_EXPIRE_TIME,
    REMEMBER_ME_KEY,
    USER_CRED,
    USER_DATA_KEY,
} from "../../constants/loginConst";
import { api } from '@/lib/apiUtils';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomToast from "../../components/reusableComponent/CustomToast";
import { CountryCode } from "@/types/register";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { useApp } from "../providers";

type ValidationState = {
    values: { mobileNo: string, countryCode: string };
    errors: { [key: string]: string }; // Errors keyed by field name
    touched: { [key: string]: boolean }; // Tracks if fields have been interacted with
};

declare global {
  interface Window {
    OTPlessSignin: any;
  }
}

const Forgot = () => {
    useEffect(() => {
        document.title = "Forgot";
    }, []);

    const _rememberMe = JSON.parse(
        localStorage.getItem(REMEMBER_ME_KEY) || "false"
    );
    

    const [rememberMe, setRememberMe] = useState<boolean>(_rememberMe || false);
    const [deviceInfo, setDeviceInfo] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isRecaptcha, setIsRecaptcha] = useState<boolean>(false);
    const [recaptchaClientId, setRecaptchaClientId] = useState<string>("");
    const [captchaValue, setCaptchaValue] = useState<string>("");
    const [countryCodes, setCountryCodes] = useState<CountryCode[]>([]);
    const [otpType, setOtpType] = useState<number>(1);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const router = useRouter();
    const [validation, setValidation] = useState<ValidationState>({
        values: { mobileNo: "", countryCode: countryCodes.length > 0 ? countryCodes[0]?.countryCode : "", },
        errors: {},
        touched: {},
    });
    const { configData } = useApp();
    
    // const fetchLoginCred = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await api.getConfigData();
    //         const domain = response?.domain;
    //         setOtpType(domain?.sendMobileOTPType);
    //         setRecaptchaClientId(domain?.recatchKey || "");
    //         setIsRecaptcha(domain?.isRecatchEnable);
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
            setOtpType(configData?.domain?.sendMobileOTPType);
            setRecaptchaClientId(configData?.domain?.recatchKey || "");
            setIsRecaptcha(configData?.domain?.isRecatchEnable);
        }
    },[configData])

    useEffect(() => {
        // fetchLoginCred();
        fetchCountryCodes();
        const userAgent = navigator.userAgent;
        setDeviceInfo(userAgent);
    }, []);

    const onCaptchaChange = (value: string | null) => {
        setCaptchaValue(value || "");
    };

    const handleFormSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const { countryCode, mobileNo } = validation.values;
        let errors: { [key: string]: string } = {};

        if (!mobileNo) errors.mobileNo = "Mobile no is required";
        if (isRecaptcha && !captchaValue) errors.captchaValue = "Captcha is required";

        setValidation((prevValidation: ValidationState) => ({
            ...prevValidation,
            errors,
        }));

        if (Object.keys(errors).length > 0) return;

        const payload = {
            countryCode: countryCode ? countryCode.replace("+", "") : countryCodes?.[0]?.countryCode.replace("+", ""),
            mobileNo,
        };

        try {
            setLoading(true);
            const response: any = await api.forgotPassword(payload);

            if (response?.clientId) {
                if (otpType === 2 && typeof window !== "undefined" && window.OTPlessSignin) {
                    window.OTPlessSignin.initiate({
                        channel: "PHONE",
                        phone: mobileNo,
                        countryCode: countryCode || "+91",
                    });
                }
                sessionStorage.setItem("forgotPasswordDetails", JSON.stringify(response));
                const expiryTime = response?.otpExpired * 60;
                sessionStorage.setItem(OTP_EXPIRE_TIME, expiryTime.toString());
                toast.success(
                    <CustomToast
                        title={response?.title}
                        message={response?.message || "Forgot successfully."}
                    />
                );
                setTimeout(() => {
                    router.push("/otp-validation");
                }, 1000);
                // window.location.reload();
            } else {
                toast.error(
                    <CustomToast
                        title={response?.error?.code}
                        message={response?.message || "Something went wrong"}
                    />
                );
            }
        } catch (error: any) {
            console.error("Forgot failed", error);
            toast.error(
                <CustomToast
                    title={error?.code}
                    message={error?.message || "Forgot failed"}
                />
            );
        } finally {
            setLoading(false);
        }
    };

    type Event = React.ChangeEvent<HTMLInputElement>;
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target as HTMLInputElement | HTMLSelectElement;
        const errors = { ...validation.errors };

        let updatedValues = { ...validation.values, [name]: value };

        if (name === "countryCode") {
            updatedValues.countryCode = value;
        }
        const selectedCountry = countryCodes.find(c => c.countryCode === updatedValues.countryCode);
        const maxNumberLength = selectedCountry?.maxNumber || 10;

        if (name === "mobileNo") {
            const mobileRegex = /^[0-9]*$/;
            if(!value) {
              errors.mobileNo = "Mobile Number is required.";
            } else if (!mobileRegex.test(value)) {
              errors.mobileNo = "Mobile number must be numeric.";
            } else if (value.length !== maxNumberLength) {
              errors.mobileNo = `Mobile number must be ${maxNumberLength} digits.`;
            } else {
              delete errors.mobileNo;
            }
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
        <div className="mt-56">
            <div className="shadow-md">
                <div className="shadow-lg">
                    <div className="flex justify-center h-full py-4 bg-white">
                        <div className="w-8/12">
                            <h1 className="text-center login-text text-2xl font-semibold my-4">Forgot password</h1>
                            {/* <div className="login-bottom"></div> */}
                            
                            <form onSubmit={handleFormSubmit} className="space-y-4 my-4">
                            <div className="text-slate-600 text-sm">
                                <p>Please enter the register phone number</p>
                            </div>
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
                                            type="text"
                                            maxLength={countryCodes.find(c => c.countryCode === validation.values.countryCode)?.maxNumber || 10}
                                            id="typeMobile"
                                            placeholder={otpType === 2 ? "WhatsApp Mobile No." : "Mobile No."}
                                            className="w-full text-[#7f758e] p-3 text-sm border border-gray-300 cursor-auto focus:outline-none focus:ring-2 focus:border-none"
                                            name="mobileNo"
                                            value={validation.values.mobileNo}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                                                    e.preventDefault(); // Blocks non-numeric keys
                                                }
                                            }}
                                        />
                                    </div>
                                    {validation.errors.mobileNo && (
                                        <div className="text-red-500 text-xs tracking-wide">{validation.errors.mobileNo}</div>
                                    )}
                                </div>
                                {isRecaptcha && <div className="my-4 w-64">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={recaptchaClientId}
                                        onChange={onCaptchaChange}
                                    />
                                    {!captchaValue && (
                                        <div className="text-red-500 font-normal text-sm tracking-wide">
                                            {validation.errors.captchaValue}
                                        </div>
                                    )}
                                </div>}
                                <div className="flex justify-center">

                                    <button
                                        className="btn btn-primary flex justify-center min-w-fit py-2 px-6 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        type="submit"
                                    >
                                        {loading ? "Loading..." : "Send OTP"}
                                    </button>
                                </div>
                            </form>.
                            
                            {/* <hr className="my-5" /> */}

                        </div>
                    </div>
                </div>
            </div>
        </div>)}
    </>

    );
};

export default Forgot;
