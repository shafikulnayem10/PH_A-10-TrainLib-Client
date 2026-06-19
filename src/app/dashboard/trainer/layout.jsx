import { requireRole } from '@/lib/core/session';

const TrainerDashboardLayout = async ({ children }) => {
    
    await requireRole('trainer'); 

    return (
        <div className="min-h-screen bg-base-100">
            {children}
        </div>
    );
};

export default TrainerDashboardLayout;