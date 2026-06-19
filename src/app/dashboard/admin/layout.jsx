import { requireRole } from '@/lib/core/session';

const AdminDashboardLayout = async ({ children }) => {
    
    await requireRole('admin'); 

    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
};

export default AdminDashboardLayout;
