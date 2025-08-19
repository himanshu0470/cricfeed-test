"use client";
import { motion } from "framer-motion";
import { api } from "@/lib/apiUtils";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { useEffect, useState } from "react";

export default function VideoLibrary() {
  const [video, setVideo] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const data = await api.getVideoLibrary();
      setVideo(data?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching video:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-white shadow-md rounded-lg bg-white mt-56">
      <section className="py-2 px-2">
        <div className="container-fluid mx-auto max-w-6xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-md md:text-xl font-display font-bold text-gray-900 dark:text-white uppercase text-center"
          >
            Video Library
          </motion.h1>
        </div>
      </section>

      <section className="px-2 pb-2">
        <div className="container-fluid mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
            {video &&
              video?.length > 0 &&
              video.map((item: any, index) => (
                <motion.article
                  key={item?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
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
                  <div className="p-2">
                    <h2 className="text-[12px] font-bold text-gray-900 dark:text-white line-clamp-2 uppercase news-font">
                      {item.title}
                    </h2>
                    {item?.from && (
                      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>{new Date(item?.from).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}