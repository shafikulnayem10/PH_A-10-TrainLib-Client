'use client';

import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { togglePostVote } from '@/lib/api/forum';

export default function VoteContainer({ postId, initialLikes, initialDislikes, currentUserId }) {
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [isLoading, setIsLoading] = useState(false);

    const isLiked = currentUserId ? likes.includes(currentUserId) : false;
    const isDisliked = currentUserId ? dislikes.includes(currentUserId) : false;

    const handleVote = async (type) => {
        if (!currentUserId) {
            alert("Please sign in to vote on this post.");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await togglePostVote(postId, {
                userId: currentUserId,
                voteType: type
            });
            if (response.success) {
                setLikes(response.likes);
                setDislikes(response.dislikes);
            }
        } catch (error) {
            console.error("Failed to sync vote:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4 text-zinc-500 text-xs font-bold uppercase tracking-wider">
            <Button
                disabled={isLoading}
                onClick={() => handleVote('like')}
                className={`flex items-center gap-1.5 h-9 px-4 border rounded-xl transition ${
                    isLiked 
                        ? 'bg-blue-50 border-blue-200 text-blue-600' 
                        : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                }`}
            >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'text-blue-600 fill-blue-600' : 'text-zinc-400'}`} />
                <span>{likes.length} Likes</span>
            </Button>

            <Button
                disabled={isLoading}
                onClick={() => handleVote('dislike')}
                className={`flex items-center gap-1.5 h-9 px-4 border rounded-xl transition ${
                    isDisliked 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                }`}
            >
                <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'text-red-600 fill-red-600' : 'text-zinc-400'}`} />
                <span>{dislikes.length} Dislikes</span>
            </Button>
        </div>
    );
}