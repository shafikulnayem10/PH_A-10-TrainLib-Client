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

export async function fetchTrainersAction() {
    try {
        return await protectedFetch("/api/admin/trainers");
    } catch (error) {
        console.error("Fetch trainers error:", error);
        return { success: false, data: [], message: 'Failed to fetch trainers.' };
    }
}

export async function demoteTrainerAction(userId) {
    try {
        return await serverMutation(`/api/admin/trainers/${userId}/demote`, {}, 'PATCH');
    } catch (error) {
        console.error("Demote trainer error:", error);
        return { success: false, message: 'Failed to demote trainer.' };
    }
}

export async function fetchAdminClassesAction() {
    try {
        return await protectedFetch("/api/admin/classes");
    } catch (error) {
        console.error("Fetch admin classes error:", error);
        return { success: false, data: [], message: 'Failed to fetch classes.' };
    }
}

export async function updateClassStatusAction(classId, status) {
    try {
        return await serverMutation(`/api/admin/classes/${classId}/status`, { status }, 'PATCH');
    } catch (error) {
        console.error("Update class status error:", error);
        return { success: false, message: 'Failed to update class status.' };
    }
}

export async function deleteClassAction(classId) {
    try {
        return await serverMutation(`/api/admin/classes/${classId}`, {}, 'DELETE');
    } catch (error) {
        console.error("Delete class error:", error);
        return { success: false, message: 'Failed to delete class.' };
    }
}

export async function createAdminForumPostAction(postData) {
    try {
        return await serverMutation("/api/admin/forum/create", postData, "POST");
    } catch (error) {
        console.error("Create admin forum post error:", error);
        return { success: false, message: 'Failed to create forum post.' };
    }
}
export async function fetchTransactionsAction() {
    try {
        return await protectedFetch("/api/admin/transactions");
    } catch (error) {
        console.error("Fetch transactions error:", error);
        return { success: false, data: [], message: 'Failed to fetch transactions.' };
    }
}