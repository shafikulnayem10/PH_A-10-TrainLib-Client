import React from 'react';

export default function Loading() {
    return (
        <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center p-6 select-none relative overflow-hidden">
            {/* Blue glow effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-400/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-blue-300/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative flex flex-col items-center gap-6">
                {/* Animated spinner with blue theme */}
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                    <div className="absolute inset-2 rounded-full border-4 border-t-blue-400/30 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-150" />
                </div>
                
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xl font-bold text-blue-950 tracking-wider">
                        Loading
                    </span>
                    <span className="text-sm text-blue-400 font-medium">
                        Please wait a moment...
                    </span>
                </div>

                {/* Animated dots */}
                <div className="flex gap-2 mt-2">
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
            </div>
        </div>
    );
}