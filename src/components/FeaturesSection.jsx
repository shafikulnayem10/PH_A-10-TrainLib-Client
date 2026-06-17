"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Dumbbell, Users, Trophy } from 'lucide-react';

const features = [
    {
        icon: <Dumbbell className="w-6 h-6 text-blue-600" />,
        title: "Expert Training Programs",
        description: "Access tailored workout routines designed by certified professionals to maximize your performance and efficiency."
    },
    {
        icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
        title: "Safe & Verified Spaces",
        description: "Every trainer and class listed on our platform undergoes strict vetting to maintain elite community standards."
    },
    {
        icon: <Users className="w-6 h-6 text-blue-600" />,
        title: "Vibrant Community Forum",
        description: "Engage with like-minded fitness enthusiasts, share your transformational journey, and get interactive support."
    },
    {
        icon: <Trophy className="w-6 h-6 text-blue-600" />,
        title: "Track Proven Success",
        description: "Monitor your milestones and join top-booked training sessions that have consistently yielded verifiable results."
    }
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const FeaturesSection = () => {
    return (
        <section className="py-20 bg-white dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Why Fitness Enthusiasts Trust TrainLib
                    </h2>
                    <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
                        We provide the structural tools, elite professional mentorship, and peer support networks needed to turn ambitious wellness goals into real, permanent habits.
                    </p>
                </div>

                {/* Animated Framer Motion Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/60 transition-shadow hover:shadow-md cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center mb-5">
                                {feature.icon}
                            </div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default FeaturesSection;