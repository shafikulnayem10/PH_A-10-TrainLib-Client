'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getClassDetails } from '@/lib/api/classes';
import { Card, Button, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { 
    DollarSign, User, Calendar, Clock, Shield, 
    ArrowRight, CheckCircle, CreditCard, Lock 
} from 'lucide-react';

const ImplementCheckoutPage = () => {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getClassDetails(id)
                .then((data) => {
                    setClassData(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch class details:", err);
                    setLoading(false);
                });
        }
    }, [id]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
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

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.3
            }
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" color="primary" />
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-blue-600 font-medium text-sm"
                    >
                        Loading class details...
                    </motion.p>
                </div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-xl font-bold text-blue-900">Class Not Found</h2>
                    <p className="text-blue-500 text-sm mt-2">The class you're looking for doesn't exist.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 py-12 px-4">
            <motion.div 
                className="max-w-2xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3 border border-blue-200/50">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Secure Checkout</span>
                    </div>
                    <h1 className="text-3xl font-black text-blue-950 tracking-tight">
                        Complete Your Booking
                    </h1>
                    <p className="text-blue-500 text-sm mt-2 font-medium">
                        Review your class details before proceeding to payment
                    </p>
                </motion.div>

                {/* Main Card */}
                <motion.div variants={cardVariants}>
                    <Card className="bg-white border border-blue-100/80 rounded-3xl shadow-xl shadow-blue-100/50 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                {/* Image with Overlay */}
                                {classData.image && (
                                    <motion.div 
                                        className="relative rounded-2xl overflow-hidden"
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img 
                                            src={classData.image} 
                                            alt={classData.name || classData.className} 
                                            className="w-full h-56 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-blue-700 font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                                                {classData.category || 'Fitness Class'}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Class Details */}
                                <motion.div variants={itemVariants} className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-blue-950">
                                                {classData.name || classData.className}
                                            </h2>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <div className="flex items-center gap-1.5 text-sm text-blue-600">
                                                    <User className="w-4 h-4" />
                                                    <span className="font-medium">{classData.trainerName || 'Expert Trainer'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Class Info Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-3">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-400" />
                                                <span className="text-xs font-medium text-blue-600">Duration</span>
                                            </div>
                                            <p className="text-sm font-bold text-blue-900 mt-0.5">
                                                {classData.duration || '60 mins'}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                <span className="text-xs font-medium text-blue-600">Schedule</span>
                                            </div>
                                            <p className="text-sm font-bold text-blue-900 mt-0.5">
                                                {classData.classSchedule || 'Flexible'}
                                            </p>
                                        </div>
                                    </div>

                                    {classData.description && (
                                        <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4">
                                            <p className="text-xs text-slate-500 font-medium">Description</p>
                                            <p className="text-sm text-slate-700 mt-1 leading-relaxed line-clamp-3">
                                                {classData.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Price Section */}
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 border border-blue-200/50 rounded-2xl p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                                                    <DollarSign className="w-4 h-4" />
                                                    Total Price
                                                </p>
                                                <div className="flex items-baseline gap-1 mt-0.5">
                                                    <span className="text-3xl font-black text-blue-700">
                                                        ${classData.price}
                                                    </span>
                                                    <span className="text-sm text-blue-400 font-medium">USD</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-200/50">
                                                <Shield className="w-3.5 h-3.5 text-blue-500" />
                                                <span className="text-[10px] font-bold text-blue-700">Secure</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <motion.div 
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <form action="/api/checkout_sessions" method="POST">
                                            <input type="hidden" name="class_id" value={classData._id} />
                                            <input type="hidden" name="class_name" value={classData.name || classData.className} />
                                            <input type="hidden" name="trainer_name" value={classData.trainerName} />
                                            <input type="hidden" name="price" value={classData.price} />
                                            <input type="hidden" name="image" value={classData.image || ''} />

                                            <Button 
                                                type="submit" 
                                                role="link"
                                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold h-14 rounded-2xl text-sm shadow-lg shadow-blue-200/60 transition-all duration-300 group"
                                            >
                                                <span className="flex items-center justify-center gap-3">
                                                    <CreditCard className="w-5 h-5" />
                                                    <span>Proceed to Checkout</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </Button>
                                        </form>
                                    </motion.div>

                                    {/* Secure Payment Notice */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="flex items-center justify-center gap-2 text-xs text-blue-400"
                                    >
                                        <Lock className="w-3 h-3" />
                                        <span>Your payment is secure and encrypted</span>
                                        <CheckCircle className="w-3 h-3 text-blue-500" />
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Footer Note */}
                <motion.p 
                    variants={itemVariants}
                    className="text-center text-xs text-blue-300 mt-6 font-medium"
                >
                    You will be redirected to Stripe secure payment gateway
                </motion.p>
            </motion.div>
        </div>
    );
};

export default ImplementCheckoutPage;