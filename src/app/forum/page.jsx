import React from 'react';
import Link from 'next/link';
import { getAllForumPosts } from '@/lib/api/forum';
import { Card, Button } from '@heroui/react';
import { ArrowRight, User, Calendar } from 'lucide-react';

export const revalidate = 0; 

export default async function ForumPage() {
    let posts = [];
    let error = null;

    try {
        posts = await getAllForumPosts();
    } catch (err) {
        console.error("Error loading forum posts:", err);
        error = "Failed to load community forum posts. Please try again later.";
    }

    return (
        <div className="w-full min-h-screen bg-white text-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="border-b border-zinc-200 pb-8 mb-10">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                        Community Hub
                    </span>
                    <h1 className="text-4xl font-black tracking-tight text-zinc-900 mt-3 sm:text-5xl">
                        Community Forum
                    </h1>
                    <p className="text-zinc-500 text-sm sm:text-base mt-2 max-w-2xl">
                        Insights, knowledge, and updates published by verified Trainers and Administrators.
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!error && posts.length === 0 && (
                    <div className="text-center py-20 bg-zinc-50 border border-zinc-100 rounded-2xl">
                        <p className="text-zinc-400 text-sm">No forum posts available at the moment.</p>
                    </div>
                )}

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Card 
                            key={post._id} 
                            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-200 hover:border-zinc-300"
                        >
                            {/* Post Thumbnail Image */}
                            {post.image && (
                                <div className="relative w-full h-48 bg-zinc-100 overflow-hidden border-b border-zinc-100">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition duration-300 hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Post Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-zinc-400 text-[11px] font-medium mb-3">
                                    <span className="flex items-center gap-1">
                                        <User className="w-3.5 h-3.5 text-zinc-400" />
                                        {post.author || 'Staff Member'}
                                    </span>
                                    {post.createdAt && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-lg font-bold text-zinc-900 tracking-tight leading-snug line-clamp-2 mb-2">
                                    {post.title}
                                </h2>

                                <p className="text-zinc-600 text-xs leading-relaxed line-clamp-3 mb-6 flex-grow">
                                    {post.description}
                                </p>

                                {/* Read More Button */}
                                <div className="pt-4 border-t border-zinc-100 mt-auto">
                                    <Link href={`/forum/${post._id}`}>
                                        <Button 
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-10 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-blue-200 transition duration-200"
                                        >
                                            Read More
                                            <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
