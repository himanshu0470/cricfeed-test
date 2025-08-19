"use client";
import { Montserrat, Orbitron } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { Providers } from "./providers";
import ScoreHeader from "@/components/layout/ScoreHeader";
import MatchSkeleton from "../components/skeleton/matchSkeleton";
import Script from "next/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, Navigation } from "swiper/modules";
import Link from "next/link";
import { api } from "@/lib/apiUtils";
import { useEffect, useRef, useState } from "react";
import { InitialDataResponse, MatchData, Page } from "@/types";
// import { loadAllData } from '@/utils/fetchData';
import { usePathname } from "next/navigation";
// import FullScoreSidebar from '@/components/full-score/FullScoreSidebar';
import { formatDate, sortMatchesByDateTime } from "@/utils/function";
import { convertDateTimeUTCToLocal } from "@/utils/fullscore";
import MatchInfoCard from "@/components/shared/MatchInfoCard";
import { FULL_SCORE_COMPONENT } from "@/constants/fullScoreConst";
import { SocialMedia } from "@/types/register";
import { ScrollToTopOnRouteChange } from "@/components/ScrollToTopOnRouteChange";
import AppImage from "@/constants/AppImage";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CONFIG } from "@/config/config";
import ClientErrorBoundary from '@/components/ClientErrorBoundary';


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

interface NewsViewerPayload {
  refId: string;
}

interface BannerViewerPayload {
  refId: string;
}

// export const metadata: Metadata = {
//   title: 'CricketLive - Modern Cricket Scores & Updates',
//   description: 'Experience cricket like never before with live scores, updates, and immersive statistics.',
// };

