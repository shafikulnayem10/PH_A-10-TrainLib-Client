import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center p-6 select-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <section className="relative max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center overflow-hidden">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="currentColor" 
                        className="w-8 h-8 text-blue-500"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
                    </svg>
                </div>

                <h1 className="text-6xl font-black text-blue-500 tracking-tighter mb-2">
                    404
                </h1>
                
                <h2 className="text-xl font-bold text-zinc-50 tracking-tight mb-2">
                    Page Not Found
                </h2>
              
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    The page you are looking for doesn't exist or has been moved to a different URL. Please check the spelling or return home.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full text-center text-xs font-semibold px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-950/30 transition duration-200"
                    >
                        Return to Homepage
                    </Link>
                </div>
            </section>
        </div>
    );
}