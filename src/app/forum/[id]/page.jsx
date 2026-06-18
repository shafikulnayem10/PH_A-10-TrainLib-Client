import React from 'react';
import Link from 'next/link';
import { getPostDetails, getPostComments } from '@/lib/api/forum';
import { getUserSession } from '@/lib/core/session';
import { ArrowLeft, MessageSquare, User, Calendar } from 'lucide-react';
import CommentForm from './CommentForm';
import VoteContainer from './VoteContainer';
import CommentActions from './CommentActions';

export const revalidate = 0;

export default async function PostDetailsPage({ params }) {
    const { id } = await params;
    
    let post = null;
    let comments = [];
    let error = null;
    let currentUser = null;

    try {
        const [postData, commentsData, sessionUser] = await Promise.all([
            getPostDetails(id),
            getPostComments(id),
            getUserSession()
        ]);
        post = postData;
        comments = commentsData;
        currentUser = sessionUser;
    } catch (err) {
        console.error(err);
        error = "Could not load post details.";
    }

    if (error || !post) {
        return (
            <div className="w-full min-h-screen bg-white text-zinc-500 flex flex-col items-center justify-center gap-4">
                <p>{error || "The requested forum post could not be located."}</p>
                <Link href="/forum" className="text-blue-600 hover:underline text-sm flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Forum
                </Link>
            </div>
        );
    }

    const currentUserId = currentUser?.id || currentUser?._id || null;

    return (
        <div className="w-full min-h-screen bg-white text-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                
                <Link 
                    href="/forum" 
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 text-xs font-semibold mb-6 transition"
                >
                    <ArrowLeft className="w-4 h-4" /> Return to Community Forum
                </Link>

                <article className="bg-white border border-zinc-200 rounded-2xl overflow-hidden p-6 sm:p-8 shadow-sm">
                    {post.image && (
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-64 sm:h-80 object-cover rounded-xl border border-zinc-100 mb-6"
                        />
                    )}

                    <div className="flex items-center gap-4 text-zinc-400 text-xs font-medium mb-4">
                        <span className="flex items-center gap-1.5 text-zinc-700">
                            <User className="w-4 h-4 text-zinc-400" />
                            {post.author || 'Verified Staff'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-zinc-400" />
                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-tight mb-4">
                        {post.title}
                    </h1>

                    <p className="text-zinc-600 text-sm sm:text-base leading-relaxed whitespace-pre-line border-b border-zinc-100 pb-6 mb-6">
                        {post.description}
                    </p>

                    <VoteContainer 
                        postId={id} 
                        initialLikes={post.likes || []} 
                        initialDislikes={post.dislikes || []} 
                        currentUserId={currentUserId} 
                    />
                </article>

                <section className="mt-10 border-t border-zinc-200 pt-8">
                    <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight flex items-center gap-2 mb-6">
                        <MessageSquare className="w-5 h-5 text-zinc-500" />
                        Discussion ({comments.length})
                    </h2>

                    <CommentForm postId={id} currentUser={currentUser} />

                    <div className="space-y-4 mt-6">
                        {comments.map((comment) => (
                            <div key={comment._id} className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm flex flex-col gap-2">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <img 
                                            src={comment.userImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"} 
                                            alt={comment.userName || "User Avatar"} 
                                            className="w-6 h-6 rounded-full object-cover border border-zinc-200"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-zinc-800">
                                                {comment.userName || 'Community Member'}
                                            </span>
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
                                            <span className="text-[11px] font-bold text-blue-600">{reply.userName}</span>
                                            <span className="text-[9px] text-zinc-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-zinc-600 text-xs">{reply.text}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}