"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function StatsSection() {
const stats = useMemo(() => [
  { value: "557K", label: "Total Trader" },
  { value: "475K", label: "Positive Review" },
  { value: "25K", label: "Task received" },
  { value: "265K", label: "Task completed" },
], []);

  // Parse value to number (e.g., "557K" → 557000)
  const parseValue = (value: string): number => {
    return value.endsWith("K")
      ? parseFloat(value.slice(0, -1)) * 1000
      : parseInt(value.replace(/,/g, ""));
  };

  // Format number back to string with K
  const formatValue = (num: number): string => {
    return num >= 1000 ? (num / 1000).toFixed(0) + "K" : num.toString();
  };

  const [displayedValues, setDisplayedValues] = useState<number[]>(
    stats.map(() => 0)
  );

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");

      stats.forEach((stat, index) => {
        const finalValue = parseValue(stat.value);
        const duration = 2000;
        const startTime = performance.now();

        const animateCount = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const currentValue = Math.floor(progress * finalValue);

          setDisplayedValues((prev) => {
            const newValues = [...prev];
            newValues[index] = currentValue;
            return newValues;
          });

          if (progress < 1) {
            requestAnimationFrame(animateCount);
          }
        };

        // Stagger each stat count-up
        setTimeout(() => {
          requestAnimationFrame(animateCount);
        }, 300 * index);
      });
    }
  }, [isInView, controls, stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 px-4 md:px-6 bg-gradient-to-br from-[#FCF2EA] to-[#FFE8D6] font-inter"
    >
      <motion.div
        className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group flex flex-col items-center text-center gap-1 cursor-default p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-white/60 hover:shadow-lg"
            whileHover={{ y: -6 }}
          >
            <motion.h3
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#1C2A47] to-[#E66A3A] bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.3 }}
            >
              {formatValue(displayedValues[index])}
            </motion.h3>
            <p className="text-base md:text-lg lg:text-xl font-medium text-gray-700 group-hover:text-[#1C2A47] transition-colors">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}