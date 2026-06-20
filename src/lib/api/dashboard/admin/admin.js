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

export const getTrainers = async () => {
    return await protectedFetch("/api/admin/trainers");
};

export const demoteTrainer = async (userId) => {
    return await serverMutation(`/api/admin/trainers/${userId}/demote`, {}, 'PATCH');
};

export const getAdminClasses = async () => {
    return await protectedFetch("/api/admin/classes");
};

export const updateClassStatus = async (classId, status) => {
    return await serverMutation(`/api/admin/classes/${classId}/status`, { status }, 'PATCH');
};

export const deleteClass = async (classId) => {
    return await serverMutation(`/api/admin/classes/${classId}`, {}, 'DELETE');
};