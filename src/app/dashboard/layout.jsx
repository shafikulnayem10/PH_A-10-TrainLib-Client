'use client';

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Menu, X } from "lucide-react"; 

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50/50 relative overflow-x-hidden">
            
          
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            
            <div className={`
                fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:relative
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                transition-transform duration-300 ease-in-out
            `}>
               
                <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            <main className="flex-1 p-4 md:p-6 lg:p-8 w-full min-w-0">
                <div className="max-w-7xl mx-auto">
                    
                   
                    <div className="flex lg:hidden mb-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="inline-flex items-center gap-2 px-4 py-2 border rounded-xl bg-white shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <Menu className="h-4 w-4" />
                            <span>Dashboard Menu</span>
                        </button>
                    </div>

                    {children}
                </div>
            </main>
        </div>
    );
}