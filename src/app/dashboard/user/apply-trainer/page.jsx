'use client';

import React, { useState, useEffect } from 'react';
import { fetchTrainerStatusAction, applyAsTrainerAction } from '@/lib/actions/trainer';

export default function ApplyAsTrainerPage() {
    const [statusData, setStatusData] = useState({ status: 'Loading', feedback: null });
    const [experience, setExperience] = useState('');
    const [specialty, setSpecialty] = useState('Yoga');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

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

    if (statusData.status === 'Loading') {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 text-slate-800 antialiased">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-10 shadow-xl shadow-blue-100/50">
                <div className="relative z-10 max-w-xl text-white">
                    <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                        Join Our Elite Team
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                        Apply as <span className="underline decoration-sky-300 decoration-wavy underline-offset-4">Trainer</span>
                    </h1>
                    <p className="text-sm md:text-base text-blue-100/90 mt-3 font-medium leading-relaxed">
                        Share your expertise with the community and step up as a premium fitness coach. Turn your passion into a professional impact.
                    </p>
                </div>
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'} rounded-2xl border p-4 text-sm font-bold shadow-sm transition-all duration-300 flex items-center gap-3`}>
                    {message.type === 'success' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            {statusData.status === 'Pending' && (
                <div className="card bg-amber-50/60 border border-amber-200 rounded-3xl p-6 md:p-8 text-center space-y-4 shadow-sm max-w-xl mx-auto">
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
                <div className="card bg-blue-50/60 border border-blue-200 rounded-3xl p-6 md:p-8 text-center space-y-4 shadow-sm max-w-xl mx-auto">
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

            {(statusData.status === 'Not Applied' || statusData.status === 'Rejected') && (
                <div className="card bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 p-6 md:p-8 space-y-6">
                    {statusData.status === 'Rejected' && (
                        <div className="alert bg-rose-50 border-rose-200 rounded-2xl p-4 flex flex-col items-start gap-1 text-left">
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
                            <div className="form-control w-full">
                                <label className="label font-bold text-slate-700 text-sm tracking-wide">Experience (in Years)</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    required
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    placeholder="e.g., 5" 
                                    className="input input-bordered w-full h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm transition-all font-medium"
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label font-bold text-slate-700 text-sm tracking-wide">Specialty</label>
                                <select 
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    className="select select-bordered w-full h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm font-semibold transition-all"
                                >
                                    <option value="Yoga">Yoga</option>
                                    <option value="Weights">Weights & Strength</option>
                                    <option value="Cardio">Cardio & HIIT</option>
                                    <option value="Zumba">Zumba & Dance</option>
                                    <option value="Crossfit">Crossfit Training</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-control w-full">
                            <label className="label font-bold text-slate-700 text-sm tracking-wide">Brief Biography / Description</label>
                            <textarea 
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={5}
                                placeholder="Tell us comprehensively about your fitness certifications, professional coaching style, background, or accomplishments..." 
                                className="textarea textarea-bordered w-full rounded-xl bg-slate-50/50 border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm transition-all leading-relaxed font-medium"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm tracking-wider uppercase shadow-md shadow-blue-200 rounded-xl transition-all duration-200 active:scale-[0.995] h-12 flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <span>Submit Trainer Application</span>
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}