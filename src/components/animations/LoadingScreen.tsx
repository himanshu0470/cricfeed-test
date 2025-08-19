'use client';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/lotties/cricket-loader.json';
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-sport-dark/95 to-black/95 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 relative">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
          />
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-sport-dark/20" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sport-primary font-display text-xl mt-4"
        >
        </motion.div>
      </div>
    </motion.div>
  );
};