'use client';

import React, { useState, useEffect } from 'react';
import { fetchTrainerStatusAction, applyAsTrainerAction } from '@/lib/actions/trainer';
import { useSession } from '@/lib/hooks/useSession';
import toast from 'react-hot-toast';
import { User, Award, FileText, Briefcase, Clock, Send } from 'lucide-react';

export default function ApplyAsTrainerPage() {
    const { data: session, loading: sessionLoading } = useSession();
    const [statusData, setStatusData] = useState({ status: 'Loading', feedback: null });
    const [experience, setExperience] = useState('');
    const [specialty, setSpecialty] = useState('Yoga');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const isBlocked = session?.user?.softBanned === true;

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        const res = await fetchTrainerStatusAction();
        if (res && res.success) {
            setStatusData({ status: res.status, feedback: res.feedback });
        } else {
            setStatusData({ status: 'Not Applied', feedback: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isBlocked) {
            toast.error('Action restricted by Admin. Your account has been blocked.', {
                duration: 5000,
                style: {
                    background: '#fee2e2',
                    color: '#991b1b',
                    border: '1px solid #fecaca',
                },
            });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        if (!experience || experience < 0) {
            setMessage({ text: 'Please enter a valid experience year.', type: 'error' });
            setLoading(false);
            return;
        }

        const data = await applyAsTrainerAction({ experience, specialty, bio });
        if (data && data.success) {
            setMessage({ text: data.message, type: 'success' });
            fetchStatus();
        } else {
            setMessage({ text: data?.message || 'Something went wrong.', type: 'error' });
        }
        setLoading(false);
    };

    if (sessionLoading || statusData.status === 'Loading') {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isBlocked) {
        return (
            <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 text-slate-800 antialiased">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-rose-800 p-6 md:p-10 shadow-xl shadow-red-100/50">
                    <div className="relative z-10 max-w-xl text-white">
                        <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                            Account Restricted
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                            Access Denied
                        </h1>
                        <p className="text-sm md:text-base text-red-100/90 mt-3 font-medium leading-relaxed">
                            Your account has been restricted by an administrator. You cannot apply to be a trainer.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-rose-400/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-500/30 rounded-full blur-2xl pointer-events-none"></div>
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-4xl">X</span>
                        </div>
                        <h2 className="text-2xl font-bold text-red-800">Account Restricted</h2>
                        <p className="text-red-600 max-w-md">
                            Your account has been restricted by an administrator. You cannot apply to be a trainer.
                            If you believe this is an error, please contact support.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 md:p-10 shadow-xl shadow-blue-200/50">
                <div className="relative z-10 max-w-2xl text-white">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-4">
                        <Award className="w-4 h-4 text-white" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">Join Our Elite Team</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                        Apply as <span className="underline decoration-sky-300 decoration-wavy underline-offset-4">Trainer</span>
                    </h1>
                    <p className="text-sm md:text-base text-blue-100/90 mt-3 font-medium leading-relaxed max-w-lg">
                        Share your expertise with the community and step up as a premium fitness coach. Turn your passion into a professional impact.
                    </p>
                </div>
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`rounded-2xl border p-4 text-sm font-bold shadow-sm transition-all duration-300 flex items-center gap-3 ${
                    message.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                    <span>{message.text}</span>
                </div>
            )}

            {/* Status Cards */}
            {statusData.status === 'Pending' && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-8 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-extrabold text-amber-900">Application Status: Pending</h3>
                        <p className="text-sm text-amber-700 max-w-md mx-auto leading-relaxed font-medium">
                            Your profile is currently under review by our administration team. We will verify your credentials and update your account dashboard shortly.
                        </p>
                    </div>
                </div>
            )}

            {statusData.status === 'Approved' && (
                <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-8 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-extrabold text-blue-900">Application Approved!</h3>
                        <p className="text-sm text-blue-700 max-w-md mx-auto leading-relaxed font-medium">
                            Congratulations! You are officially a registered Trainer at TrainLib. Access your exclusive trainer portal features directly via the navigation sidebar.
                        </p>
                    </div>
                </div>
            )}

            {/* Application Form */}
            {(statusData.status === 'Not Applied' || statusData.status === 'Rejected') && (
                <div className="bg-white border border-blue-100 rounded-3xl shadow-xl shadow-blue-100/40 p-6 md:p-8 space-y-6">
                    {statusData.status === 'Rejected' && (
                        <div className="bg-rose-50 border-rose-200 rounded-2xl p-4 flex flex-col items-start gap-1">
                            <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-rose-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                                Previous Application Rejected
                            </div>
                            <p className="text-xs text-rose-700 font-medium pl-7 leading-relaxed">
                                <span className="font-bold">Admin Feedback:</span> {statusData.feedback || "Your application profile didn't match our specific criteria. Please refine your information and feel free to re-apply."}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Experience */}
                            <div className="w-full">
                                <label className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-1.5">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    Experience (in Years)
                                </label>
                                <input 
                                    type="number" 
                                    min="0"
                                    required
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    placeholder="e.g., 5" 
                                    className="w-full h-12 rounded-xl border border-blue-200 bg-white px-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    disabled={isBlocked}
                                />
                            </div>

                            {/* Specialty */}
                            <div className="w-full">
                                <label className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-1.5">
                                    <Briefcase className="w-4 h-4 text-blue-500" />
                                    Specialty
                                </label>
                                <select 
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    className="w-full h-12 rounded-xl border border-blue-200 bg-white px-4 text-sm font-semibold text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all appearance-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 16px center',
                                        backgroundSize: '16px'
                                    }}
                                    disabled={isBlocked}
                                >
                                    <option value="Yoga">Yoga</option>
                                    <option value="Weights">Weights & Strength</option>
                                    <option value="Cardio">Cardio & HIIT</option>
                                    <option value="Zumba">Zumba & Dance</option>
                                    <option value="Crossfit">Crossfit Training</option>
                                </select>
                            </div>
                        </div>

                        {/* Biography */}
                        <div className="w-full">
                            <label className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-1.5">
                                <FileText className="w-4 h-4 text-blue-500" />
                                Brief Biography / Description
                            </label>
                            <textarea 
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={5}
                                placeholder="Tell us comprehensively about your fitness certifications, professional coaching style, background, or accomplishments..." 
                                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                                disabled={isBlocked}
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading || isBlocked}
                            className={`w-full font-extrabold text-sm tracking-wider uppercase rounded-xl transition-all duration-200 active:scale-[0.995] h-12 flex items-center justify-center gap-2 ${
                                isBlocked 
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50'
                            }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : isBlocked ? (
                                'Account Restricted'
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Trainer Application
                                </>
                            )}
                        </button>

                        {isBlocked && (
                            <p className="text-center text-sm text-red-500 font-medium">
                                Action restricted by Admin. Your account has been blocked.
                            </p>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}