'use server';

import { protectedFetch, serverMutation } from "@/lib/core/server";

export async function fetchAdminOverviewAction() {
    try {
        return await protectedFetch("/api/admin/overview");
    } catch (error) {
        console.error("Fetch admin overview error:", error);
        return {
            success: false,
            stats: { totalUsers: 0, totalClasses: 0, totalBookings: 0 },
            profile: null,
            message: 'Failed to fetch admin overview.'
        };
    }
}

export async function fetchAdminUsersAction() {
    try {
        return await protectedFetch("/api/admin/users");
    } catch (error) {
        console.error("Fetch admin users error:", error);
        return { success: false, data: [], message: 'Failed to fetch users.' };
    }
}

export async function updateUserStatusAction(userId, status) {
    try {
        return await serverMutation(`/api/admin/users/${userId}/status`, { status }, 'PATCH');
    } catch (error) {
        console.error("Update user status error:", error);
        return { success: false, message: 'Failed to update user status.' };
    }
}

export async function makeUserAdminAction(userId) {
    try {
        return await serverMutation(`/api/admin/users/${userId}/make-admin`, {}, 'PATCH');
    } catch (error) {
        console.error("Make user admin error:", error);
        return { success: false, message: 'Failed to promote user to admin.' };
    }
}

export async function fetchTrainerApplicationsAction() {
    try {
        return await protectedFetch("/api/admin/trainer-applications");
    } catch (error) {
        console.error("Fetch trainer applications error:", error);
        return { success: false, data: [], message: 'Failed to fetch applications.' };
    }
}

export async function updateTrainerApplicationAction(applicationId, status, feedback) {
    try {
        return await serverMutation(
            `/api/admin/trainer-applications/${applicationId}`,
            { status, feedback },
            'PATCH'
        );
    } catch (error) {
        console.error("Update trainer application error:", error);
        return { success: false, message: 'Failed to update application.' };
    }
}
