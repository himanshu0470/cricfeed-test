'use client';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import {
    REMEMBER_ME_KEY,
    USER_CRED,
    USER_DATA_KEY,
} from "../../constants/loginConst";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { api } from '@/lib/apiUtils';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomToast from "../../components/reusableComponent/CustomToast";
import { CountryCode } from "@/types/register";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { useApp } from "../providers";
// import { signIn, signOut, useSession } from "next-auth/react";
// import { jwtDecode } from "jwt-decode";
// import Image from "next/image";

type ValidationState = {
    values: { mobileNo: string; password: string, countryCode: string };
    errors: { [key: string]: string }; // Errors keyed by field name
    touched: { [key: string]: boolean }; // Tracks if fields have been interacted with
};

const Login = () => {
    useEffect(() => {
        document.title = "Login";
    }, []);

    const _rememberMe = JSON.parse(
        localStorage.getItem(REMEMBER_ME_KEY) || "false"
    );
    

    const [rememberMe, setRememberMe] = useState<boolean>(_rememberMe || false);
    const [deviceInfo, setDeviceInfo] = useState<string>("");
    const [isRecaptcha, setIsRecaptcha] = useState<boolean>(false);
    const [recaptchaClientId, setRecaptchaClientId] = useState<string>("");
    const [captchaValue, setCaptchaValue] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [countryCodes, setCountryCodes] = useState<CountryCode[]>([]);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const router = useRouter();
    const [validation, setValidation] = useState<ValidationState>({
        values: { mobileNo: "", password: "", countryCode: countryCodes.length > 0 ? countryCodes[0]?.countryCode : "", },
        errors: {},
        touched: {},
    });
    // const { data: session, status } = useSession();
    // useEffect(() => {
    //     setLoading(status === "loading")
    // },[status])
    const { configData } = useApp();

    // const fetchLoginCred = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await api.getConfigData();
    //         const domain = response?.domain;
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

    useEffect(() => {
        const userData = localStorage.getItem(USER_CRED);
        const storedData = userData ? JSON.parse(userData) : null;
        if (storedData) {
            setValidation((prev) => ({
                ...prev,
                values: {
                    ...prev.values,
                    // email: storedData?.email,
                    // password: storedData?.password,
                },
            }));
        }
    }, []);

    type Payload = {
        mobileNo: string;
        // email: string;
        countryCode: string
        // userName: string;
        password: string;
        // deviceInfo: string;
        // captcha: string;
    };

    const handleFormSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const { countryCode, password, mobileNo } = validation.values;
        let errors: { [key: string]: string } = {};

        // if (!email) errors.email = "Email is required";
        if (!mobileNo) errors.mobileNo = "Mobile no is required";
        if (!password) errors.password = "Password is required";
        if (isRecaptcha && !captchaValue) errors.captchaValue = "Captcha is required";

        setValidation((prevValidation: ValidationState) => ({
            ...prevValidation,
            errors,
        }));

        if (Object.keys(errors).length > 0) return;

        const payload = {
            countryCode: countryCode ? countryCode.replace("+", "") : countryCodes?.[0]?.countryCode.replace("+", ""),
            password,
            mobileNo,
        };

        try {
            setLoading(true);
            const response: any = await api.signinClient(payload);
            const rememberMe = JSON.parse(
                localStorage.getItem(REMEMBER_ME_KEY) || "false"
            );

            if (rememberMe) {
                localStorage.setItem(USER_CRED, JSON.stringify(payload));
            } else {
                localStorage.removeItem(USER_CRED);
            }
            if (response?.token) {
                const { token, details } = response;
                localStorage.setItem("accessToken", token);
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(details));
                toast.success(
                    <CustomToast
                        title={response?.title}
                        message={response?.message || "Login successfully."}
                    />
                );
                setTimeout(() => {
                   router.push("/");
                }, 1000);
                // window.location.reload();
            } else {
                toast.error(
                    <CustomToast
                        title={response?.code}
                        message={response?.message || "User Not Found"}
                    />
                );
            }
        } catch (error: any) {
            console.error("Login failed", error);
            toast.error(
                <CustomToast
                    title={error?.code}
                    message={error?.message || "Login failed"}
                />
            );
        } finally {
            setLoading(false);
        }
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
    //   };

    

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
            
            if (name === "password" && !value) {
                errors.password = "Password is required";
            } else if (name === "password") {
                delete errors.password;
            }
    
            setValidation((prev) => ({
                ...prev,
                values: { ...prev.values, [name]: value },
                errors,
                touched: { ...prev.touched, [name]: true },
            }));
        };

    const handleRememberMe = () => {
        setRememberMe(!rememberMe);
        localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(!rememberMe));
    };

    const onCaptchaChange = (value: string | null) => {
        setCaptchaValue(value || "");
    };

    // if (session) {
    //     return (
    //       <div className="flex flex-col items-center gap-2">
    //         <p>Signed in as {session.user?.email}</p>
    //         <img 
    //           src={session.user?.image || ''} 
    //           alt={session.user?.name || 'User'} 
    //           className="w-10 h-10 rounded-full"
    //         />
    //         <button 
    //           onClick={() => signOut()} 
    //           className="px-4 py-2 bg-red-500 text-white rounded"
    //         >
    //           Sign out
    //         </button>
    //       </div>
    //     );
    // }

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
                            <h1 className="text-center login-text text-2xl font-semibold my-4">Sign in</h1>
                            <div className="login-bottom"></div>
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
                                            type="text"
                                            id="typeMobile"
                                            maxLength={countryCodes.find(c => c.countryCode === validation.values.countryCode)?.maxNumber || 10}
                                            placeholder="Mobile No."
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

                                <div className="flex items-center mb-4">
                                    <input
                                        checked={rememberMe}
                                        onClick={handleRememberMe}
                                        type="checkbox"
                                        className="form-check-input cursor-pointer"
                                        id="customControlInline"
                                        readOnly
                                    />
                                    <label className="ml-2 text-sm font-normal" htmlFor="customControlInline">
                                        Remember me
                                    </label>
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

                                <button
                                    className="btn btn-primary w-full py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    type="submit"
                                >
                                    {loading ? "Loading..." : "Login"}
                                </button>
                            </form>.
                            <a
                                href="/forgot-password"
                                className="text-blue-500 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 "
                                // onClick={}
                            >
                                Forget Password ?
                            </a>

                            <div className="my-5 text-center text-sm tracking-wide">
                                <p className="text-gray-600">
                                    Don't have an account ?{" "}
                                    <a href="/register" className="font-medium text-blue-500">
                                        Sign Up
                                    </a>
                                </p>
                            </div>
                            <hr className="my-5" />
                            {/* <GoogleOAuthProvider clientId={'433497461384-j2b7489oi25j8pbn6ag5rvn9gv1pj7u3.apps.googleusercontent.com'}>
                                <GoogleLogin
                                    onSuccess={handleSuccess}
                                    onError={() => console.log("Login Failed")}
                                />
                            </GoogleOAuthProvider> */}
                            {/* <button
                                  onClick={() => signIn('google')}
                                  className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
                                >
                                  <Image src={"/images/Google.png"} alt="Google Logo" width={20} height={20} />
                                  <span className="ml-4">Continue with Google</span>
                                </button>
                             <button
                                  onClick={() => signIn('facebook')}
                                  className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-blue-600 border-2 border-blue-700 text-white rounded-lg focus:shadow-outline hover:bg-blue-700"
                                >
                                  <Image src={"/images/Facebook.webp"} alt="Facebook Logo" width={20} height={20} />
                                  <span className="ml-4">Continue with Facebook</span>
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>)}
    </>

    );
};

export default Login;
