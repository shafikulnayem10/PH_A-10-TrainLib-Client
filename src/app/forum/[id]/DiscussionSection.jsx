"use client";

import React, { useOptimistic, startTransition } from 'react';
import CommentForm from './CommentForm';
import CommentActions from './CommentActions';
import UserAvatar from '@/components/UserAvatar';
import { MessageSquare, Shield, Crown } from 'lucide-react';
import { Chip } from '@heroui/react';
import { handleCommentSubmit } from '@/lib/actions/forum';

const getRoleBadge = (authorRole) => {
    if (authorRole === 'admin') {
        return (
            <Chip 
                size="sm"
                className="bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[9px] h-5"
                startContent={<Shield className="size-2.5" />}
            >
                Admin
            </Chip>
        );
    } else if (authorRole === 'trainer') {
        return (
            <Chip 
                size="sm"
                className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[9px] h-5"
                startContent={<Crown className="size-2.5" />}
            >
                Trainer
            </Chip>
        );
    }
    return null;
};

export default function DiscussionSection({ postId, initialComments, currentUser }) {
    
    const [optimisticComments, addOptimisticComment] = useOptimistic(
        initialComments,
        (state, newComment) => [newComment, ...state]
    );

    const onCommentSubmit = async (commentText) => {
        const fakeNewComment = {
            _id: Date.now().toString(),
            text: commentText,
            userName: currentUser?.name || 'You',
            userImage: currentUser?.image,
            userEmail: currentUser?.email,
            authorRole: currentUser?.role || 'user',
            createdAt: new Date().toISOString(),
            replies: []
        };

        startTransition(() => {
            addOptimisticComment(fakeNewComment);
        });

        await handleCommentSubmit(commentText, postId);
    };

    return (
        <section className="mt-10 border-t border-zinc-200 pt-8">
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-zinc-500" />
                Discussion ({optimisticComments.length})
            </h2>

            <CommentForm postId={postId} currentUser={currentUser} />

            <div className="space-y-4 mt-6">
                {optimisticComments.map((comment) => (
                    <div key={comment._id} className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm flex flex-col gap-2">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                               
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-zinc-800">
                                            {comment.userName || 'Community Member'}
                                        </span>
                                        {getRoleBadge(comment.authorRole)}
                                    </div>
                                    <span className="text-[10px] text-zinc-400">
                                        {comment.userEmail}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] text-zinc-400">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed pl-8">
                            {comment.text}
                        </p>

                        <CommentActions comment={comment} currentUser={currentUser} />

                        {comment.replies && comment.replies.map((reply, index) => (
                            <div key={index} className="mt-3 ml-8 pl-4 border-l-2 border-blue-500 bg-zinc-50 p-3 rounded-r-lg">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                       
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[11px] font-semibold text-blue-600">{reply.userName}</span>
                                            {getRoleBadge(reply.authorRole)}
                                        </div>
                                    </div>
                                    <span className="text-[9px] text-zinc-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-zinc-600 text-xs">{reply.text}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}