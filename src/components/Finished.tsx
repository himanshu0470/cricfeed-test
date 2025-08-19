"use client";

import { useEffect, useState } from "react";
import { MatchData } from "@/types/matches";
import { formatDate, sortMatchesByDateTime } from "@/utils/function";
import { api } from "@/lib/apiUtils";
import { useApp } from "@/app/providers";
import { FULL_SCORE_COMPONENT } from "@/constants/fullScoreConst";
import MatchSkeleton from "./skeleton/matchSkeleton";
import MatchInfoCard from "./shared/MatchInfoCard";
import Link from "next/link";
import Script from "next/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { convertDateTimeUTCToLocal } from "@/utils/fullscore";
import AppImage from "@/constants/AppImage";

export default function Finished() {
  const { initialData, configData } = useApp();
  const [whitelabelId, setWhitelabelId] = useState<string>("");
  const pages = initialData?.pages || [];
  const topBanner = initialData?.banner?.filter(
    (item) =>
      item?.bannerType == 1 &&
      item?.isActive &&
      (new Date(item?.endDate) > new Date() || item?.isPermanent)
  );
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
  const bottomBanner = initialData?.banner?.filter(
    (item) =>
      item?.bannerType == 4 &&
      item?.isActive &&
      (new Date(item?.endDate) > new Date() || item?.isPermanent)
  );
  const [finishedMatches, setFinishedMatches] = useState<MatchData[]>([]);
  const [groupedMatches, setGroupedMatches] = useState<{
    [key: string]: MatchData[];
  }>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
      if(configData) {
        setWhitelabelId(configData?.domain?.id);
      }
  },[configData])

  // const fetchCred = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await api.getConfigData();
  //     const domain = response?.domain;
  //     setWhitelabelId(domain?.id);
  //   } catch (error) {
  //     console.error("Error fetching config data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCred();
  // }, []);

  const fetchCompleted = async (whitelabelId: string) => {
    if (loading || !hasMore) return;
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

        if (page < data?.totalPages) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } else {
        console.error("Expected data to be an array, but got:", data);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoadingData(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if(whitelabelId) {
      fetchCompleted(whitelabelId);
    }
  }, [page, whitelabelId]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("match-container");

      if (!container || loading || !hasMore) return;

      const scrollPosition = container.scrollTop + container.clientHeight;
      const scrollHeight = container.scrollHeight;

      const threshold = window.innerHeight * 0.5;

      if (scrollHeight - scrollPosition <= threshold) {
        setPage((prevPage) => prevPage + 1); // Load next page
      }
    };

    const container = document.getElementById("match-container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading]);

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

  return (
    <div className="header bg-gray-50 z-0 text-black mt-56">
      {loadingData ? (
        <MatchSkeleton />
      ) : (
          <div className="container-fluid mx-auto lg;px-4 pb-0">
            <div className="grid grid-cols-12 gap-4">
              {/* <div className="col-span-12 md:col-span-0 match-card order-2 md:order-1 py-2 px-2">
                {leftBanner && leftBanner.length > 0 && (
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    freeMode={true}
                    className="mySwiper"
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
                    {leftBanner.map((item) => {
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
                            <img
                              src={item.image}
                              alt={item.title}
                              className="object-cover"
                            />
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}
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
              </div> */}
              <div className="col-span-12 match-card order-1 md:order-2">
                {topBanner && topBanner.length > 0 && (
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    freeMode={true}
                    className="mySwiper"
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
                    {topBanner.map((item) => {
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
                              fill
                              className="object-cover"
                            />
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}
                <div
                  id="match-container"
                  className="overflow-y-auto max-h-[calc(100vh-150px)]"
                >
                  {Object.keys(groupedMatches).map((date) => (
                    <div className="p-0" key={date}>
                      <h3 className="col-span-6 px-2 match-title">
                        {formatDate(date)}
                      </h3>
                      {groupedMatches[date].map((match, index) => (
                        <MatchInfoCard
                          match={match}
                          index={index}
                          groupedMatchesLength={groupedMatches[date].length}
                          showResult={true}
                          timeTextSize="xs"
                          pages={pages}
                          linkURL={FULL_SCORE_COMPONENT}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {/* <div className="col-span-12 md:col-span-0 match-card order-3 md:order-3 py-2 px-2">
                {rightBanner && rightBanner.length > 0 && (
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    freeMode={true}
                    className="mySwiper"
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
                    {rightBanner.map((item) => {
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
                            <img
                              src={item.image}
                              alt={item.title}
                              className="object-cover"
                            />
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}
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
              </div> */}
            </div>
            <div>
              {bottomBanner && bottomBanner.length > 0 && (
                <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  freeMode={true}
                  className="mySwiper"
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
                  {bottomBanner.map((item) => {
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
                            fill
                            className="object-cover"
                          />
                        </Link>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              )}
            </div>
          </div>
      )}
    </div>
  );
}