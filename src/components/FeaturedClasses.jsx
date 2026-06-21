"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "motion/react";
import { User, Tag, Clock, DollarSign, Flame } from "lucide-react";
import { serverFetch } from "@/lib/core/server"; 

export default function FeaturedClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setLoading(true);
  serverFetch("/featured-classes")
    .then((data) => {
     
      if (Array.isArray(data)) {
        setClasses(data);
      } else {
        console.error("Backend did not return an array:", data);
        setClasses([]);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error loading featured classes:", err);
      setClasses([]);
      setLoading(false);
    });
}, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 16 },
    },
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center bg-white dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-950 py-20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center gap-2 mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 border border-blue-100 dark:border-blue-900/30">
            <Flame className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-blue-700 dark:text-blue-300">
              Top Booked
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Our Featured <span className="text-blue-600">Classes</span>
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-md">
            Explore our most popular workout sessions tailored by professional trainers based on overall community bookings.
          </p>
        </div>

        {/* Classes Cards Grid Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
         {Array.isArray(classes) && classes.map((cls) => (
            <motion.div
              key={cls._id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-100/50 dark:border-slate-900 dark:bg-slate-900 dark:shadow-none cursor-pointer"
            >
              {/* Optional Class Image Area */}
              {cls.image && (
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950 mb-4">
                  <img
                    src={cls.image}
                    alt={cls.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white font-black text-[11px] px-2.5 py-1 rounded-lg shadow-sm">
                    {cls.bookingCount || 0} Bookings
                  </div>
                </div>
              )}

              {/* Category Tag */}
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-2">
                <Tag size={13} className="shrink-0" />
                <span className="text-xs font-extrabold uppercase tracking-wide">{cls.category}</span>
              </div>

              {/* Class Title */}
              <h3 className="text-xl font-black text-slate-950 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                {cls.name}
              </h3>

              {/* Trainer Meta */}
              <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400 border-b border-slate-50 dark:border-slate-800/60 pb-3">
                <User size={14} className="text-slate-400 shrink-0" />
                <span className="text-xs font-bold">Trainer: <span className="text-slate-700 dark:text-slate-300">{cls.trainerName || "Expert Trainer"}</span></span>
              </div>

              {/* Pricing & Duration Block */}
              <div className="flex items-center justify-between my-4 text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <DollarSign size={15} className="text-blue-600 shrink-0" />
                  <span className="text-base font-extrabold text-slate-950 dark:text-white">${cls.price}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Clock size={14} className="text-slate-400 shrink-0" />
                  <span>{cls.duration}</span>
                </div>
              </div>

              {/* Action Details Button */}
              <Link href={`/classes/${cls._id}`} className="mt-auto w-full">
               <Button
  radius="xl"
  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-200 dark:shadow-none transition-all duration-200"
>
  View Details
</Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}