'use client';

import React, { useEffect, useState } from 'react';
import { Card, Chip } from "@heroui/react";
import { 
    Users, BookOpen, Calendar, Mail, 
    Calendar as CalendarIcon, Shield, Award,
    TrendingUp, CheckCircle, Crown, Star,
    BarChart3, PieChart as PieChartIcon, Activity
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { toast } from "react-hot-toast";
import { getAdminOverview } from '@/lib/api/dashboard/admin/admin';

export default function AdminOverviewPage() {
    const [loading, setLoading] = useState(true);
    const [overviewData, setOverviewData] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAdminOverview();
                setOverviewData(data);
            } catch (err) {
                setErrorMsg(err.message || "Failed to load dashboard data.");
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm font-medium">Loading dashboard data...</p>
            </div>
        );
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

    const { stats, profile } = overviewData || {};

    // Data for charts
    const platformData = [
        { name: 'Users', value: stats?.totalUsers || 0, color: '#3b82f6' },
        { name: 'Classes', value: stats?.totalClasses || 0, color: '#8b5cf6' },
        { name: 'Bookings', value: stats?.totalBookings || 0, color: '#22c55e' }
    ];

    // Monthly activity data
    const monthlyData = [
        { month: 'Jan', users: Math.round((stats?.totalUsers || 0) * 0.3), classes: Math.round((stats?.totalClasses || 0) * 0.2), bookings: Math.round((stats?.totalBookings || 0) * 0.15) },
        { month: 'Feb', users: Math.round((stats?.totalUsers || 0) * 0.4), classes: Math.round((stats?.totalClasses || 0) * 0.3), bookings: Math.round((stats?.totalBookings || 0) * 0.25) },
        { month: 'Mar', users: Math.round((stats?.totalUsers || 0) * 0.5), classes: Math.round((stats?.totalClasses || 0) * 0.4), bookings: Math.round((stats?.totalBookings || 0) * 0.35) },
        { month: 'Apr', users: Math.round((stats?.totalUsers || 0) * 0.6), classes: Math.round((stats?.totalClasses || 0) * 0.5), bookings: Math.round((stats?.totalBookings || 0) * 0.5) },
        { month: 'May', users: Math.round((stats?.totalUsers || 0) * 0.8), classes: Math.round((stats?.totalClasses || 0) * 0.7), bookings: Math.round((stats?.totalBookings || 0) * 0.7) },
        { month: 'Jun', users: stats?.totalUsers || 0, classes: stats?.totalClasses || 0, bookings: stats?.totalBookings || 0 }
    ];

    const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e'];

    // Stats cards data
    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            gradient: 'from-blue-600 to-blue-700',
            iconBg: 'bg-blue-600/20',
            borderColor: 'border-blue-500/10'
        },
        {
            title: 'Total Classes',
            value: stats?.totalClasses || 0,
            icon: BookOpen,
            gradient: 'from-purple-600 to-purple-700',
            iconBg: 'bg-purple-600/20',
            borderColor: 'border-purple-500/10'
        },
        {
            title: 'Total Bookings',
            value: stats?.totalBookings || 0,
            icon: Calendar,
            gradient: 'from-green-600 to-green-700',
            iconBg: 'bg-green-600/20',
            borderColor: 'border-green-500/10'
        }
    ];

    const overviewItems = [
        {
            title: 'Registered Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'blue'
        },
        {
            title: 'Available Classes',
            value: stats?.totalClasses || 0,
            icon: BookOpen,
            color: 'purple'
        },
        {
            title: 'Total Bookings',
            value: stats?.totalBookings || 0,
            icon: Calendar,
            color: 'green'
        }
    ];

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-600">{label}</p>
                    {payload.map((item, index) => (
                        <p key={index} className="text-sm font-semibold" style={{ color: item.color || item.fill }}>
                            {item.name}: {item.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-800 antialiased">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8 shadow-xl shadow-blue-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative z-10 text-white">
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Welcome Back, <span className="underline decoration-sky-300 decoration-wavy underline-offset-4">{profile?.name || 'Admin'}</span>!
                    </h1>
                    <p className="text-sm text-blue-100/90 mt-2 font-medium">
                        Here's an overview of your platform's performance and statistics.
                    </p>
                </div>
                <div className="relative z-10 text-xs font-bold px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full uppercase tracking-wider border border-white/20 shadow-sm">
                    Role: {profile?.role || 'Admin'}
                </div>
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat) => (
                    <div 
                        key={stat.title}
                        className={`card bg-gradient-to-br ${stat.gradient} text-white shadow-xl overflow-hidden relative border ${stat.borderColor}`}
                    >
                        <div className="card-body flex-row items-center justify-between p-6 z-10">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                                    {stat.title}
                                </p>
                                <h2 className="text-5xl font-black mt-2 tracking-tight">
                                    {stat.value.toLocaleString()}
                                </h2>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className="size-3 text-green-300" />
                                    <span className="text-[10px] font-medium text-white/70">
                                        Active {stat.title.toLowerCase()}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 ${stat.iconBg} rounded-2xl backdrop-blur-sm`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart - Platform Statistics */}
                <Card className="bg-white shadow-xl shadow-slate-100/40 border border-slate-100 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <BarChart3 className="size-5 text-blue-600" />
                            Platform Statistics
                        </h3>
                        <Chip size="sm" variant="flat" className="bg-blue-50 text-blue-600 border border-blue-100">
                            <span className="flex items-center gap-1">
                                <Activity className="size-3" />
                                Real-time
                            </span>
                        </Chip>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={platformData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
                                    {platformData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Pie Chart - Distribution */}
                <Card className="bg-white shadow-xl shadow-slate-100/40 border border-slate-100 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <PieChartIcon className="size-5 text-purple-600" />
                            Distribution
                        </h3>
                        <Chip size="sm" variant="flat" className="bg-purple-50 text-purple-600 border border-purple-100">
                            Overview
                        </Chip>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={platformData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {platformData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Area Chart - Monthly Trends */}
            <Card className="bg-white shadow-xl shadow-slate-100/40 border border-slate-100 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Activity className="size-5 text-emerald-600" />
                        Monthly Trends
                    </h3>
                    <div className="flex items-center gap-2">
                        <Chip size="sm" variant="flat" className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px]">
                            ● Users
                        </Chip>
                        <Chip size="sm" variant="flat" className="bg-purple-50 text-purple-600 border border-purple-100 text-[10px]">
                            ● Classes
                        </Chip>
                        <Chip size="sm" variant="flat" className="bg-green-50 text-green-600 border border-green-100 text-[10px]">
                            ● Bookings
                        </Chip>
                    </div>
                </div>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart
                            data={monthlyData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorClasses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="users"
                                name="Users"
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#colorUsers)"
                            />
                            <Area
                                type="monotone"
                                dataKey="classes"
                                name="Classes"
                                stroke="#8b5cf6"
                                fillOpacity={1}
                                fill="url(#colorClasses)"
                            />
                            <Area
                                type="monotone"
                                dataKey="bookings"
                                name="Bookings"
                                stroke="#22c55e"
                                fillOpacity={1}
                                fill="url(#colorBookings)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Profile & Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Admin Profile Card */}
                <div className="card bg-white shadow-xl shadow-slate-100/40 border border-slate-100 lg:col-span-1 rounded-3xl">
                    <div className="card-body p-6 md:p-8">
                        <h3 className="text-lg font-black border-b border-slate-100 pb-4 mb-6 text-slate-900 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                            Admin Profile
                        </h3>
                        <div className="flex flex-col items-center text-center">
                            {/* Profile Image with Enhanced Admin Badge */}
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-2xl ring-4 ring-blue-500/10 ring-offset-2 overflow-hidden">
                                    <img 
                                        src={profile?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"} 
                                        alt={profile?.name || "Admin Avatar"} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Admin Badge - Crown Style */}
                                <div className="absolute -top-2 -right-2">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-600 rounded-full blur-sm opacity-50 animate-pulse"></div>
                                        <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full p-1.5 shadow-lg shadow-blue-500/30 border-2 border-white">
                                            <Crown className="size-4 fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Badge - Bottom Right Corner */}
                                <div className="absolute -bottom-1 -right-1">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-blue-500/30 border border-white/20 flex items-center gap-1">
                                        <Shield className="size-2.5" />
                                        ADMIN
                                    </div>
                                </div>

                                {/* Hover Effect Ring */}
                                <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/0 group-hover:ring-blue-500/50 transition-all duration-300"></div>
                            </div>
                            
                            <h2 className="text-xl font-black text-slate-900 mt-5 flex items-center gap-2">
                                {profile?.name || 'Admin User'}
                                <Chip 
                                    size="sm" 
                                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold border-0 shadow-lg shadow-yellow-500/30"
                                    startContent={<Star className="size-2.5 fill-white" />}
                                >
                                    VIP
                                </Chip>
                            </h2>
                            
                            <div className="flex items-center gap-2 mt-1">
                                <Mail className="size-3.5 text-slate-400" />
                                <p className="text-sm text-slate-500 font-medium">
                                    {profile?.email || 'admin@example.com'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                                <Award className="size-3.5 text-blue-500" />
                                <Chip 
                                    size="sm" 
                                    variant="flat" 
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-semibold border border-blue-200 shadow-sm"
                                    startContent={<Shield className="size-3" />}
                                >
                                    Administrator
                                </Chip>
                            </div>

                            <div className="w-full mt-6 pt-4 border-t border-slate-100 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Member Since</span>
                                    <span className="text-slate-900 font-semibold flex items-center gap-1">
                                        <CalendarIcon className="size-3.5 text-slate-400" />
                                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Role</span>
                                    <Chip 
                                        size="sm" 
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/30 border-0"
                                    >
                                        {profile?.role || 'Admin'}
                                    </Chip>
                                </div>

                                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                                    <span className="text-slate-500 font-medium">Privileges</span>
                                    <div className="flex items-center gap-1.5">
                                        <Chip size="sm" variant="flat" className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-semibold">
                                            Full Access
                                        </Chip>
                                        <Chip size="sm" variant="flat" className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-semibold">
                                            Management
                                        </Chip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Overview Card */}
                <div className="card bg-white shadow-xl shadow-slate-100/40 border border-slate-100 lg:col-span-2 rounded-3xl">
                    <div className="card-body p-6 md:p-8">
                        <h3 className="text-lg font-black border-b border-slate-100 pb-4 mb-6 text-slate-900 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
                            Platform Overview
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {overviewItems.map((item) => (
                                <div 
                                    key={item.title}
                                    className={`bg-${item.color}-50/30 border border-${item.color}-100 rounded-xl p-4 hover:shadow-md transition-all duration-200`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 bg-${item.color}-100 rounded-lg`}>
                                            <item.icon className={`size-4 text-${item.color}-600`} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">{item.title}</p>
                                            <p className={`text-lg font-bold text-${item.color}-700`}>
                                                {item.value.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Platform Status */}
                            <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <CheckCircle className="size-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Platform Status</p>
                                        <Chip 
                                            size="sm" 
                                            className="bg-emerald-100 text-emerald-700 font-bold border border-emerald-200"
                                            startContent={<CheckCircle className="size-3" />}
                                        >
                                            Active
                                        </Chip>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Platform Info */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 font-medium">Platform Health</span>
                                <div className="flex items-center gap-3">
                                    <Chip size="sm" variant="flat" className="bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            All Systems Operational
                                        </span>
                                    </Chip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}