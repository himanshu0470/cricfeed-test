"use client";

import { useApp } from "@/app/providers";
import Link from "next/link";
// import Image from "next/image";
import { api } from "@/lib/apiUtils";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { TOURNAMENT_COMPONENT } from "@/constants/fullScoreConst";
import { getTournamentUrl } from "@/utils/navigation";
import AppImage from "@/constants/AppImage";

export default function Home() {
  const { initialData } = useApp();
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState([]);
  const pages = initialData?.pages || [];
  const news = initialData?.news || [];
  const trending = initialData?.competitions || [];
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

  useEffect(() => {
    fetchPhoto();
    fetchVideo();
  }, []);

  return (
    <div className="header text-black mt-56">
      <div className="">
        <div className="container-fluid pb-0">
          <div className="grid grid-cols-12 gap-4">
            {/* <div className="col-span-12 md:col-span-3 match-card order-2 md:order-1 py-2 px-2">
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
              <div>
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
                      item?.LibraryImages?.find((i: any) => i.isDefault);
                    return (
                      <SwiperSlide key={item?.photoLibraryId}>
                        <img
                          src={record?.image}
                          alt={record?.title}
                          className="object-cover"
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              )}
              {photos?.length > 0 && (
                <div className="text-center">
                  <Link href="/photo-library" className="text-blue-600 hover:underline">
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
            </div> */}
            <div className="col-span-12 order-1 md:order-2 px-2">
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
              {/* trending competitions */}
              {trending && trending.length > 0 && (
                <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  freeMode={true}
                  className="mySwiper my-2"
                  centeredSlidesBounds={false}
                  centeredSlides={false}
                  modules={[FreeMode]}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    200: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                    },
                    480: {
                      slidesPerView: 4,
                      spaceBetween: 10,
                    },
                    768: {
                      slidesPerView: 6,
                      spaceBetween: 10,
                    },
                    1024: {
                      slidesPerView: 6,
                      spaceBetween: 10,
                    },
                  }}
                >
                  {trending
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    // .filter((item) => item.image)
                    .map((item, index) => {
                      const tournamentUrl = getTournamentUrl({
                        pages,
                        linkURL: TOURNAMENT_COMPONENT,
                        tournament: item
                      }) || "";
                      return (
                      <SwiperSlide key={item.competitionId}>
                        <Link
                          href={tournamentUrl || ""}
                          style={{
                            cursor: "pointer",
                          }}
                          className="p-0"
                        >
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow min-h-[188px]">
                        <AppImage
                          src={item?.imagePath || ""}
                          fill
                          alt={item.eventType}
                        />
                        <div className="flex flex-column items-center justify-center h-[48px]">
                          <h2 className="text-sm font-semibold text-center py-1 truncate-lines" title={item?.competitionName}>
                            {item?.competitionName}
                          </h2>
                        </div>
                        </div>
                        </Link>
                      </SwiperSlide>
                    )}
                    )}
                </Swiper>
              )}
              {/* news */}
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 my-2">
                {news &&
                  news.length > 0 &&
                  news.slice(0, 10).map((item, index) => (
                    <motion.article
                      key={item.newsId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <Link href={`/news/${item.newsId}`} rel="canonical">
                        <div className="relative h-48">
                          <AppImage
                            src={item?.imagePath}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="">
                          <h2 className="text-sm font-display font-bold text-gray-900 dark:text-white px-4 py-2">
                            {item.title}
                          </h2>
                          <div className="flex justify-between items-center text-sm text-gray-600 px-4 py-2 dark:text-gray-400">
                            <span>
                              {new Date(item.startDate).toLocaleDateString()}
                            </span>
                            <span>{item.viewerCount} views</span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
              </div>
              {news.length > 10 && (
                <div className="text-center py-2">
                  <Link href="/news" className="text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>
              )}
              {/* Today's event result */}
            </div>
            {/* <div className="col-span-12 md:col-span-3 match-card order-3 md:order-3 py-2 px-2">
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
              <div>
              {video && video?.length > 0 && (
                <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  freeMode={true}
                  className="mySwiper"
                  centeredSlidesBounds={false}
                  centeredSlides={false}
                  modules={[FreeMode, Navigation]}
                  navigation
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
                            <source src={item.video} type="video/mp4" />
                            Your browser does not support the video tag.
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
                </Swiper>
              )}
              {video?.length > 0 && (
                <div className="text-center">
                  <Link href="/video-library" className="text-blue-600 hover:underline">
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
      </div>
      {/* )} */}
    </div>
  );
}
