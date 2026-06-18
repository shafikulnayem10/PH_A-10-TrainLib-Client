import React from 'react';

export default function Loading() {
    return (
        <div className="w-full min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-6 select-none relative overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                </div>
                
                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-bold text-zinc-200 tracking-wider">
                        Loading
                    </span>
                    <span className="text-xs text-zinc-500">
                        Please wait a moment...
                    </span>
                </div>
            </div>
        </div>
    );
}