declare global {
  interface Window {
    OTPless: any;
    OTPlessSignin: any;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const loadData = async () => {
  //   try {
  //     await loadAllData();
  //   } catch (error) {
  //     console.error("Error loading global data:", error);
  //   }
  // };

  // loadData();

  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState([]);
  const [initialData, setInitialData] = useState<InitialDataResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [userNotification, setUserNotification] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const pages = initialData?.pages || [];
  const [currentPage, setCurrentPage] = useState<Page | null | undefined>();
  const [hideNonPageData, setHideNonPageData] = useState<Boolean>();
  const [finishedMatches, setFinishedMatches] = useState<MatchData[]>([]);
  const [groupedMatches, setGroupedMatches] = useState<{
    [key: string]: MatchData[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [otpType, setOtpType] = useState<number>(1);
  const [whitelabelId, setWhitelabelId] = useState<string>("");
  const [seamlessOtpKey, setSeamlessOtpKey] = useState<string>("");
  const [page, setPage] = useState(1);

  const pathname = usePathname();
  const commentaryId = pathname?.split("/").filter(Boolean)[1];

  const fetchCred = async () => {
    try {
      setLoading(true);
      const response = await api.getConfigData();
      const domain = response?.domain;
      setWhitelabelId(domain?.id);
      setOtpType(domain?.sendMobileOTPType);
      setSeamlessOtpKey(domain?.mobileSemlessOTPKey || "");
    } catch (error) {
      console.error("Error fetching config data:", error);
    } finally {
      setLoading(false);
    }
  };
  const getCurrentPage = () => {
    if (!pages || pages.length === 0 || !pathname) return null;
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return null;
    const alias = `/${pathSegments[0]}`;
    return pages.find((page) => {
      const pageAlias = page.alias.startsWith("/")
        ? page.alias
        : `/${page.alias}`;
      return pageAlias === alias;
    });
  };

  useEffect(() => {
    fetchCred();
  }, []);

  useEffect(() => {
    const callback = (eventCallback: { responseType: any; response: any }) => {
      const { responseType, response } = eventCallback;

      const EVENTS_MAP = {
        ONETAP: () => {
          console.log("Logged in:", response.token);
          sessionStorage.setItem("otplessToken", response.token);
        },
        OTP_AUTO_READ: () => {
          console.log("Auto-read OTP:", response.otp);
          // if (otpRef.current) otpRef.current.value = response.otp;
        },
        // OTP_VERIFIED: () => {
        //   const { token, details } = response;
        //   console.log("token", token);
        //   console.log("details", details);

        //   localStorage.setItem("otplessToken", token);
        //   localStorage.setItem("otplessUserDetails", JSON.stringify(details));

        //   toast.success(
        //     <CustomToast title="OTP Verified" message="Welcome!" />
        //   );

        //   // window.location.href = "/otp-validation";
        // },
        FAILED: () => {
          console.log("Authentication Failed:", response);
          // setStatus("Authentication Failed");
        },
        FALLBACK_TRIGGERED: () => {
          console.log("Fallback Triggered:", response);
          // setStatus("Fallback Triggered");
        },
      };

      if (Object.prototype.hasOwnProperty.call(EVENTS_MAP, responseType)) {
        EVENTS_MAP[responseType as keyof typeof EVENTS_MAP]();
      }
    };

    if (window.OTPless) {
      window.OTPlessSignin = new window.OTPless(callback);
    }
  }, []);
  useEffect(() => {
    const tempCurrPage: Page | null | undefined = getCurrentPage();
    setCurrentPage(tempCurrPage);
    if (tempCurrPage?.linkURL === "Blank page") setHideNonPageData(true);
    else setHideNonPageData(false);
  }, [pathname, pages]);

  function eventNameStatus(status: any) {
    switch (parseInt(status)) {
      case 1:
        return "Comming Soon";
      case 2:
        return "Win Toss";
      case 3:
        return "Event Start";
      case 4:
        return "Inning Completed";
      case 5:
        return "Boundary";
      case 6:
        return "Wicket";
      case 7:
        return "Event Completed";
      default:
        return "";
    }
  }

  // const configSocket = (socketInstance: any) => {
  //   socketInstance?.emit("onUserLoggedIn");
  //   socketInstance?.on("userNotification", (data: any) => {
  //     setUserNotification(data);
  //   });
  // };

  // useEffect(() => {
  //   const socketInstance = io(CONFIG.API_BASE_URL, {
  //     transports: ["websocket"],
  //   });
  //   if (socketInstance?.connected) {
  //     configSocket(socketInstance);
  //   } else {
  //     socketInstance.on("connect", () => {
  //       configSocket(socketInstance);
  //     });
  //   }
  // }, []);

  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(CONFIG.API_BASE_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    const handleNotification = (data: any) => {
      setUserNotification(data);
    };

    socket.on("connect", () => {
      socket.emit("onUserLoggedIn");
      socket.on("userNotification", handleNotification);
    });

    return () => {
      socket.off("userNotification", handleNotification);
      socket.disconnect();
    };
  }, []);
  const showUserNotification = (userData: any) => {
    toast.info(
      <div>
        <strong>{eventNameStatus(userData?.eventName)}</strong>
        <div
          dangerouslySetInnerHTML={{
            __html: userData?.content || "",
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    if (userNotification) {
      showUserNotification(userNotification);
    }
  }, [userNotification]);

  const leftBanner = initialData?.banner?.filter(
    (item) =>
      item?.bannerType == 2 &&
      item?.isActive &&
      (new Date(item?.endDate) > new Date() || item?.isPermanent)
  );
  const rightBanner = initialData?.banner?.filter(
    (item) =>
      item?.bannerType == 3 &&
      item?.isActive &&
      (new Date(item?.endDate) > new Date() || item?.isPermanent)
  );

  const fetchPhoto = async () => {
    try {
      const data = await api.getPhotoLibrary();
      setPhotos(data?.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchVideo = async () => {
    try {
      const data = await api.getVideoLibrary();
      setVideo(data?.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchCountryCodes = async () => {
    try {
      setLoading(true);
      const response = await api.socialMedia();
      setSocialMedia(response || []);
    } catch (error) {
      console.error("Error fetching config data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompleted = async (whitelabelId: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await api.getCompletedMatches(page, whitelabelId);
      if (Array.isArray(data?.data)) {
        setFinishedMatches((prevMatches) => {
          const existingEids = new Set(prevMatches.map((match) => match.cid));
          const newMatches = data.data.filter(
            (match) => !existingEids.has(match.cid)
          );
          if (newMatches.length > 0) {
            const updatedMatches = [...prevMatches, ...newMatches];
            return sortMatchesByDateTime(updatedMatches, false);
          }
          return prevMatches;
        });
      } else {
        console.error("Expected data to be an array, but got:", data);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  async function fetchInitialData(whitelabelId: string) {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getInitialData(whitelabelId);

      if (!data) {
        throw new Error("Failed to fetch initial data");
      }

      setInitialData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching initial data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPhoto();
    fetchVideo();
    fetchCountryCodes();
  }, []);

  useEffect(() => {
    if (whitelabelId) {
      fetchInitialData(whitelabelId);
      fetchCompleted(whitelabelId);
    }
  }, [whitelabelId]);

  useEffect(() => {
    const grouped = finishedMatches.reduce((acc, match) => {
      // const matchDate = match.ed; // Assuming match.ed is in DD/MM/YYYY format
      // Initialize the date group if it doesn't exist
      const istDate = convertDateTimeUTCToLocal(match.utc);
      if (!acc[istDate.localDate]) {
        acc[istDate.localDate] = [];
      }
      // Add the match to the appropriate date group
      acc[istDate.localDate].push(match);
      return acc;
    }, {} as { [key: string]: MatchData[] });
    setGroupedMatches(grouped);
  }, [finishedMatches]);

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  const urlBase64ToUint8Array = (base64String: any) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  interface saveDevicePayload {
    deviceId: string;
    userId: number;
    userType: number;
    name: string;
    sub: any;
    deviceType: number;
  }

  const subscribeUserToPush = async () => {
    try {
      const swReg = await navigator.serviceWorker.ready;
      const applicationServerKey = urlBase64ToUint8Array(
        "BKBY2yTmo0objcNQvRf62lx4reXpA_tGB0r4OaCJoNfc1eJv8Yf41UBIkYAWfH3NBAS0NNxL66vqGYnZJuPqHik"
      );
      const subscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      // console.log('User is subscribed:', subscription);
      // Send subscription to the server
      if (subscription) {
        const userAgent = navigator.userAgent;
        const subObject: saveDevicePayload = {
          deviceId: "0",
          userId: 0,
          userType: 1,
          name: userAgent,
          sub: subscription,
          deviceType: 1,
        };
        await api.saveDevice(subObject);
      }
      //await axiosInstance.post('/subscribe', subscription);
    } catch (error) {
      console.error("Failed to subscribe the user: ", error);
    }
  };

  const askPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // console.log('Notification permission granted.');
        subscribeUserToPush();
      } else {
        console.log("Notification permission denied.");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(function (swReg) {
          console.log("Service Worker is registered", swReg);
        })
        .catch(function (error) {
          console.error("Service Worker Error", error);
        });

      askPermission();
    }
  }, []);

  return (
    <html lang="en" className={`${montserrat.variable} ${orbitron.variable}`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-5659048786851839" />
        <script
          id="otpless-sdk"
          src="https://otpless.com/v4/headless.js"
          data-appid={seamlessOtpKey || "NIIDCPF9XRLE1XC5ES6B"}
        ></script>
      </head>
      <body className="bg-gradient-dark text-white">
        {/* bg-gradient-dark */}
        <Providers>
          <ScrollToTopOnRouteChange />
          <div className="relative box-border">
            <div className="px-4 pb-4 bg-[#001DB2] fixed top-0 right-0 left-0 z-50">
              <Header />
              {!hideNonPageData && <ScoreHeader />}
            </div>
            {isLoading ? (
              <MatchSkeleton />
            ) : (
              // bg-gradient-to-r from-[#49c1df61] to-[#eff0f5]
              <main className="main-container">
                <ClientErrorBoundary>
                  <div className="grid grid-cols-12 p-2 gap-2">
                    {!hideNonPageData && (
                      <div className="col-span-12 lg:col-span-3 md:mt-56 order-2 lg:order-1">
                        {leftBanner && leftBanner.length > 0 && (
                          <Swiper
                            slidesPerView={1}
                            spaceBetween={10}
                            freeMode={true}
                            className="mySwiper mb-5"
                            centeredSlidesBounds={false}
                            centeredSlides={false}
                            modules={[FreeMode, Autoplay]}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                            }}
                            breakpoints={{
                              200: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                              },
                              480: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                              },
                              768: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                              },
                              1024: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                              },
                            }}
                          >
                            {leftBanner.map((item: any) => {
                              const encodedTitle = item?.title
                                ? encodeURIComponent(
                                    item?.title
                                      .toLowerCase()
                                      .replace(/[^a-zA-Z0-9\s]/g, "")
                                      .replace(/\s+/g, "-")
                                      .replace(/-{2,}/g, "-")
                                      .trim()
                                  )
                                : "";
                              return (
                                <SwiperSlide key={item.bannerId}>
                                  <Link
                                    href={item?.link || ""}
                                    style={{
                                      cursor: item?.link ? "pointer" : "default",
                                    }}
                                  >
                                    <AppImage
                                      src={item?.imagePath}
                                      alt={item.title}
                                      width={373}
                                      height={213}
                                      className="object-cover"
                                    />
                                  </Link>
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                        )}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                          {photos && photos?.length > 0 && (
                            <Swiper
                              slidesPerView={1}
                              spaceBetween={10}
                              freeMode={true}
                              className="mySwiper"
                              centeredSlidesBounds={false}
                              centeredSlides={false}
                              modules={[FreeMode]}
                              breakpoints={{
                                200: {
                                  slidesPerView: 1,
                                  spaceBetween: 10,
                                },
                                480: {
                                  slidesPerView: 1,
                                  spaceBetween: 10,
                                },
                                768: {
                                  slidesPerView: 2,
                                  spaceBetween: 10,
                                },
                                1024: {
                                  slidesPerView: 1,
                                  spaceBetween: 10,
                                },
                              }}
                            >
                              {photos.map((item: any) => {
                                const record =
                                  item?.LibraryImages &&
                                  item?.LibraryImages?.find(
                                    (i: any) => i.isDefault
                                  );
                                return (
                                  <SwiperSlide key={item?.photoLibraryId}>
                                    <AppImage
                                      src={record?.imagePath}
                                      alt={record?.title}
                                      width={373}
                                      height={213}
                                      className="object-cover"
                                    />
                                  </SwiperSlide>
                                );
                              })}
                            </Swiper>
                          )}
                          {photos?.length > 0 && (
                            <div className="text-center">
                              <Link
                                href="/photo-library"
                                className="text-blue-600 hover:underline"
                              >
                                View All
                              </Link>
                            </div>
                          )}
                        </div>
                        <Script
                          async
                          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5659048786851839"
                          crossOrigin="anonymous"
                        />
                        <ins
                          className="adsbygoogle"
                          style={{
                            display: "block",
                          }}
                          data-ad-format="autorelaxed"
                          data-ad-client="ca-pub-5659048786851839"
                          data-ad-slot="1333641893"
                        />
                        <script>
                          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                        </script>
                      </div>
                    )}
                    <div
                      className={`col-span-12 ${
                        hideNonPageData ? "lg:col-span-12" : "lg:col-span-6"
                      } order-1 lg:order-2`}
                    >
                      <ClientErrorBoundary>
                        {children}
                      </ClientErrorBoundary>
                    </div>
                    {!hideNonPageData && (
                      <div className="col-span-12 md:col-span-3 match-card md:mt-56 order-3 md:order-3">
                        {/* {commentaryId ? <div className='mb-5'>
                    <FullScoreSidebar commentaryId={commentaryId} />
                  </div> : null} */}
                        {rightBanner && rightBanner.length > 0 && (
                          <Swiper
                            slidesPerView={1}
                            spaceBetween={10}
                            freeMode={true}
                            className="mySwiper mb-5"
                            centeredSlidesBounds={false}
                            centeredSlides={false}
                            modules={[FreeMode, Autoplay]}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                            }}
                            breakpoints={{
                              200: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                              },
                              480: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                              },
                              768: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                              },
                              1024: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                              },
                            }}
                          >
                            {rightBanner.map((item: any) => {
                              const encodedTitle = item?.title
                                ? encodeURIComponent(
                                    item?.title
                                      .toLowerCase()
                                      .replace(/[^a-zA-Z0-9\s]/g, "")
                                      .replace(/\s+/g, "-")
                                      .replace(/-{2,}/g, "-")
                                      .trim()
                                  )
                                : "";
                              return (
                                <SwiperSlide key={item.bannerId}>
                                  <Link
                                    href={item?.link || ""}
                                    style={{
                                      cursor: item?.link ? "pointer" : "default",
                                    }}
                                  >
                                    <AppImage
                                      src={item?.imagePath}
                                      alt={item.title}
                                      width={373}
                                      height={213}
                                      className="object-cover"
                                    />
                                  </Link>
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                        )}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                          {video && video?.length > 0 && (
                            <Swiper
                              slidesPerView={1}
                              spaceBetween={10}
                              freeMode={true}
                              className="mySwiper"
                              centeredSlidesBounds={false}
                              centeredSlides={false}
                              modules={[FreeMode, Navigation]}
                              navigation={{
                                nextEl: ".custom-next",
                                prevEl: ".custom-prev",
                              }}
                              breakpoints={{
                                200: {
                                  slidesPerView: 1,
                                  spaceBetween: 10,
                                },
                                480: {
                                  slidesPerView: 1,
                                  spaceBetween: 10,
                                },
                                768: {
                                  slidesPerView: 2,
                                  spaceBetween: 10,
                                },
                                1024: {
                                  slidesPerView: 1,
                                  spaceBetween: 10,
                                },
                              }}
                            >
                              {video.map((item: any) => {
                                return (
                                  <SwiperSlide key={item.id}>
                                    {item.type === 1 ? (
                                      // Display uploaded video
                                      <video width="100%" height="auto" controls>
                                        <source
                                          src={item.video}
                                          type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    ) : item.type === 2 ? (
                                      // Display YouTube embedded video
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: item.videoURL,
                                        }}
                                      />
                                    ) : null}
                                  </SwiperSlide>
                                );
                              })}
                              <div className="custom-prev">❮</div>
                              <div className="custom-next">❯</div>
                            </Swiper>
                          )}
                          {video?.length > 0 && (
                            <div className="text-center">
                              <Link
                                href="/video-library"
                                className="text-blue-600 hover:underline"
                              >
                                View All
                              </Link>
                            </div>
                          )}
                        </div>
                        <div
                          id="match-container"
                          className="overflow-y-auto max-h-[calc(100vh-150px)]"
                        >
                          {Object.keys(groupedMatches)
                            .filter((date) => date == formattedDate)
                            .map((date) => (
                              <div className="p-0 bg-white" key={date}>
                                <h3 className="col-span-6 py-1 px-2 match-title text-xs mb-1 uppercase">
                                  Recent Matches
                                </h3>
                                {groupedMatches[date].map((match, index) => (
                                  <MatchInfoCard
                                    isSidebar={true}
                                    match={match}
                                    index={index}
                                    groupedMatchesLength={
                                      groupedMatches[date].length
                                    }
                                    showResult={true}
                                    timeTextSize="xs"
                                    pages={pages}
                                    linkURL={FULL_SCORE_COMPONENT}
                                  />
                                ))}
                              </div>
                            ))}
                        </div>
                        <div className="fixed bottom-4 right-4 flex gap-2 bg-gray-500 p-2 rounded-lg shadow-lg mr-5">
                          {socialMedia.length > 0 &&
                            socialMedia
                              .filter((i) => i.isActive)
                              ?.map((item) => (
                                <Link
                                  key={item?.id}
                                  href={item?.link}
                                  target="_blank"
                                  className="text-white hover:text-blue-500"
                                >
                                  <AppImage
                                    src={item?.imagePath || ""}
                                    alt={item?.name}
                                    width={25}
                                    height={25}
                                  />
                                </Link>
                              ))}
                        </div>
                        <Script
                          async
                          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5659048786851839"
                          crossOrigin="anonymous"
                        />
                        <ins
                          className="adsbygoogle"
                          style={{
                            display: "block",
                          }}
                          data-ad-format="autorelaxed"
                          data-ad-client="ca-pub-5659048786851839"
                          data-ad-slot="3289892831"
                        />
                        <script>
                          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                        </script>
                      </div>
                    )}
                  </div>
                </ClientErrorBoundary>
                <ToastContainer />
              </main>
            )}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
