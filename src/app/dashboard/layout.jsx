import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-zinc-50">
          
            <DashboardSidebar />
            
          
            <main className="flex-1 w-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;