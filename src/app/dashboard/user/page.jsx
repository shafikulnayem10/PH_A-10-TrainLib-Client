import React from 'react';
import { getUserOverview } from '@/lib/api/dashboard/user/user';

export default async function UserOverviewPage() {
    let overviewData = null;
    let errorMsg = null;

    try {
        overviewData = await getUserOverview();
    } catch (err) {
        errorMsg = err.message || "Failed to load dashboard data.";
    }

    if (errorMsg) {
        return (
            <div className="p-6 max-w-lg mx-auto my-12 card bg-blue-50 border border-blue-200 text-blue-800 shadow-md">
                <div className="card-body items-center text-center">
                    <h3 className="font-bold text-xl mt-2">Dashboard Error</h3>
                    <p className="text-sm opacity-90">{errorMsg}</p>
                </div>
            </div>
        );
    }

    const { stats, profile, trainerApplication } = overviewData || {};

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto text-slate-800 antialiased">
            
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8 shadow-xl shadow-blue-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative z-10 text-white">
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Welcome Back, <span className="underline decoration-sky-300 decoration-wavy underline-offset-4">{profile?.name || 'Member'}</span>!
                    </h1>
                    <p className="text-sm text-blue-100/90 mt-2 font-medium">
                        Here's an overview of your fitness journey and profile application status.
                    </p>
                </div>
                <div className="relative z-10 text-xs font-bold px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full uppercase tracking-wider border border-white/20 shadow-sm">
                    Role: {profile?.role}
                </div>
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl overflow-hidden relative border border-blue-500/10">
                    <div className="card-body flex-row items-center justify-between p-6 z-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-100/80">Total Booked Classes</p>
                            <h2 className="text-5xl font-black mt-2 tracking-tight">
                                {stats?.totalBooked ?? 0}
                            </h2>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </div>

                <div className="card bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl overflow-hidden relative border border-sky-400/10">
                    <div className="card-body flex-row items-center justify-between p-6 z-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-sky-100/80">Total Favorites</p>
                            <h2 className="text-5xl font-black mt-2 tracking-tight">
                                {stats?.totalFavorites ?? 0}
                            </h2>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="card bg-white shadow-xl shadow-slate-100/40 border border-slate-100 lg:col-span-2 rounded-3xl">
                    <div className="card-body p-6 md:p-8">
                        <h3 className="text-lg font-black border-b border-slate-100 pb-4 mb-6 text-slate-900 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                            Profile Details
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="avatar">
                                <div className="w-24 rounded-2xl ring-4 ring-blue-500/10 ring-offset-2">
                                    <img 
                                        src={profile?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                                        alt={profile?.name || "User Avatar"} 
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 text-center sm:text-left flex-1">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h4 className="text-2xl font-black tracking-tight text-slate-900">{profile?.name}</h4>
                                    <div className="badge bg-blue-600 border-none text-white font-bold text-[10px] tracking-wider px-2.5 py-2 rounded-md uppercase">
                                        {profile?.role}
                                    </div>
                                </div>
                                <p className="text-slate-600 font-semibold text-sm">{profile?.email}</p>
                                <div className="text-xs text-slate-400 font-medium pt-2 flex items-center justify-center sm:justify-start gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
                                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                                    </svg>
                                    Account secured via server-side credentials
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-white shadow-xl shadow-slate-100/40 border border-slate-100 rounded-3xl overflow-hidden">
                    <div className="card-body p-6 md:p-8 justify-between h-full">
                        <div>
                            <h3 className="text-lg font-black border-b border-slate-100 pb-4 mb-6 text-slate-900 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
                                Trainer Status
                            </h3>
                            <div className="space-y-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Application Status:
                                </p>
                                
                                {trainerApplication?.status === "Pending" && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold text-sm shadow-sm w-full justify-center">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                        Pending Review
                                    </div>
                                )}
                                {trainerApplication?.status === "Approved" && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold text-sm shadow-sm w-full justify-center">
                                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                        Approved / Trainer
                                    </div>
                                )}
                                {trainerApplication?.status === "Rejected" && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold text-sm shadow-sm w-full justify-center">
                                        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                                        Application Rejected
                                    </div>
                                )}
                                {trainerApplication?.status === "Not Applied" && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold text-sm shadow-sm w-full justify-center">
                                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                        Not Applied Yet
                                    </div>
                                )}
                            </div>
                        </div>

                        {trainerApplication?.status === "Rejected" && trainerApplication?.feedback && (
                            <div className="mt-6 p-4 bg-rose-50/70 border border-rose-100 rounded-2xl text-rose-800 text-xs space-y-1.5">
                                <p className="font-extrabold uppercase tracking-widest text-[10px] text-rose-700">Admin Feedback:</p>
                                <p className="font-medium leading-relaxed">
                                    {trainerApplication.feedback}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}