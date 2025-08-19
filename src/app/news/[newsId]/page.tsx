'use client';
import { useApp } from '@/app/providers';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
// import Image from 'next/image';
import { LoadingScreen } from '@/components/animations/LoadingScreen';
import { Calendar, Eye } from 'lucide-react';
import AppImage from '@/constants/AppImage';

export default function NewsArticle() {
  const params = useParams();
  const { initialData } = useApp(); // Use `initialData` directly from `AppContext`
  const news = initialData?.news || [];
  const newsItem = news?.find(item => item.newsId.toString() === params.newsId);

  if (!newsItem) return <LoadingScreen />;

  return (
    <div className="min-h-fit bg-white shadow-md rounded-lg dark:bg-gray-900 mt-56 pb-2 overflow-hidden">
      <article className="max-w-4xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-[16px] md:text-2xl font-display font-bold text-gray-900 dark:text-white py-4">
              {newsItem.title}
            </h1>
            <div className="flex justify-center items-center space-x-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {new Date(newsItem.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                {newsItem.viewerCount} views
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-64 w-full lg:w-96 float-left mr-4 mb-4">
            <AppImage
              src={newsItem?.imagePath}
              alt={newsItem.title}
              fill
              className="object-cover"
            />
          </div>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: newsItem.news }}
          />
        </motion.div>
      </article>
    </div>
  );
}