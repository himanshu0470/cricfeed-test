'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { USER_DATA_KEY } from "../../constants/loginConst";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from '@/lib/apiUtils';
import CustomToast from "../../components/reusableComponent/CustomToast";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { useApp } from "../providers";

type UserDetails = {
    clientId?: string;
    fullName?: string;
    userName?: string;
    emailId?: string;
    mobileNo?: string;
    isEmailVerified?: boolean;
    isMobileVerified?: boolean;
};

const Profile = () => {
    const userDataVal = localStorage.getItem(USER_DATA_KEY)
    const userData = userDataVal ? JSON.parse(userDataVal) : null;
    const [loading, setLoading] = useState<boolean>(true);
    const [userDetails, setUserDetails] = useState<UserDetails>({});
    const [isMobileOtp, setIsMobileOtp] = useState<boolean>(false);
    const [isEmailOtp, setIsEmailOtp] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);

    const router = useRouter();
    const { configData } = useApp();

    // const fetchLoginCred = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await api.getConfigData();
    //         const credentials = response?.configData;
    //         setIsMobileOtp(credentials?.find((c: any) => c.key === "ISSENDMOBILEOTP")?.value === "true");
    //         setIsEmailOtp(credentials?.find((c: any) => c.key === "ISSENDEMAILOTP")?.value === "true");
    //     } catch (error) {
    //         console.error("Error fetching config data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchUserDetails = async (userData: { clientId: string }) => {
        const payload = {
            clientId: userData?.clientId,
        };

        try {
            setLoading(true);
            // const response = await axiosInstance.post(`/api/clientDetailsByEmailId`, payload);
            const response = await api.getDetailsByEmailId(userData?.clientId);
            if (response) {
                setUserDetails(response);
            }
        } catch (error) {
            console.error("Client details failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(configData) {
            setIsMobileOtp(configData?.configData?.find((c: any) => c.key === "ISSENDMOBILEOTP")?.value === "true");
            setIsEmailOtp(configData?.configData?.find((c: any) => c.key === "ISSENDEMAILOTP")?.value === "true");
        }
    },[configData])

    useEffect(() => {
        if (userDataVal) {
            
            fetchUserDetails(userData);
            // fetchLoginCred();
        } else {
            router.push("/login");
        }
    }, [router]);

    const updateClient = async () => {
        const payload = {
            clientId: userData?.clientId,
            email: userDetails?.emailId,
            fullName: userDetails?.fullName,
        }
        const response = await api.updateProfile(payload);
        if(response == "Profile updated successfully"){
            toast.success(
                <CustomToast
                    title={"profile update"}
                    message={ "Profile updated successfully"}
                />
            );
            setEditMode(false);
            setTimeout(() => {
               router.push("/");
            }, 1000);
        }
    }
    

    // const verifyEmail = async (email: string) => {
    //     const payload = {
    //         email,
    //     };

    //     try {
    //         const response = await axiosInstance.post(`/api/verifyEmail`, payload);
    //         if (response?.data?.result) {
    //             toast.success(
    //                 <CustomToast
    //                     title={response?.data?.title}
    //                     message={response?.data?.result || "Verification Link sent to your email."}
    //                 />
    //             );
    //         } else {
    //             toast.error(
    //                 <CustomToast
    //                     title={response?.data?.error?.code}
    //                     message={response?.data?.error?.message || "Email verification failed"}
    //                 />
    //             );
    //         }
    //     } catch (error: any) {
    //         console.error("Request failed", error);
    //         toast.error(
    //             <CustomToast
    //                 title={error?.code}
    //                 message={error?.message || "Email verification failed"}
    //             />
    //         );
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const verifyMobile = async (email: string) => {
    //     try {
    //         const payload = {
    //             email,
    //         };
    //         const response = await axiosInstance.post(`/api/verifyMobile`, payload);
    //         if (response?.data?.result) {
    //             toast.success(
    //                 <CustomToast
    //                     title={response?.data?.title}
    //                     message={response?.data?.result || "Verification OTP sent to your registered mobile number."}
    //                 />
    //             );
    //             router.push("/verifyMobile");
    //         } else {
    //             toast.error(
    //                 <CustomToast
    //                     title={response?.data?.error?.code}
    //                     message={response?.data?.error?.message || "Mobile verification failed"}
    //                 />
    //             );
    //         }
    //     } catch (error: any) {
    //         console.error("Request failed", error);
    //         toast.error(
    //             <CustomToast
    //                 title={error?.code}
    //                 message={error?.message || "Mobile verification failed"}
    //             />
    //         );
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const updateClient = async () => {
    //     const payload = {
    //         clientId: userDetails.clientId,
    //         fullName: userDetails.fullName || null,
    //         email: newEmail || userDetails.emailId,
    //         mobileNo: newFullName || userDetails.mobileNo,
    //     };

    //     try {
    //         const response = await axiosInstance.post(`/api/updateClient`, payload);
    //         if (response?.data?.result) {
    //             const userData = response?.data?.result;
    //             localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    //             fetchUserDetails(userData);
    //             setUserDetails(userData);
    //             setEditMode(false);
    //         } else {
    //             toast.error(
    //                 <CustomToast
    //                     title={response?.data?.error?.code}
    //                     message={response?.data?.error?.message || "Failed to update profile"}
    //                 />
    //             );
    //         }
    //     } catch (error: any) {
    //         console.error("Failed to update profile", error);
    //         toast.error(
    //             <CustomToast
    //                 title={error?.code}
    //                 message={error?.message || "Failed to update profile"}
    //             />
    //         );
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const {
        clientId,
        fullName,
        userName,
        emailId,
        mobileNo,
        isEmailVerified,
        isMobileVerified,
    } = userDetails;

    return (
       <> 
            <ToastContainer />
            {loading ? (
                <LoadingScreen />
            ) : (
            <div className="lg:col-span-9 text-black md:mt-56">
                <section className="pt-0">
                    <div className="p-4 bg-white rounded-md">
                        <h3 className="font-semibold text-slate-500 mb-2">Welcome {fullName?.toUpperCase()}!</h3>
                        <h3 className="text-lg font-semibold text-center">Your Profile</h3>
                        <div className="flex items-center justify-start my-2">
                            <img src="/images/user-icon.webp" alt="Profile" className="h-24 rounded-full" />
                            {/* <div className="flex gap-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded">Change Picture</button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded">Delete Picture</button>
                            </div> */}
                        </div>
                        <div className="my-2">
                            <label className="block font-semibold">Username :</label>
                            <input type="text" value={userName} disabled className="w-full border p-2 rounded bg-gray-100" />
                        </div>
                        <div className="my-2">
                            <label className="block font-semibold">
                                Mobile Number :
                                {isMobileVerified && <span className="ml-2 text-green-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="inline-block"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                </svg>
                            </span>}</label>
                            <input type="tel" value={mobileNo} disabled className="w-full border p-2 rounded bg-gray-100" /> 
                        </div>
                        <div className="my-2">
                            <label className="block font-semibold">Full Name :</label>
                            <input 
                                type="text" 
                                value={fullName} 
                                disabled={!editMode}
                                onChange={(e) => { setUserDetails({...userDetails, fullName: e.target.value})}  }
                                className={`w-full border p-2 rounded ${!editMode ? "bg-gray-100" : ""}`} 
                            />
                        </div>
                        <div className="my-2">
                            <label className="block font-semibold">
                                Email ID : 
                                {isEmailVerified && (
                                        <span className="ml-2 text-green-600">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="inline-block"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                                            </svg>
                                        </span>
                                    )}</label>
                            <input type="email" value={emailId} disabled={!editMode} onChange={(e) => setUserDetails({...userDetails, emailId: e.target.value})} className={`w-full border p-2 rounded  ${!editMode ? "bg-gray-100" : ""}`} />
                        </div>
                        {editMode ? (
                            <>
                                <button
                                    className="my-2 py-2 px-3 rounded bg-green-600 text-white hover:bg-green-700 mr-2"
                                    onClick={updateClient}
                                >
                                    Save
                                </button>
                                <button
                                    className="my-2 py-2 px-3 rounded bg-red-600 text-white hover:bg-red-700 ml-2"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                className="my-2 py-2 px-3 rounded bg-green-600 text-white hover:bg-green-700 mr-2"
                                onClick={() => {
                                    setEditMode(true);
                                }}
                            >
                                Edit Profile
                            </button>)}

                        {/* {(!isEmailVerified && emailId && isEmailOtp) && (
                            <button
                                className="bg-gray-600 text-white text-xs px-2 py-2 rounded-md hover:bg-gray-700 mr-2"
                                // onClick={() => verifyEmail(emailId)}
                            >
                                Verify Email
                            </button>
                        )} */}
                        {/* {(!isMobileVerified && mobileNo && isMobileOtp) && (
                            <button
                                className="bg-gray-600 text-white text-xs px-2 py-2 ml-2 rounded-md hover:bg-gray-700"
                                // onClick={() => verifyMobile(emailId || "")}
                            >
                                Verify Mobile
                            </button>
                        )} */}
                    </div>
                </section>
            </div>
            )}
       </>

    );
};

export default Profile;