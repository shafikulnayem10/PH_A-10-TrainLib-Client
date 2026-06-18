'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { editComment, deleteComment, addCommentReply } from '@/lib/api/forum';
import { Edit2, Trash2, Reply } from 'lucide-react';

export default function CommentActions({ comment, currentUser }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const isOwnComment = currentUser?.email === comment.userEmail;

    const handleEdit = async () => {
        if (!editText.trim()) return;
        setIsLoading(true);
        try {
            const res = await editComment(comment._id, {
                text: editText.trim(),
                userEmail: currentUser.email
            });
            if (res.success) {
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        setIsLoading(true);
        try {
            const res = await deleteComment(comment._id, {
                userEmail: currentUser.email
            });
            if (res.success) {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;
        setIsLoading(true);
        try {
            const res = await addCommentReply(comment._id, {
                text: replyText.trim(),
                userEmail: currentUser.email,
                userName: currentUser.name
            });
            if (res.success) {
                setReplyText('');
                setIsReplying(false);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pl-8 mt-1 space-y-3">
            <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                {currentUser && (
                    <button 
                        onClick={() => setIsReplying(!isReplying)} 
                        className="flex items-center gap-1 hover:text-blue-600 transition"
                    >
                        <Reply className="w-3 h-3" /> Reply
                    </button>
                )}
                {isOwnComment && (
                    <>
                        <button 
                            onClick={() => setIsEditing(!isEditing)} 
                            className="flex items-center gap-1 hover:text-amber-600 transition"
                        >
                            <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button 
                            onClick={handleDelete} 
                            className="flex items-center gap-1 hover:text-red-600 transition"
                        >
                            <Trash2 className="w-3 h-3" /> Delete
                        </button>
                    </>
                )}
            </div>

            {isEditing && (
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-white text-zinc-900 border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleEdit}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-blue-600 text-white font-semibold text-[10px] rounded-lg hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            )}

            {isReplying && (
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-white text-zinc-900 border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleReply}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-blue-600 text-white font-semibold text-[10px] rounded-lg hover:bg-blue-700"
                    >
                        Reply
                    </button>
                </div>
            )}
        </div>
    );
}