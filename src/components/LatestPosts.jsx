import React from 'react';
import { ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';
import { serverFetch } from "@/lib/core/server";

const LatestPosts = async () => {
    let posts = [];

    try {
       
        posts = await serverFetch("/latest-posts");
    } catch (error) {
        console.error("Error loading forum posts directly inside component:", error);
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-500 text-sm">No forum posts found at the moment.</p>
            </div>
        );
    }

    return (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
                    Community Insights
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
                    Latest Forum Posts
                </h2>
                <p className="text-slate-500 max-w-xl mx-auto mt-2 text-sm">
                    Stay updated with recent fitness guides, healthy strategies, and tips shared by our expert trainers and community members.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {posts.map((post) => (
                    <article 
                        key={post._id} 
                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    >
                        <div className="p-5">
                            {post.image && (
                                <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-slate-100">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors">
                                {post.title}
                            </h3>
                            
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                                {post.description}
                            </p>
                        </div>

                        <div className="px-5 pb-5 pt-3 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span>
                                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'Recent'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        <span>{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                        <ThumbsDown className="w-3.5 h-3.5" />
                                        <span>{Array.isArray(post.dislikes) ? post.dislikes.length : 0}</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default LatestPosts;