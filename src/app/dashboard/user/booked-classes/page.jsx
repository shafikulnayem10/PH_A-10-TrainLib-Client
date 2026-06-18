import React from 'react';
import Link from 'next/link';
import { getUserBookedClasses } from '@/lib/api/dashboard/user/user';
import { getUserToken } from '@/lib/core/session';

export default async function BookedClassesPage() {
    let bookedClasses = [];
    let errorMessage = null;

    try {
        const token = await getUserToken();
        
        if (!token) {
            errorMessage = "You are not authenticated. Please log in.";
        } else {
            const response = await getUserBookedClasses();
            bookedClasses = response?.data || [];
        }
    } catch (error) {
        errorMessage = error.message || "Something went wrong while loading classes.";
    }

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto text-slate-800">
            <div className="border-b border-blue-100 pb-5">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Booked <span className="text-blue-600">Classes</span>
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Here is a clean overview of all the classes you have successfully registered and paid for.
                </p>
            </div>

            {errorMessage && (
                <div className="alert alert-error bg-red-50 border border-red-200 text-red-700 shadow-sm rounded-xl">
                    <span>{errorMessage}</span>
                </div>
            )}

            {!errorMessage && bookedClasses.length === 0 ? (
                <div className="text-center py-16 bg-blue-50/20 rounded-3xl border border-slate-100 p-8 shadow-inner-sm max-w-lg mx-auto">
                    <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-blue-100/50 rounded-full text-blue-600">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-9 h-9"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                        </svg>
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600"></span>
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">No Classes Booked Yet</h3>
                    <p className="text-slate-500 text-sm mt-2.5 max-w-xs mx-auto leading-relaxed">
                        You haven't registered or completed payment for any premium fitness sessions yet.
                    </p>
                    
                    <Link 
                        href="/classes" 
                        className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm mt-8 px-8 py-3 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 group border-none"
                    >
                        Explore Classes
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={2.5} 
                            stroke="currentColor" 
                            className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-75 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl border border-slate-100 shadow-sm">
                    <table className="table table-zebra w-full text-left">
                        <thead className="bg-blue-50/50 text-slate-600 text-xs uppercase tracking-wider font-bold border-b border-blue-100">
                            <tr>
                                <th className="py-4 pl-6">Class Name</th>
                                <th className="py-4">Trainer Name</th>
                                <th className="py-4">Price Paid</th>
                                <th className="py-4 pr-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                            {bookedClasses.map((booking) => (
                                <tr key={booking._id} className="hover:bg-blue-50/20 transition-colors duration-150">
                                    <td className="py-4 pl-6 font-bold text-slate-900 text-base">
                                        {booking.className || "Standard Session"}
                                    </td>
                                    <td className="py-4 font-semibold text-slate-700">
                                        {booking.trainerName || "Expert Coach"}
                                    </td>
                                    <td className="py-4 font-bold text-blue-600">
                                        ${booking.price ? booking.price.toFixed(2) : "0.00"}
                                    </td>
                                    <td className="py-4 pr-6 text-center">
                                        <Link 
                                            href={`/classes/${booking.classId}`}
                                            className="btn btn-xs sm:btn-sm bg-white hover:bg-blue-600 text-blue-600 hover:text-white border-blue-200 hover:border-blue-600 font-bold px-4 tracking-wide transition-all rounded-lg"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}