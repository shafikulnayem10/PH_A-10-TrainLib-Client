"use server";

import { revalidatePath } from 'next/cache';

export async function handleCommentSubmit(formData, postId) {
   
    revalidatePath(`/forum/${postId}`);
}