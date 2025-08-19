'use client';
import { motion } from 'framer-motion';

export const AnimatedScore = ({ score }: { score: string }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-sport"
    >
      {score}
    </motion.div>
  );
};