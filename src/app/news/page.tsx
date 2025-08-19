'use client';
import { useApp } from '@/app/providers';
import { motion } from 'framer-motion';
import Link from 'next/link';
// import Image from 'next/image';
import { LoadingScreen } from '@/components/animations/LoadingScreen';
import AppImage from '@/constants/AppImage';

export default function NewsPage() {
  const { initialData } = useApp(); // Use `initialData` directly from `AppContext`
  const news = initialData?.news || [];

  if (!news) return <LoadingScreen />;

  return (
    <div className="bg-white shadow-md rounded-lg mt-56">
      <div className='grid grid-cols-12'>
        <div className='col-span-12 md:col-span-12 py-2 px-2'>
        {/* Hero Section */}
          <section className=''>
            <div className="container-fluid mx-auto max-w-6xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-md md:text-xl font-display font-bold text-gray-900 dark:text-white text-center news-font uppercase"
              >
                Cricket News
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[14px] text-gray-600 dark:text-gray-300 text-center mx-auto py-4 news-font"
              >
                Stay updated with the latest cricket news and stories from around the world
              </motion.p>
            </div>
          </section>
        
        {/* News Grid */}
          <section className="">
            <div className="container-fluid mx-auto max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                {news.map((item, index) => (
                  <motion.article
                    key={item.newsId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <Link href={`/news/${item.newsId}`} rel="canonical">
                      <div className="relative h-36 p-2">
                        <AppImage
                          src={item?.imagePath}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <h2 className="text-[12px] font-bold text-gray-900 dark:text-white line-clamp-2 uppercase news-font">
                          {item.title}
                        </h2>
                        <div className="flex justify-between items-center text-[10px] text-gray-600 dark:text-gray-400">
                          <span>{new Date(item.startDate).toLocaleDateString()}</span>
                          <span>{item.viewerCount} views</span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        </div>
        {/* <div className='col-span-12 md:col-span-3 bg-slate-50 mr-6 my-6 rounded shadow-md'></div> */}
      </div>
    </div>
  );
}