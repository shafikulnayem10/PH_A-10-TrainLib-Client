import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserBookedClasses } from '@/lib/api/dashboard/user/user';
import { getUserToken } from '@/lib/core/session';
import { Calendar, User, DollarSign, Eye, Clock, BookOpen, CalendarDays } from 'lucide-react';

export default async function BookedClassesPage() {
    let bookedClasses = [];
    let errorMessage = null;

    const token = await getUserToken();
    
    if (!token) {
        redirect('/login'); 
    }

    try {
        const response = await getUserBookedClasses();
        bookedClasses = response?.data || [];
    } catch (error) {
        errorMessage = error.message || "Something went wrong while loading classes.";
    }

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="border-b border-blue-100 pb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-blue-950">
                            Booked <span className="text-blue-600">Classes</span>
                        </h1>
                        <p className="text-sm text-blue-500 mt-1 font-medium">
                            Here is a clean overview of all the classes you have successfully registered and paid for.
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-500 text-sm font-bold">!</span>
                    </div>
                    <span className="text-sm font-medium">{errorMessage}</span>
                </div>
            )}

            {/* Empty State */}
            {bookedClasses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-blue-100 p-8 max-w-lg mx-auto shadow-sm shadow-blue-50">
                    <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-blue-50 rounded-full border border-blue-100">
                        <Calendar className="w-10 h-10 text-blue-400" />
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-blue-950 tracking-tight">No Classes Booked Yet</h3>
                    <p className="text-blue-500 text-sm mt-2.5 max-w-xs mx-auto leading-relaxed font-medium">
                        You haven't registered or completed payment for any premium fitness sessions yet.
                    </p>
                    
                    <Link 
                        href="/classes" 
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm mt-8 px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 hover:scale-[1.02]"
                    >
                        Explore Classes
                        <span className="text-lg">→</span>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 border border-blue-100 rounded-xl p-4">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Bookings</p>
                            <p className="text-2xl font-black text-blue-950 mt-1">{bookedClasses.length}</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 border border-blue-100 rounded-xl p-4">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Spent</p>
                            <p className="text-2xl font-black text-blue-950 mt-1">
                                ${bookedClasses.reduce((sum, b) => sum + (b.price || 0), 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 border border-blue-100 rounded-xl p-4">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Active Classes</p>
                            <p className="text-2xl font-black text-blue-950 mt-1">{bookedClasses.length}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100/30 border-b border-blue-100">
                                        <th className="py-4 pl-6 text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                Class Name
                                            </div>
                                        </th>
                                        <th className="py-4 text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5" />
                                                Trainer
                                            </div>
                                        </th>
                                        <th className="py-4 text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="w-3.5 h-3.5" />
                                                Schedule
                                            </div>
                                        </th>
                                        <th className="py-4 text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-3.5 h-3.5" />
                                                Price
                                            </div>
                                        </th>
                                        <th className="py-4 pr-6 text-center text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-2">
                                                <Eye className="w-3.5 h-3.5" />
                                                Action
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-blue-50">
                                    {bookedClasses.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                                            <td className="py-4 pl-6">
                                                <div>
                                                    <p className="font-bold text-blue-950">
                                                        {booking.className || "Standard Session"}
                                                    </p>
                                                    <p className="text-xs text-blue-400 font-medium flex items-center gap-1 mt-0.5">
                                                        <Clock className="w-3 h-3" />
                                                        Booked on {new Date(booking.bookedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 font-semibold text-blue-700">
                                                {booking.trainerName || "Expert Coach"}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
                                                    <span className="text-sm font-medium text-blue-700">
                                                        {booking.classSchedule || "Flexible Schedule"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                                    ${booking.price ? booking.price.toFixed(2) : "0.00"}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-6 text-center">
                                                <Link 
                                                    href={`/classes/${booking.classId}`}
                                                    className="inline-flex items-center gap-1.5 bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 font-bold text-xs px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-blue-200/50"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="flex items-center justify-center gap-2 text-xs text-blue-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                        Showing {bookedClasses.length} booked class{bookedClasses.length > 1 ? 'es' : ''}
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                    </div>
                </>
            )}
        </div>
    );
}