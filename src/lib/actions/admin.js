
'use server';

import { protectedFetch, serverMutation } from "@/lib/core/server";


export async function fetchAdminUsersAction() {
    try {
        const result = await protectedFetch("/api/admin/users");
        if (result?.success && result?.data) {
           
            const users = result.data.map(user => ({
                ...user,
                id: user.id || user._id,
                _id: user._id || user.id
            }));
            return { success: true, data: users };
        }
        return result;
    } catch (error) {
        console.error("Fetch admin users error:", error);
        return { success: false, data: [], message: 'Failed to fetch users.' };
    }
}
export async function updateUserStatusAction(userId, status) {
    try {
        if (!userId) {
            return { success: false, message: 'User ID is required.' };
        }
      
        return await serverMutation(`/api/admin/users/${userId}/status`, { status }, 'PATCH');
    } catch (error) {
        console.error("Update user status error:", error);
        return { success: false, message: 'Failed to update user status.' };
    }
}

export async function makeUserAdminAction(userId) {
    try {
        if (!userId) {
            return { success: false, message: 'User ID is required.' };
        }
        return await serverMutation(`/api/admin/users/${userId}/make-admin`, {}, 'PATCH');
    } catch (error) {
        console.error("Make user admin error:", error);
        return { success: false, message: 'Failed to promote user to admin.' };
    }
}
