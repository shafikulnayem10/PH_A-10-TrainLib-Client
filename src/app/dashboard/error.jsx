'use client';

import React from 'react';

export default function DashboardError({ error, reset }) {
    if (error?.message?.includes('NEXT_REDIRECT') || error?.digest?.includes('NEXT_REDIRECT')) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 max-w-sm shadow-sm">
                <h2 className="text-xl font-bold text-blue-900 mb-2">Dashboard Error</h2>
                <p className="text-sm text-slate-600 mb-6">
                    {error.message || "Something went wrong while loading the dashboard."}
                </p>
                <button
                    onClick={() => reset()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}