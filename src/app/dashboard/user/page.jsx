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
        <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto text-slate-800">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-blue-100 pb-5">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Welcome Back, <span className="text-blue-600">{profile?.name || 'Member'}</span>!
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Here's an overview of your fitness journey and profile application status.
                    </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    Role: <span className="uppercase font-bold">{profile?.role}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="card bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl overflow-hidden relative">
                    <div className="card-body flex-row items-center justify-between p-6 z-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-100">Total Booked Classes</p>
                            <h2 className="text-5xl font-black mt-2 tracking-tight">
                                {stats?.totalBooked ?? 0}
                            </h2>
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </div>

                <div className="card bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl overflow-hidden relative">
                    <div className="card-body flex-row items-center justify-between p-6 z-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-sky-100">Total Favorites</p>
                            <h2 className="text-5xl font-black mt-2 tracking-tight">
                                {stats?.totalFavorites ?? 0}
                            </h2>
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="card bg-white shadow-md border border-slate-100 lg:col-span-2">
                    <div className="card-body p-6">
                        <h3 className="text-lg font-bold border-b border-slate-100 pb-3 mb-5 text-slate-900">
                            Profile Details
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar Fixed Structure */}
                            <div className="avatar">
                                <div className="w-24 rounded-full ring ring-blue-600 ring-offset-base-100 ring-offset-2">
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
                                    <div className="badge bg-blue-600 border-none text-white badge-sm uppercase font-bold text-[10px] tracking-wider px-2 py-2">
                                        {profile?.role}
                                    </div>
                                </div>
                                <p className="text-slate-600 font-medium">{profile?.email}</p>
                                <div className="text-xs text-slate-400 italic pt-1">
                                    Account secured via server-side credentials
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-white shadow-md border border-slate-100 justify-between">
                    <div className="card-body p-6 justify-between h-full">
                        <div>
                            <h3 className="text-lg font-bold border-b border-slate-100 pb-3 mb-5 text-slate-900">
                                Trainer Status
                            </h3>
                            <div className="space-y-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Application Status:
                                </p>
                                
                                {trainerApplication?.status === "Pending" && (
                                    <div className="badge badge-warning gap-2 px-4 py-4 font-bold text-white shadow-sm w-full sm:w-auto">
                                        Pending Review
                                    </div>
                                )}
                                {trainerApplication?.status === "Approved" && (
                                    <div className="badge bg-blue-600 border-none gap-2 px-4 py-4 font-bold text-white shadow-sm w-full sm:w-auto">
                                        Approved / Trainer
                                    </div>
                                )}
                                {trainerApplication?.status === "Rejected" && (
                                    <div className="badge badge-error gap-2 px-4 py-4 font-bold text-white shadow-sm w-full sm:w-auto">
                                        Application Rejected
                                    </div>
                                )}
                                {trainerApplication?.status === "Not Applied" && (
                                    <div className="badge bg-slate-100 text-slate-600 border border-slate-200 gap-2 px-4 py-4 font-bold w-full sm:w-auto">
                                        Not Applied Yet
                                    </div>
                                )}
                            </div>
                        </div>

                        {trainerApplication?.status === "Rejected" && trainerApplication?.feedback && (
                            <div className="mt-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-xs space-y-1">
                                <p className="font-bold uppercase tracking-wider text-[10px]">Admin Feedback:</p>
                                <p className="italic font-medium text-slate-700">
                                    ` ${trainerApplication.feedback}`
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}