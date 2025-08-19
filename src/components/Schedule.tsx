"use client";

import { useEffect, useState } from "react";
import { MatchData } from "@/types/matches";
import { formatDate, sortMatchesByDateTime } from "@/utils/function";
import { api } from "@/lib/apiUtils";
import { useApp } from "@/app/providers";
import { FULL_SCORE_COMPONENT } from "@/constants/fullScoreConst";
import { motion } from "framer-motion";
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
import { usePathname } from "next/navigation";
import { slugToCompetitionName } from "@/utils/navigation";
import AppImage from "@/constants/AppImage";

export default function Schedule() {
  const pathname = usePathname();
  const { initialData, configData } = useApp();
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
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [groupedMatches, setGroupedMatches] = useState<{
    [key: string]: MatchData[];
  }>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const pathSegments = pathname?.split("/").filter(Boolean);
  const [whitelabelId, setWhitelabelId] = useState<string>("");
  // const competitionId = pathname?.split('/').filter(Boolean)[1];
  const competitionId = pathSegments?.[1];
  const competitionNameSlug = pathSegments?.[2];

  const competitionName = slugToCompetitionName(competitionNameSlug);

  useEffect(() => {
    if (configData) {
      setWhitelabelId(configData?.domain?.id);
    }
  }, [configData]);
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

  const fetchMatches = async (whitelabelId: string) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const rawData = await api.getLiveScheduleMatches(
        page,
        +competitionId,
        whitelabelId
      );

      const data = {
        data: Array.isArray(rawData) ? rawData : rawData?.data ?? [],
        totalPages: rawData?.totalPages ?? 1, // Fallback if not provided
      };

      if (Array.isArray(data?.data)) {
        setMatches((prevMatches) => {
          const existingEids = new Set(prevMatches.map((match) => match.cid));
          const newMatches = data.data.filter(
            (match) => !existingEids.has(match.cid)
          );
          if (newMatches.length > 0) {
            const updatedMatches = [...prevMatches, ...newMatches];
            return sortMatchesByDateTime(updatedMatches);
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
    if (whitelabelId) {
      fetchMatches(whitelabelId);
    }
  }, [page, competitionId, whitelabelId]);

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
    const grouped = matches.reduce((acc, match) => {
      // Convert the UTC time to IST
      const istDate = convertDateTimeUTCToLocal(match.utc);
      // Initialize the date group if it doesn't exist
      if (!acc[istDate.localDate]) {
        acc[istDate.localDate] = [];
      }

      // Add the match to the appropriate date group
      acc[istDate.localDate].push(match);
      return acc;
    }, {} as { [key: string]: MatchData[] });
    setGroupedMatches(grouped);
  }, [matches]);

  return (
    <div className="header bg-gray-50 z-0 text-black mt-56">
      {loadingData ? (
        <MatchSkeleton />
      ) : (
        <div className="container-fluid pb-0">
          <div className="grid grid-cols-12 gap-4">
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
              {competitionName && (
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-2 py-1 mb-2 rounded match-title bg-blue-600"
                >
                  <h1 className="text-md md:text-xl font-display font-bold text-white text-start news-font">
                    Tournament : {competitionName}
                  </h1>
                </motion.h1>
              )}
              <div
                id="match-container"
                className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-150px)]"
              >
                {Object.keys(groupedMatches).length > 0 ? (
                  Object.keys(groupedMatches).map((date) => (
                    <div className="p-0" key={date}>
                      <h3 className="col-span-6 px-2 match-title">
                        {formatDate(date)}
                      </h3>
                      {groupedMatches[date].map((match, index) => (
                        <MatchInfoCard
                          match={match}
                          index={index}
                          groupedMatchesLength={groupedMatches[date].length}
                          showLocation={true}
                          timeTextSize="sm"
                          pages={pages}
                          linkURL={FULL_SCORE_COMPONENT}
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center p-5">No records available</div>
                )}
              </div>
            </div>
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
