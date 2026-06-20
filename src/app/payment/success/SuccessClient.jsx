'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CircleCheckFill, Envelope, ArrowLeft } from '@gravity-ui/icons';

export default function SuccessClient({ session, userRole, dashboardLink, backendResponse }) {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.3
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 20,
                delay: 0.2
            }
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 flex flex-col justify-center items-center p-6">
            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-emerald-300/5 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                className="relative max-w-md w-full"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.section 
                    variants={cardVariants}
                    className="bg-white border border-blue-100/80 rounded-3xl p-8 shadow-2xl shadow-blue-100/50 overflow-hidden"
                >
                    {/* Success Icon */}
                    <motion.div 
                        variants={iconVariants}
                        className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-200/50 shadow-lg shadow-emerald-200/30"
                    >
                        <CircleCheckFill className="w-10 h-10 text-emerald-500" />
                    </motion.div>

                    {/* Success Text */}
                    <motion.div variants={itemVariants} className="text-center">
                        <h1 className="text-2xl font-black text-blue-950 tracking-tight">
                            Payment Successful!
                        </h1>
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50/80 backdrop-blur-sm px-3 py-1 rounded-full mt-2 border border-emerald-200/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Booking Confirmed</span>
                        </div>
                    </motion.div>

                    {/* Message */}
                    <motion.p 
                        variants={itemVariants}
                        className="text-blue-500 text-sm leading-relaxed text-center mt-3 font-medium"
                    >
                        {backendResponse?.message || "Thank you for your enrollment! Your seat has been secured and the booking is verified."}
                    </motion.p>

                    {/* Transaction Details */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-gradient-to-r from-blue-50/70 to-emerald-50/50 border border-blue-100/60 rounded-2xl p-5 mt-6 space-y-3.5"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Envelope className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                                    Confirmation Email
                                </span>
                                <span className="text-sm font-semibold text-blue-950 break-all">
                                    {session.customer_details?.email}
                                </span>
                            </div>
                        </div>

                        {session.metadata?.className && (
                            <div className="flex items-start gap-3 pt-3 border-t border-blue-100/50">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 text-sm font-bold">📚</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                                        Class Booked
                                    </span>
                                    <span className="text-sm font-semibold text-blue-950">
                                        {session.metadata.className}
                                    </span>
                                </div>
                            </div>
                        )}

                        {session.metadata?.price && (
                            <div className="flex items-start gap-3 pt-3 border-t border-blue-100/50">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 text-sm font-bold">💰</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                                        Amount Paid
                                    </span>
                                    <span className="text-sm font-bold text-blue-950">
                                        ${parseFloat(session.metadata.price).toFixed(2)} USD
                                    </span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div 
                        variants={itemVariants}
                        className="space-y-3 mt-6"
                    >
                        <Link
                            href={dashboardLink}
                            className="block w-full text-center text-xs font-bold px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-lg shadow-blue-200/50 transition-all duration-200 capitalize hover:scale-[1.02]"
                        >
                            Go to {userRole} Workspace
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-600 py-2 transition w-full"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Return to Homepage
                        </Link>
                    </motion.div>

                    {/* Secure Badge */}
                    <motion.div 
                        variants={itemVariants}
                        className="flex items-center justify-center gap-2 mt-4 text-[10px] text-blue-400 font-medium"
                    >
                        <span className="w-1 h-1 rounded-full bg-blue-300"></span>
                        <span>Transaction secured via Stripe</span>
                        <span className="w-1 h-1 rounded-full bg-blue-300"></span>
                        <span>ID: {session.id.slice(0, 12)}...</span>
                    </motion.div>
                </motion.section>
            </motion.div>
        </div>
    );
}