'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Home, ArrowLeft, Lock, AlertTriangle } from 'lucide-react';

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 flex flex-col justify-center items-center p-6 select-none relative overflow-hidden">
            {/* Blue Glow Effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-300/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-indigo-300/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Main Content */}
            <div className="relative flex flex-col items-center text-center max-w-md">
                {/* Unauthorized Illustration */}
                <div className="relative mb-8">
                    <div className="w-40 h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center border border-blue-200 shadow-lg shadow-blue-100/50">
                        <div className="relative">
                            <Shield className="w-20 h-20 text-blue-500 stroke-[1.5]" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-amber-300/50">
                                !
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-blue-200/30 rounded-full blur-xl" />
                    <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-blue-300/20 rounded-full blur-xl" />
                </div>

                {/* Error Message */}
                <div className="inline-flex items-center gap-2 bg-amber-50/80 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3 border border-amber-200/50">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Access Denied</span>
                </div>

                <h1 className="text-3xl font-black text-blue-950 tracking-tight mb-2">
                    Unauthorized Access
                </h1>
                <p className="text-blue-500 text-base font-medium mb-2">
                    You don't have permission to view this page.
                </p>
                <p className="text-blue-400 text-sm mb-8 max-w-sm">
                    This area is restricted to authorized users only. Please contact support if you believe you should have access.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Link 
                        href="/"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => router.back()}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-3 px-6 rounded-2xl transition-all border border-blue-200 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

                {/* Help Section */}
                <div className="mt-8 pt-6 border-t border-blue-100 w-full">
                    <p className="text-xs text-blue-400 font-medium mb-3">
                        Need help accessing this page?
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs">
                        <Link 
                            href="/contact"
                            className="text-blue-600 hover:text-blue-700 font-semibold transition"
                        >
                            Contact Support
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-blue-300"></span>
                        <Link 
                            href="/login"
                            className="text-blue-600 hover:text-blue-700 font-semibold transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Error Code */}
                <div className="mt-6 flex items-center gap-2 text-[10px] text-blue-300 font-mono">
                    <span className="w-1 h-1 rounded-full bg-blue-300"></span>
                    Error Code: 403
                    <span className="w-1 h-1 rounded-full bg-blue-300"></span>
                </div>
            </div>
        </div>
    );
}