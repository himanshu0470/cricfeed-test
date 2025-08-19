"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { api } from "@/lib/apiUtils";
import { USER_DATA_KEY } from "@/constants/loginConst";
import CustomToast from "@/components/reusableComponent/CustomToast";
import { useApp } from "../providers";

declare global {
  interface Window {
    otpless?: (user: any) => void;
    otplessInit?: () => void;
  }
}

const SeamlessValidation = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [seamlessOtpKey, setSeamlessOtpKey] = useState<string>("");
  const router = useRouter();
  const { configData } = useApp();

  useEffect(() => {
    if(configData) {
        setSeamlessOtpKey(configData?.domain?.mobileSemlessOTPKey || "");
    }
  },[configData])
  // useEffect(() => {
  //   const fetchLoginCred = async () => {
  //     try {
  //       const response = await api.getConfigData();
  //       const domain = response?.domain;
  //       setSeamlessOtpKey(domain?.mobileSemlessOTPKey || "");
  //     } catch (error) {
  //       console.error("Failed to fetch config:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchLoginCred();
  // }, []);

  interface Payload {
    clientId: string;
    mobileNo: string;
    countryCode: string;
    seamlessToken: string;
  }

  useEffect(() => {
    if (!seamlessOtpKey) return;

    const isScriptLoaded = document.getElementById("otpless-sdk");
    if (!isScriptLoaded) {
      const script = document.createElement("script");
      script.id = "otpless-sdk";
      script.type = "text/javascript";
      script.src = "https://otpless.com/v4/auth.js";
      script.setAttribute("data-appid", seamlessOtpKey);
      document.body.appendChild(script);
    }

    // Handle user callback
    window.otpless = async (otplessUser: any) => {
      const token = otplessUser?.token;
      if (token) {
        const data: any = localStorage.getItem(USER_DATA_KEY);
        if (!data) {
            toast.error("User data not found. Please retry.");
            return;
        }
        // Store token if needed, then redirect
        const { clientId, mobileNo, countryCode } = JSON.parse(data);
        const payload: Payload = {
            clientId,
            mobileNo,
            countryCode,
            seamlessToken: token,
        };
        try {
            setLoading(true);
            const response: any = await api.otplessVerify(payload);
            if (response?.token) {
                const { token, details } = response;
                toast.success(
                    <CustomToast
                        title="Otpless Verify"
                        message="Otpless verified successfully"
                    />
                );
                localStorage.setItem("accessToken", token);
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(details));
                setTimeout(() => {
                   router.push("/");
                }, 1000);
            } else {
                toast.error(response?.message || "Otpless verified successfully");
            }
        } catch (error: any) {
            console.error("Error verifying OTP:", error);
            toast.error("Failed to verify OTP. Please try again.");
        } finally {
            setLoading(false);
        }
      } else {
        console.error("No token received from OTPless.");
      }
    };
  }, [seamlessOtpKey, router]);

  return (
    <>
        <ToastContainer />
        {loading ? (
            <LoadingScreen />
        ) : (
            <div className="mt-56">
            <div className="grid grid-cols-12">
                <div className="col-span-12 py-4 px-4">
                <div id="otpless-login-page" />
                </div>
            </div>
            </div>
        )}
    </>
  );
};

export default SeamlessValidation;