'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addComment } from '@/lib/api/forum';

export default function CommentForm({ postId, currentUser }) {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        if (!currentUser?.email) {
            toast.error("Please sign in to post a comment.");
            return;
        }
        // console.log('currentUser:', currentUser);

        setIsLoading(true);
        try {
            const response = await addComment(postId, {
                text: text.trim(),
                userEmail: currentUser.email,
                userImage: currentUser.image || null,
                userName: currentUser.name || null
            });
            if (response.success) {
                setText('');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts or ask a question about this post..."
                className="w-full h-28 p-4 bg-white text-zinc-900 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm placeholder-zinc-400 resize-none shadow-sm transition"
                disabled={isLoading}
            />
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading || !text.trim()}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition disabled:opacity-50"
                >
                    {isLoading ? 'Posting...' : 'Post Comment'}
                </button>
            </div>
        </form>
    );
}