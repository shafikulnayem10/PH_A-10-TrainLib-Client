import { protectedFetch, serverMutation } from "@/lib/core/server";

export const getAdminOverview = async () => {
    return await protectedFetch("/api/admin/overview");
};

export const getAdminUsers = async () => {
    return await protectedFetch("/api/admin/users");
};

export const updateUserStatus = async (userId, status) => {
    return await serverMutation(`/api/admin/users/${userId}/status`, { status }, 'PATCH');
};

export const makeUserAdmin = async (userId) => {
    return await serverMutation(`/api/admin/users/${userId}/make-admin`, {}, 'PATCH');
};

export const getTrainerApplications = async () => {
    return await protectedFetch("/api/admin/trainer-applications");
};

export const updateTrainerApplication = async (applicationId, data) => {
    return await serverMutation(`/api/admin/trainer-applications/${applicationId}`, data, 'PATCH');
};