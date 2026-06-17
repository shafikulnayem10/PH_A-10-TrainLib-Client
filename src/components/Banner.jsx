"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowRight, Sparkles, Trophy, Activity } from "lucide-react";
import { motion } from "motion/react";

export default function Banner() {
  const features = [
    { id: 1, icon: <Trophy className="h-5 w-5 text-blue-500" />, label: "Expert Trainers" },
    { id: 2, icon: <Activity className="h-5 w-5 text-blue-500" />, label: "Live Analytics" },
    { id: 3, icon: <Sparkles className="h-5 w-5 text-blue-500" />, label: "Premium Classes" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative w-full overflow-hidden py-24 sm:py-32 lg:py-40 bg-slate-950 text-white flex items-center justify-center min-h-[85vh]">
      
      {/* Background Gym Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: "url('/images/bannerbgpic.jpg')",
        }}
      />

     
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1.5px]" />

      {/* Glow Effect */}
      <div className="absolute left-1/2 top-[20%] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />

      {/* Content Wrapper */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
          
          {/* Top Badge with Entry Animation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 backdrop-blur-md px-4 py-1.5 select-none"
          >
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-extrabold tracking-wide uppercase text-blue-300">
              Transform Your Fitness Journey
            </span>
          </motion.div>

          {/* Energetic Title with Smooth Fade In */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15] sm:leading-[1.15] drop-shadow-md uppercase"
          >
            Push Your <span className="text-blue-500">Limits</span>,<br />
            Discover Your <span className="text-blue-500">Potential</span>
          </motion.h1>

          {/* Brief Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-base sm:text-lg font-medium text-slate-200 max-w-2xl leading-relaxed drop-shadow"
          >
            Join TrainLib to experience premium fitness classes, connect with world-class certified trainers, and reach your health goals alongside an unstoppable community.
          </motion.p>

          {/* CTA Buttons Layout */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
          >
            {/* Main Explore Classes CTA */}
            <Link href="/classes" className="w-full sm:w-auto">
              <Button
                size="lg"
                radius="xl"
                className="w-full sm:w-auto h-14 bg-blue-600 px-8 text-base font-black text-white hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all duration-300 group"
              >
                Explore Classes
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>

            {/* Secondary CTA */}
            <Link href="/forum" className="w-full sm:w-auto">
              <Button
                size="lg"
                radius="xl"
                variant="bordered"
                className="w-full sm:w-auto h-14 border-white/20 bg-white/5 text-white font-extrabold hover:bg-white/10 px-8 text-base transition-colors duration-200 backdrop-blur-sm"
              >
                Join Community
              </Button>
            </Link>
          </motion.div>

          {/* Features Grid utilizing Framer Motion Stagger Animation */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-3 gap-6 sm:gap-12 mt-12 pt-12 border-t border-white/10 w-full max-w-xl text-slate-400"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex flex-col items-center gap-2 cursor-pointer select-none group"
              >
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-colors duration-300">
                  {feature.icon}
                </div>
                <span className="text-xs font-bold text-slate-200 transition-colors duration-300 group-hover:text-white">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}