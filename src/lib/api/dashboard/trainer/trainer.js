import { protectedFetch, serverMutation } from "@/lib/core/server";

export const getTrainerOverview = async () => {
    return await protectedFetch("/api/trainer/overview");
};


export const getTrainerClasses = async () => {
    return await protectedFetch("/api/trainer/my-classes");
};

export const getClassStudents = async (classId) => {
    return await protectedFetch(`/api/trainer/classes/${classId}/students`);
};


export const updateTrainerClass = async (classId, data) => {
    return await serverMutation(`/api/trainer/classes/${classId}`, data, 'PATCH');
};


export const deleteTrainerClass = async (classId) => {
    return await serverMutation(`/api/trainer/classes/${classId}`, {}, 'DELETE');
};