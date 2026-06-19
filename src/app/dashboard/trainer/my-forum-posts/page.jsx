'use client';

import React, { useEffect, useState } from 'react';
import { 
    Card, Button, Spinner, Modal, Chip
} from "@heroui/react";
import { 
    MessageSquare, Plus, RefreshCw, Trash2, Eye, 
    User, Calendar, Clock, AlertTriangle, X,
    Heart, ThumbsDown, MessageCircle, ThumbsUp
} from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { fetchTrainerForumPostsAction, deleteForumPostAction } from "@/lib/actions/trainer";

export default function MyForumPostsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedPostTitle, setSelectedPostTitle] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const result = await fetchTrainerForumPostsAction();
            if (result?.success) {
                setPosts(result.data || []);
            } else {
                toast.error(result?.message || "Failed to load forum posts");
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Network error. Could not retrieve posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeleteClick = (postId, postTitle) => {
        setSelectedPostId(postId);
        setSelectedPostTitle(postTitle);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            const result = await deleteForumPostAction(selectedPostId);
            if (result?.success) {
                toast.success("Forum post deleted successfully!");
                setShowDeleteModal(false);
                fetchPosts();
            } else {
                toast.error(result?.message || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="max-w-7xl mx-auto my-8 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                        <MessageSquare className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-blue-950 tracking-tight">My Forum Posts</h1>
                        <p className="text-blue-500 font-medium text-sm">
                            Manage and track your community contributions
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        isIconOnly 
                        variant="light" 
                        onClick={fetchPosts} 
                        className="text-blue-600 hover:bg-blue-50"
                        disabled={loading}
                    >
                        <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button 
                        as={Link} 
                        href="/dashboard/trainer/add-forum-post" 
                        className="bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg px-5 h-11 transition-all shadow-md flex items-center gap-2"
                    >
                        <Plus size={18} /> Create New Post
                    </Button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
                    <Spinner size="lg" color="primary" />
                    <p className="text-blue-950/60 text-sm font-medium">Loading your posts...</p>
                </div>
            ) : posts.length === 0 ? (
                <Card className="border border-blue-100 shadow-sm rounded-2xl bg-white p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-full text-blue-400 border border-blue-100">
                            <MessageSquare className="size-12 stroke-[1.5]" />
                        </div>
                        <h2 className="text-lg font-bold text-blue-950">No forum posts yet</h2>
                        <p className="text-blue-400 text-sm max-w-md">
                            You haven't created any forum posts yet. Start sharing your expertise with the community!
                        </p>
                        <Button 
                            as={Link} 
                            href="/dashboard/trainer/add-forum-post" 
                            className="bg-blue-50 text-blue-600 font-semibold rounded-lg px-6 mt-2"
                        >
                            Create Your First Post
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Card 
                            key={post._id} 
                            className="bg-white border border-blue-100 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200"
                        >
                            {/* Post Image */}
                            {post.image && (
                                <div className="relative w-full h-48 bg-blue-50 overflow-hidden border-b border-blue-100">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition duration-300 hover:scale-105"
                                        onError={(e) => {
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                    {/* Likes Badge */}
                                    <div className="absolute top-3 right-3">
                                        <Chip 
                                            size="sm" 
                                            className="bg-white/90 backdrop-blur-sm text-blue-700 font-semibold border border-blue-200 shadow-sm flex items-center gap-1"
                                            startContent={<Heart className="size-3 fill-red-500 text-red-500" />}
                                        >
                                            {post.likes?.length || 0}
                                        </Chip>
                                    </div>
                                </div>
                            )}

                            {/* Post Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                {/* Meta Info */}
                                <div className="flex items-center gap-4 text-blue-400 text-[11px] font-medium mb-3 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <User className="w-3.5 h-3.5" />
                                        {post.authorName || 'Trainer'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formatDate(post.createdAt)}
                                    </span>
                                    <span className="flex items-center gap-1 text-blue-300">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatTime(post.createdAt)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="text-lg font-bold text-blue-950 tracking-tight leading-snug line-clamp-2 mb-2">
                                    {post.title}
                                </h2>

                                {/* Description */}
                                <p className="text-blue-600 text-xs leading-relaxed line-clamp-3 mb-4 flex-grow">
                                    {post.description}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs text-blue-400 font-medium mb-4 pt-3 border-t border-blue-50">
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="size-3.5" />
                                        {post.comments?.length || 0} Comments
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp className="size-3.5 text-green-500" />
                                        {post.likes?.length || 0} Likes
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ThumbsDown className="size-3.5 text-red-500" />
                                        {post.dislikes?.length || 0} Dislikes
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2 border-t border-blue-50">
                                    <Button
                                        size="sm"
                                        onClick={() => router.push(`/forum/${post._id}`)}
                                        className="flex-1 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition h-9"
                                        startContent={<Eye className="size-3.5" />}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleDeleteClick(post._id, post.title)}
                                        className="flex-1 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition h-9"
                                        startContent={<Trash2 className="size-3.5" />}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <Modal.Backdrop className="bg-red-950/20 backdrop-blur-sm">
                    <Modal.Container>
                        <Modal.Dialog
                            className="
                            bg-white
                            rounded-3xl
                            border
                            border-red-100
                            shadow-[0_25px_80px_rgba(220,38,38,0.15)]
                            overflow-hidden
                            max-w-md
                            "
                        >
                            <Modal.CloseTrigger onClick={() => setShowDeleteModal(false)} />
                            <Modal.Header
                                className="
                                bg-gradient-to-r
                                from-red-50
                                via-white
                                to-red-50
                                border-b
                                border-red-100
                                px-6
                                py-5
                                "
                            >
                                <Modal.Icon className="bg-red-50 text-red-600 p-2 rounded-xl">
                                    <AlertTriangle className="size-5" />
                                </Modal.Icon>
                                <Modal.Heading className="text-xl font-bold text-red-950">Delete Forum Post</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="py-4">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <Trash2 className="size-8 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-blue-950">Are you sure?</h3>
                                    <p className="text-blue-600 text-sm leading-relaxed">
                                        You are about to delete the post:
                                    </p>
                                    <p className="text-blue-950 font-semibold text-sm bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 max-w-full break-words">
                                        "{selectedPostTitle}"
                                    </p>
                                    <p className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1">
                                        <AlertTriangle className="size-3" />
                                        This action is permanent and cannot be undone.
                                    </p>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="border-t border-red-50 pt-4 flex gap-3">
                                <Button 
                                    size="md" 
                                    variant="light" 
                                    className="text-blue-950 font-bold rounded-xl flex-1 hover:bg-blue-50 transition" 
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleting}
                                    startContent={<X className="size-4" />}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    size="md" 
                                    isLoading={deleting}
                                    className="bg-red-600 text-white font-bold rounded-xl flex-1 hover:bg-red-700 transition shadow-lg shadow-red-200" 
                                    onClick={handleDeleteConfirm}
                                >
                                    {deleting ? 'Deleting...' : 'Delete Permanently'}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}