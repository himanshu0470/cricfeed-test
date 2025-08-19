"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/apiUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomToast from "@/components/reusableComponent/CustomToast";
import { OTP_EXPIRE_TIME, USER_DATA_KEY } from "@/constants/loginConst";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { useApp } from "../providers";

const OtpValidation = () => {
  useEffect(() => {
    document.title = "OTP Validation";
  }, []);

  const forgotPasswordDetails = JSON.parse(
    sessionStorage.getItem("forgotPasswordDetails") || "false"
  );
  const otpExpiresIn = parseInt(sessionStorage.getItem(OTP_EXPIRE_TIME) || "0");
  const [otp, setOtp] = useState<string[]>(["*", "*", "*", "*"]);
  const [expiredTime, setExpiredTime] = useState<number>(otpExpiresIn);
  const [loading, setLoading] = useState<boolean>(false);
  const [isResendOtp, setIsResentOtp] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(expiredTime);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [maskedNumber, setMaskedNumber] = useState<string | null>(null);
  const [otpType, setOtpType] = useState<number>(1);
  const [token, setToken] = useState<string>("");
  const [isOtpEntered, setIsOtpEntered] = useState<boolean>(false);
  const router = useRouter();

  const { configData } = useApp();

  useEffect(() => {
    if(configData) {
        setOtpType(configData?.domain?.sendMobileOTPType);
    }
  },[configData])

  // const fetchLoginCred = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await api.getConfigData();
  //     const domain = response?.domain;
  //     setOtpType(domain?.sendMobileOTPType);
  //   } catch (error) {
  //     console.error("Error fetching config data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchLoginCred();
  // }, []);

  useEffect(() => {
    const data: any = localStorage.getItem(USER_DATA_KEY);
    if (data) {
      const { mobileNo } = JSON.parse(data);
      if (mobileNo) {
        // Masked mobile number format e.g., ******1234
        setMaskedNumber(`******${mobileNo.slice(-4)}`);
      }
    } else if (forgotPasswordDetails) {
      const { mobileNo } = forgotPasswordDetails;
      if (mobileNo) {
        // Masked mobile number format e.g., ******1234
        setMaskedNumber(`******${mobileNo.slice(-4)}`);
      }
    }
  }, [forgotPasswordDetails]);

  useEffect(() => {
    if (expiredTime > 0) {
      setTimeLeft(expiredTime);
    
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            sessionStorage.removeItem(OTP_EXPIRE_TIME);
            return 0; // Stop at 0
          }
          const newTime = prevTime - 1;
          sessionStorage.setItem(OTP_EXPIRE_TIME, newTime.toString());
          return newTime;
        });
      }, 1000);
    
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [expiredTime, isResendOtp]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Handle OTP Input Change
  const handleChange = (index: number, value: string) => {
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value || "*"; // Set value or * if cleared
      setOtp(newOtp);

      // Move to the next input if a number is entered
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "*"; // Set back to * on delete
      setOtp(newOtp);

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  interface Payload {
    clientId: string;
    mobileNo: string;
    countryCode: string;
    otp: string;
  }

  interface otplessPayload {
    clientId: string;
    mobileNo: string;
    countryCode: string;
    seamlessToken: string;
  }

  useEffect(() => {
    if (isOtpEntered) {
      const interval = setInterval(() => {
        const token = sessionStorage.getItem("otplessToken");
        if (token) {
          // console.log("Token from sessionStorage:", token);
          setToken(token);
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isOtpEntered]);

  useEffect(() => {
    const data: any = localStorage.getItem(USER_DATA_KEY);
    //  if(data && token) {
    const verifyOypless = async () => {
      const { clientId, mobileNo, countryCode } = JSON.parse(data);

      const otplessPayload: otplessPayload = {
        clientId,
        mobileNo,
        countryCode,
        seamlessToken: token,
      };

      try {
        setLoading(true);
        const response: any = await api.otplessVerify(otplessPayload);
        if (response?.token) {
          const { token, details } = response;
          toast.success(
            <CustomToast
              title="Otp Verification"
              message="Otp verified successfully"
            />
          );
          localStorage.setItem("accessToken", token);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(details));
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          toast.error(response?.message || "OTP verified Failed");
        }
      } catch (error: any) {
        console.error("Error verifying OTP:", error);
        toast.error("Failed to verify OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (data && token) {
      verifyOypless();
    }
  }, [token]);

  // Handle Submit
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("").replace(/\*/g, "");
    if (enteredOtp.length < 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    let mobileNo: string;
    let countryCode: string;

    if (forgotPasswordDetails) {
      ({ mobileNo, countryCode } = forgotPasswordDetails);
    } else {
      const data: any = localStorage.getItem(USER_DATA_KEY);
      if (data) {
        ({ mobileNo, countryCode } = JSON.parse(data));
      } else {
        // Handle the case where data is missing
        toast.error("User data not found. Please retry.");
        return;
      }
    }

    if (window.OTPlessSignin) {
      try {
        setLoading(true);
        await window.OTPlessSignin.verify({
          channel: "PHONE",
          phone: mobileNo,
          otp: enteredOtp,
          countryCode: `+${countryCode}`,
        });
        {
          forgotPasswordDetails
            ? toast.success(
                <CustomToast
                  title="Otp Verification"
                  message="OTP verified via OTPless"
                />
              )
            : null;
        }
        setIsOtpEntered(true);
        {
          forgotPasswordDetails
            ? setTimeout(() => {
                router.push("/reset-password");
              }, 1000)
            : null;
        }
      } catch (err) {
        console.error("OTPless OTP verification failed:", err);
        toast.error("OTP verification failed via OTPless.");
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("").replace(/\*/g, ""); // Remove * before sending
    if (enteredOtp.length < 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    const data: any = localStorage.getItem(USER_DATA_KEY);
    if (!data) {
      toast.error("User data not found. Please retry.");
      return;
    }

    const { clientId, mobileNo, countryCode } = JSON.parse(data);

    const payload: Payload = {
      clientId,
      mobileNo,
      countryCode,
      otp: enteredOtp,
    };

    try {
      setLoading(true);
      const response: any = await api.verifyOTP(payload);
      if (response?.token) {
        const { token, details } = response;
        toast.success(
          <CustomToast
            title="Otp Verification"
            message="Otp verified successfully"
          />
        );
        localStorage.setItem("accessToken", token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(details));
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(response?.message || "OTP Verification Failed");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handelForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    const data: any = localStorage.getItem(USER_DATA_KEY);
    const { clientId, mobileNo, countryCode } = forgotPasswordDetails;

    // const clientId = localStorage.getItem("clientId") || "";

    const payload: Payload = {
      clientId,
      mobileNo,
      countryCode,
      otp: enteredOtp,
    };

    try {
      setLoading(true);
      const response: any = await api.forgotOTPVerify(payload);
      if (response?.token) {
        toast.success(
          <CustomToast
            title="Otp Verification"
            message={response.message || "Otp verified successfully"}
          />
        );
        // localStorage.setItem("accessToken", response?.token);
        // localStorage.setItem(USER_DATA_KEY, JSON.stringify(response?.details));
        setTimeout(() => {
          router.push("/reset-password");
        }, 1000);
      } else {
        toast.error(response?.message || "OTP Verification Failed");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const data: any = localStorage.getItem(USER_DATA_KEY);
      if (!data && !forgotPasswordDetails) {
        toast.error("User data not found. Please retry.");
        return;
      }

      const { clientId, mobileNo, countryCode } =
        forgotPasswordDetails || JSON.parse(data);

      const payload = {
        clientId,
        countryCode,
        mobileNo,
      };
      if(otpType === 2 && typeof window !== "undefined" && window.OTPlessSignin) {
          window.OTPlessSignin.initiate({
              channel: "PHONE",
              phone: mobileNo,
              countryCode: countryCode,
          });
          toast.success(
          <CustomToast
            title="OTP Sent"
            message={
              "A new OTP has been sent to your number."
            }
          />
        );
      } else {
      const response: any = await api.resendOTP(payload);
      if (response?.otpExpired) {
        toast.success(
          <CustomToast
            title="OTP Sent"
            message={
              response?.message || "A new OTP has been sent to your number."
            }
          />
        );
        const expiryTime = response?.otpExpired * 60;
        setExpiredTime(expiryTime);
        setIsResentOtp(!isResendOtp);
        sessionStorage.setItem(OTP_EXPIRE_TIME, expiryTime.toString());
        setOtp(["*", "*", "*", "*"]);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(response?.message || "Failed to resend OTP.");
      }
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="mt-56">
          <div className="w-full">
            <div className="bg-white shadow-md p-6 flex justify-center">
              <div className="my-6">
                <h1 className="text-center text-2xl font-semibold mb-4 text-black">
                  OTP Validation
                </h1>
     
                {maskedNumber && (
                  <p className="text-center text-gray-600 mb-2">
                    OTP sent to your number ending with{" "}
                    <span className="font-semibold">{maskedNumber}</span>
                  </p>
                )}
                <p className="text-left text-gray-600 mb-2">
                  Enter the Otp below
                </p>

                <form
                  onSubmit={
                    otpType === 2
                      ? handleOTPSubmit
                      : forgotPasswordDetails
                      ? handelForgotSubmit
                      : handleSubmit
                  }
                  className="space-y-4 w-80"
                >
                  <div className="flex justify-center space-x-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        className="w-12 h-12 text-black text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={digit !== "*" ? digit : ""} // Show empty for *
                        placeholder="*"
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                      />
                    ))}
                  </div>
                  {timeLeft > 0 ? (
                    <p className="text-center text-gray-600 mb-2">
                      OTP expires in{" "}
                      <span className="font-semibold">
                        {formatTime(timeLeft)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-center text-red-600 mb-2">
                      OTP has expired. Please click on resend Otp.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition duration-300 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Verify & proceed
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timeLeft !== 0}
                    className={`w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition duration-300 ${
                      timeLeft !== 0
                        ? "bg-blue-600 text-white opacity-70 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Resend OTP
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OtpValidation;
