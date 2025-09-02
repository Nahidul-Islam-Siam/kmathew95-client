'use client'
import Image from "next/image";
import img from '@/assets/hero/Group 4302.png';
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactUsSection() {
  // Animation variants
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20 font-dm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <motion.div className="text-center lg:text-left" variants={itemVariants}>
              <h4 className="text-[#E57931] text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                For Trader
              </h4>
            </motion.div>

            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-[#1C2A47] mb-4 md:mb-6"
              variants={itemVariants}
            >
              Discover talent tailored to your needs.
            </motion.h2>

            <motion.p
              className="text-[#1A1A1A] text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Team up with the biggest crew of freelancers and get stuff done—whether you need something quick or a major overhaul!
            </motion.p>

            <motion.button
              className="bg-[#E57931] hover:bg-orange-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full shadow-md transition-all duration-300 font-medium text-sm sm:text-base md:text-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0px 6px 20px rgba(229, 121, 49, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
       <Link href="/contact-us" className="no-underline text-white">
                Contact Us  
       
       </Link>
            </motion.button>
          </div>

          {/* Right Image */}
          <motion.div
            className="w-full lg:w-1/2"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            <div className="relative w-full h-auto rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={img}
                alt="Freelancer at work"
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}