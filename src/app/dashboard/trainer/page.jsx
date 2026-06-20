import React from 'react';
import { getTrainerOverview } from '@/lib/api/dashboard/trainer/trainer';
import Link from 'next/link';

export default async function TrainerOverviewPage() {
    let overviewData = null;
    let errorMsg = null;

    try {
        overviewData = await getTrainerOverview();
    } catch (err) {
        errorMsg = err.message || "Failed to load trainer dashboard data.";
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

    const { stats, profile, recentBookings = [] } = overviewData || {};

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto text-slate-800 antialiased">
            
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8 shadow-xl shadow-blue-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative z-10 text-white">
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Welcome Back, Coach <span className="underline decoration-sky-300 decoration-wavy underline-offset-4">{profile?.name || 'Trainer'}</span>!
                    </h1>
                    <p className="text-sm text-blue-100/90 mt-2 font-medium">
                        Track your schedule, monitor student bookings, and manage your custom fitness sessions.
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
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-100/80">Active Classes</p>
                            <h2 className="text-5xl font-black mt-2 tracking-tight">
                                {stats?.totalClasses ?? 0}
                            </h2>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a48.47 48.47 0 0 1 15.482 0m-15.482 0L12 14.043l7.742-3.896L12 6.173z" />
                            </svg>
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </div>

                <div className="card bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl overflow-hidden relative border border-sky-400/10">
                    <div className="card-body flex-row items-center justify-between p-6 z-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-sky-100/80">Total Student Bookings</p>
                            <h2 className="text-5xl font-black mt-2 tracking-tight">
                                {stats?.totalBookings ?? 0}
                            </h2>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.998 5.998 0 0 0-4.793-5.856M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5-3a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6 14a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="card bg-white shadow-xl shadow-slate-100/40 border border-slate-100 lg:col-span-2 rounded-3xl">
                    <div className="card-body p-6 md:p-8">
                        <h3 className="text-lg font-black border-b border-blue-50 pb-4 mb-6 text-blue-950 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                            Recent Class Enrollments
                        </h3>
                        {recentBookings.length === 0 ? (
                            <div className="text-center py-12 bg-blue-50/20 border border-dashed border-blue-100 rounded-2xl">
                                <p className="text-sm text-blue-900/60 font-medium">No recent bookings found for your classes.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentBookings.map((booking) => (
                                    <div key={booking._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-blue-50/30 rounded-xl border border-blue-50 gap-4">
                                        <div>
                                            <h4 className="font-bold text-blue-950 text-base">{booking.className || "Fitness Class"}</h4>
                                            <p className="text-xs text-blue-700/70 font-semibold mt-0.5">Enrolled By: {booking.userName} ({booking.userEmail})</p>
                                        </div>
                                        <div className="text-right sm:text-right w-full sm:w-auto">
                                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50">
                                                {booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="card bg-white shadow-xl shadow-slate-100/40 border border-slate-100 rounded-3xl">
                    <div className="card-body p-6 md:p-8">
                        <h3 className="text-lg font-black border-b border-blue-50 pb-4 mb-6 text-blue-950 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                            Trainer Profile
                        </h3>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="avatar">
                                <div className="w-24 rounded-2xl ring-4 ring-blue-500/10 ring-offset-2">
                                    <img 
                                        src={profile?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"} 
                                        alt={profile?.name || "Trainer Avatar"} 
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xl font-black text-blue-950 tracking-tight">{profile?.name}</h4>
                                <p className="text-sm text-blue-900/60 font-semibold">{profile?.email}</p>
                            </div>
                           
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}