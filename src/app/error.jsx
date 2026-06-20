'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function RootError({ error, reset }) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    const isRedirect = 
        error?.message?.includes('NEXT_REDIRECT') || 
        error?.digest?.includes('NEXT_REDIRECT');

    if (isRedirect) {
        return null;
    }

    return (
        <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center p-6 select-none relative overflow-hidden">
           
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-rose-300/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative flex flex-col items-center text-center max-w-md">
                {/* Error Icon */}
                <div className="relative mb-8">
                    <div className="w-40 h-40 bg-gradient-to-br from-rose-50 to-rose-100 rounded-3xl flex items-center justify-center border border-rose-200 shadow-lg shadow-rose-100/50">
                        <AlertTriangle className="w-20 h-20 text-rose-500" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-rose-200/30 rounded-full blur-xl" />
                    <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-rose-300/20 rounded-full blur-xl" />
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-black text-rose-950 tracking-tight mb-2">
                    Something Went Wrong
                </h1>
                <p className="text-rose-500 text-base font-medium mb-2">
                    {error?.message || 'An unexpected error occurred.'}
                </p>
                <p className="text-rose-400 text-sm mb-8">
                    Please try again or contact support if the issue persists.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        onClick={reset}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link 
                        href="/"
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-3 px-6 rounded-xl transition-all border border-blue-200 flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>

                {/* Additional help */}
                <div className="mt-8 pt-6 border-t border-rose-100 w-full">
                    <p className="text-xs text-rose-400 font-medium">
                        Error code: {error?.digest || 'Unknown'}
                    </p>
                </div>
            </div>
        </div>
    );
}