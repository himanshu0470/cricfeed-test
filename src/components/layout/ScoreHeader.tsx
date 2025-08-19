"use client";

import { useEffect, useState } from "react";
import { MatchData } from "@/types/matches";
import { getMatchType, LIVE, sortMatchesByDateTime, UPCOMMING } from "@/utils/function";
import { HeaderMatchCard } from "@/components/layout/HeaderMatchCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FreeMode } from "swiper/modules";
import ScoreHeaderSkeleton from "../skeleton/scoreHeaderSkeleton";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { api } from "@/lib/apiUtils";
import { useApp } from "@/app/providers";

export default function ScoreHeader() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [whitelabelId, setWhitelabelId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const { configData } = useApp();

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

  useEffect(() => {
    const fetchMatches = async (whitelabelId: string) => {
      const data = await api.getMatchData(whitelabelId);
      if (data) {
        const combineData = [...data.liveMatches, ...data.scheduleMatches];
        const sortedData = sortMatchesByDateTime(combineData);
        setMatches(sortedData);
        setLoading(false);
      } else {
        console.error("Expected data to be an array, but got:", data);
      }
    };

    if(whitelabelId) {
      fetchMatches(whitelabelId);
    }
  }, [whitelabelId]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container-fluid mt-4">
      {/* px-4 py-4 score-header-bg */}
      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        freeMode={true}
        className="mySwiper"
        scrollbar={{ draggable: true }}
        centeredSlidesBounds={false}
        centeredSlides={false}
        autoplay
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        modules={[FreeMode, Navigation]}
        breakpoints={{
          // when window width is >= 320px
          200: {
            slidesPerView: 1,
            spaceBetween: 10, // Adjust this value for smaller screens if needed
          },
          // when window width is >= 480px
          480: {
            slidesPerView: 1,
            spaceBetween: 10, // Adjust this value for medium screens if needed
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 10, // Adjust this value for larger screens if needed
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 4,
            spaceBetween: 10, // Adjust this value for extra-large screens if needed
          },
          1440: {
            slidesPerView: 4,
            spaceBetween: 10, // Adjust this value for extra-large screens if needed
          },
        }}
      >
        {loading ? (
          <>
            <SwiperSlide>
              <ScoreHeaderSkeleton />
            </SwiperSlide>
            <SwiperSlide>
              <ScoreHeaderSkeleton />
            </SwiperSlide>
            <SwiperSlide>
              <ScoreHeaderSkeleton />
            </SwiperSlide>
          </>
        ) : (
          matches
            ?.filter((match) => {

              const now = new Date(); // Current time
              const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
              const matchTime = new Date(match?.utc); // Match time from UTC

              if (getMatchType(match?.cst) === LIVE) {
                return true;
              } else if (getMatchType(match?.cst) === UPCOMMING) {
                return matchTime >= now && matchTime <= twoHoursLater; // Matches in next 2 hours
              }
              
              return false;
            })
            ?.map((match, i) => (
                <SwiperSlide key={match.cid}>
                  <HeaderMatchCard
                    match={match}
                    type={match.cst === 3 ? "Live" : "Upcoming"}
                  />
                </SwiperSlide>
            ))
        )}
      </Swiper>
    </div>
  );
}
