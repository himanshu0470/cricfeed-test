"use client";
import { motion } from "framer-motion";
// import Image from "next/image";
import { api } from "@/lib/apiUtils";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import { useEffect, useState } from "react";
import AppImage from "@/constants/AppImage";

export default function PhotoLibrary() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPhoto = async () => {
    setLoading(true);
    try {
      const data = await api.getPhotoLibrary();
      setPhotos(data?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoto();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-white shadow-md rounded-lg bg-white mt-56">
      <section className="py-2 px-2">
        <div className="container-fluid mx-auto max-w-6xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-md md:text-xl font-display font-bold text-gray-900 dark:text-white text-center news-font uppercase"
          >
            Photo Library
          </motion.h1>
        </div>
      </section>

      <section className="px-2 pb-2">
        <div className="container-fluid mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
            {photos &&
              photos?.length > 0 &&
              photos?.map((item: any, index) => {
                const record =
                  item?.LibraryImages &&
                  item?.LibraryImages?.find((i: any) => i.isDefault);
                return (
                  <motion.article
                    key={item?.photoLibraryId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative h-36">
                      <AppImage
                        src={record?.imagePath}
                        alt={record?.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <h2 className="text-[12px] font-bold text-gray-900 dark:text-white line-clamp-2 uppercase news-font">
                        {item.title}
                      </h2>
                      {item?.startDate && (
                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            {new Date(item.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}