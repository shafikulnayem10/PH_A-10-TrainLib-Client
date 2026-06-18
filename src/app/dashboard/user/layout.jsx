import { requireRole } from '@/lib/core/session';

const UserDashboardLayout = async ({ children }) => {
    
    await requireRole('user'); 

    return (
        <div className="min-h-screen bg-base-100">
         
            {children}
        </div>
    );
};

export default UserDashboardLayout;