'use server';

import { protectedFetch, serverMutation } from "@/lib/core/server";

export async function fetchTrainerStatusAction() {
    try {
        return await protectedFetch("/api/user/trainer-status");
    } catch (error) {
        return { success: false, status: 'Not Applied' };
    }
}

export async function applyAsTrainerAction(formData) {
    try {
        return await serverMutation("/api/user/apply-trainer", formData, "POST");
    } catch (error) {
        return { success: false, message: 'Failed to submit application.' };
    }
}
