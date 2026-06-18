import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getPostDetails, getPostComments } from '@/lib/api/forum';
import { getUserSession } from '@/lib/core/session';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import VoteContainer from './VoteContainer';
import DiscussionSection from './DiscussionSection'; 



export default async function PostDetailsPage({ params }) {
    const { id } = await params;
    
    const sessionUser = await getUserSession();
    if (!sessionUser) {
        redirect(`/login?redirect=/forum/${id}`);
    }

    let post = null;
    let comments = [];
    let error = null;
    const currentUser = sessionUser;

    try {
        const [postData, commentsData] = await Promise.all([
            getPostDetails(id),
            getPostComments(id)
        ]);
        
        post = postData;
        comments = commentsData;
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

               
                <DiscussionSection 
                    postId={id} 
                    initialComments={comments} 
                    currentUser={currentUser} 
                />

            </div>
        </div>
    );
}