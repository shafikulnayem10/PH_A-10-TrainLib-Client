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

export async function addClassAction(classData) {
    try {
        return await serverMutation("/api/trainer/add-class", classData, "POST");
    } catch (error) {
        console.error("Add class action error:", error);
        return { success: false, message: 'Failed to publish class.' };
    }
}

// Forum Post Server Actions
export async function createForumPostAction(postData) {
    try {
        return await serverMutation("/api/trainer/forum/create", postData, "POST");
    } catch (error) {
        console.error("Create forum post error:", error);
        return { success: false, message: 'Failed to create forum post.' };
    }
}

export async function fetchTrainerForumPostsAction() {
    try {
        return await protectedFetch("/api/trainer/forum/my-posts");
    } catch (error) {
        console.error("Fetch forum posts error:", error);
        return { success: false, data: [], message: 'Failed to fetch forum posts.' };
    }
}

export async function deleteForumPostAction(postId) {
    try {
        return await serverMutation(`/api/trainer/forum/${postId}`, {}, "DELETE");
    } catch (error) {
        console.error("Delete forum post error:", error);
        return { success: false, message: 'Failed to delete forum post.' };
    }
}