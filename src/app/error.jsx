'use client';

import React from 'react';
import Link from 'next/link';

export default function RootError({ error, reset }) {
    const isRedirect = 
        error?.message?.includes('NEXT_REDIRECT') || 
        error?.digest?.includes('NEXT_REDIRECT');

    if (isRedirect) {
        return null;
    }

    return (
        <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center p-6 select-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

            <section className="relative max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center overflow-hidden">
                <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="currentColor" 
                        className="w-8 h-8 text-red-500"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight mb-2">
                    Something Went Wrong!
                </h1>
              
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    {error?.message || "An unexpected error occurred. Please try reloading the page or go back to the homepage."}
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => reset()}
                        className="block w-full text-center text-xs font-semibold px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg shadow-red-950/30 transition duration-200"
                    >
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 py-1 transition"
                    >
                        Return to Homepage
                    </Link>
                </div>
            </section>
        </div>
    );
}