'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center p-6 select-none relative overflow-hidden">
            {/* Blue glow effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-300/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative flex flex-col items-center text-center max-w-md">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                    <div className="w-40 h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center border border-blue-200 shadow-lg shadow-blue-100/50">
                        <div className="relative">
                            <span className="text-7xl font-black text-blue-600 tracking-tighter">
                                404
                            </span>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-300/50">
                                ?
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-blue-200/30 rounded-full blur-xl" />
                    <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-blue-300/20 rounded-full blur-xl" />
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-black text-blue-950 tracking-tight mb-2">
                    Page Not Found
                </h1>
                <p className="text-blue-500 text-base font-medium mb-2">
                    Oops! The page you're looking for doesn't exist.
                </p>
                <p className="text-blue-400 text-sm mb-8">
                    It might have been moved, deleted, or the URL might be incorrect.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Link 
                        href="/"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => router.back()}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-3 px-6 rounded-xl transition-all border border-blue-200 flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

                {/* Search suggestion */}
                <div className="mt-8 pt-6 border-t border-blue-100 w-full">
                    <p className="text-xs text-blue-400 font-medium mb-3">
                        Need help finding something?
                    </p>
                    <Link 
                        href="/classes"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
                    >
                        <Search className="w-4 h-4" />
                        Browse available classes
                    </Link>
                </div>
            </div>
        </div>
    );
}