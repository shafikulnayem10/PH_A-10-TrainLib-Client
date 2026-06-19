'use server';

import { serverMutation } from "@/lib/core/server";

export async function removeFavoriteAction(classId, userEmail) {
    try {
       
        return await serverMutation("/api/favorites", { classId, userEmail }, "POST");
    } catch (error) {
        return { success: false, message: 'Failed to remove from favorites.' };
    }
}