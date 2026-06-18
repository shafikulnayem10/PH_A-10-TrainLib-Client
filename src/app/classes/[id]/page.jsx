import React from "react";
import { redirect } from "next/navigation";
import { Clock, ArrowLeft, Award, Calendar } from "lucide-react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { getUserSession } from "@/lib/core/session";
import { getClassDetails, checkClassBookingStatus, checkClassFavoriteStatus } from "@/lib/api/classes";
import ActionButtons from "./ActionButtons";

export default async function ClassDetailsPage({ params }) {
  const resolvedParams = await params;
  const classId = resolvedParams?.id;

  const user = await getUserSession();
  
 
  if (!user) {
    redirect(`/login?redirect=/classes/${classId}`);
  }

  let classData = null;
  let isBooked = false;
  let isFavorite = false;

  try {
    classData = await getClassDetails(classId);
    
    if (user?.email) {
      const bookingRes = await checkClassBookingStatus(classId, user.email);
      isBooked = bookingRes?.isBooked || false;

      const favoriteRes = await checkClassFavoriteStatus(classId, user.email);
      isFavorite = favoriteRes?.isFavorite || false;
    }
  } catch (error) {
    console.error("Error loading class details on server:", error);
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950 gap-4">
        <p className="text-slate-500 text-sm">Class details could not be found or loaded.</p>
        <Link href="/classes">
          <Button size="sm" className="bg-blue-600 text-white font-bold rounded-xl">
            Back to All Classes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link href="/classes" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Classes
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Class Info Display */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
              {classData.image && (
                <div className="relative w-full h-80 sm:h-96 bg-slate-100 overflow-hidden">
                  <img
                    src={classData.image}
                    alt={classData.name || classData.className}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-6 left-6 text-[10px] font-extrabold tracking-wider text-blue-600 uppercase bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded-lg shadow-sm">
                    {classData.category}
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {classData.name || classData.className}
                </h1>

                <div className="flex flex-wrap gap-6 my-6 pb-6 border-b border-slate-100 dark:border-slate-800/60 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Trainer: <span className="text-slate-900 dark:text-white font-black">{classData.trainerName}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Duration: <span className="text-slate-900 dark:text-white font-black">{classData.duration || "60 mins"}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Level: <span className="text-slate-900 dark:text-white font-black capitalize">{classData.difficulty || "All Levels"}</span></span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    Course Description & Schedule
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {classData.description || "No schedule details or additional description available for this program at this time."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Widget Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm sticky top-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Standard Tuition Fee</span>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-6">
                ${classData.price}
              </div>

              <ActionButtons 
                classId={classId}
                initialIsBooked={isBooked}
                initialIsFavorite={isFavorite}
                userEmail={user.email}
                classData={classData}
              />

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Current Enrollment:</span>
                  <span className="text-slate-900 dark:text-white font-black">{classData.bookingCount || 0} Bookings</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Status:</span>
                  <span className="text-emerald-600 font-black uppercase text-[10px] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    {classData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}