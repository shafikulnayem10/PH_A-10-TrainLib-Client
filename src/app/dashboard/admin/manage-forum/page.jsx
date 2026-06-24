'use client';

import React, { useEffect, useState } from 'react';
import {
    Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Chip, Button, Spinner, Modal, Avatar
} from "@heroui/react";
import {
    MessageSquare, Trash2, Eye, User, Mail,
    Calendar, RefreshCw, AlertTriangle, X,
    Shield, Crown, Clock, FileText
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from 'next/link';
import {
    fetchAllForumPostsAction,
    deleteForumPostAction
} from "@/lib/actions/admin";

export default function ManageForumPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const result = await fetchAllForumPostsAction();
            if (result?.success) {
                setPosts(result.data || []);
            } else {
                toast.error(result?.message || "Failed to load forum posts");
            }
        } catch (error) {
            console.error("Error fetching forum posts:", error);
            toast.error("Network error. Could not retrieve posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeleteClick = (post) => {
        setSelectedPost(post);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setProcessing(true);

        const postId = selectedPost._id;
        const previousPosts = posts;
        setPosts(prevPosts =>
            prevPosts.filter(post => post._id !== postId)
        );

        try {
            const result = await deleteForumPostAction(postId);

            if (result?.success) {
                toast.success("Forum post deleted successfully!");
                setShowDeleteModal(false);
                setSelectedPost(null);
            } else {
                setPosts(previousPosts);
                toast.error(result?.message || "Failed to delete post.");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            setPosts(previousPosts);
            toast.error("Network error. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return (
                <Chip
                    size="sm"
                    className="bg-purple-50 text-purple-700 border border-purple-200 font-semibold"
                    startContent={<Shield className="size-3" />}
                >
                    Admin
                </Chip>
            );
        } else if (role === 'trainer') {
            return (
                <Chip
                    size="sm"
                    className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold"
                    startContent={<Crown className="size-3" />}
                >
                    Trainer
                </Chip>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Spinner size="lg" color="primary" />
                <p className="text-gray-500 text-sm font-medium">Loading forum posts...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                        <MessageSquare className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Forum</h1>
                        <p className="text-slate-500 text-sm">
                            Moderate and manage all community forum posts
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
                </div>
            </div>

            {posts.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium">Total Posts</p>
                        <p className="text-2xl font-bold text-blue-700">{posts.length}</p>
                    </div>
                    <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium">Admin Posts</p>
                        <p className="text-2xl font-bold text-purple-700">
                            {posts.filter(p => p.authorRole === 'admin').length}
                        </p>
                    </div>
                    <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium">Trainer Posts</p>
                        <p className="text-2xl font-bold text-blue-700">
                            {posts.filter(p => p.authorRole === 'trainer').length}
                        </p>
                    </div>
                </div>
            )}

            {posts.length === 0 ? (
                <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-full text-blue-400 border border-blue-100">
                            <MessageSquare className="size-12 stroke-[1.5]" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">No forum posts found</h2>
                        <p className="text-slate-500 text-sm max-w-md">
                            There are no forum posts available. Posts will appear here once users create them.
                        </p>
                    </div>
                </Card>
            ) : (
                <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table aria-label="Manage forum posts table">
                            <TableHeader>
                                <TableColumn isRowHeader>POST</TableColumn>
                                <TableColumn>AUTHOR</TableColumn>
                                <TableColumn>LIKES</TableColumn>
                                <TableColumn>CREATED</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                           
                            <TableBody
                                items={posts}
                                emptyContent="No forum posts found."
                            >
                                {(post) => (
                                    <TableRow key={post._id} className="hover:bg-slate-50/50 transition">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {post.image && (
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder.jpg';
                                                        }}
                                                    />
                                                )}
                                                <div>
                                                    <span className="font-semibold text-slate-900 block line-clamp-1">
                                                        {post.title || 'Untitled Post'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 line-clamp-1">
                                                        {post.description?.slice(0, 60) || 'No description'}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-slate-900 text-sm">
                                                        {post.authorName || 'Unknown User'}
                                                    </span>
                                                    {getRoleBadge(post.authorRole)}
                                                </div>
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail className="size-3" />
                                                    {post.authorEmail || 'No email'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                className="bg-rose-50 text-rose-700 border border-rose-200 font-semibold"
                                                startContent={<span className="text-rose-500">❤</span>}
                                            >
                                                {post.likes?.length || 0}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-slate-600 flex items-center gap-1">
                                                <Calendar className="size-3.5 text-slate-400" />
                                                {formatDate(post.createdAt)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Link href={`/forum/${post._id}`} target="_blank">
                                                    <Button
                                                        size="sm"
                                                        variant="flat"
                                                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 min-w-[70px] h-8 text-xs font-semibold"
                                                        startContent={<Eye className="size-3" />}
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    onClick={() => handleDeleteClick(post)}
                                                    className="bg-red-50 text-red-600 hover:bg-red-100 min-w-[70px] h-8 text-xs font-semibold"
                                                    startContent={<Trash2 className="size-3" />}
                                                    disabled={processing}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

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
                            <Modal.CloseTrigger onClick={() => setShowDeleteModal(false)} disabled={processing} />
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
                                <Modal.Heading className="text-xl font-bold text-red-950">
                                    Delete Forum Post
                                </Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="py-4">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <Trash2 className="size-8 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Are you sure?</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        You are about to permanently delete the forum post:
                                    </p>
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full">
                                        <p className="font-semibold text-slate-900 text-sm line-clamp-2">
                                            "{selectedPost?.title || 'Untitled Post'}"
                                        </p>
                                        {selectedPost?.authorName && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                By {selectedPost.authorName}
                                            </p>
                                        )}
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 flex items-start gap-2 text-left w-full">
                                        <AlertTriangle className="size-4 flex-shrink-0 mt-0.5" />
                                        <span>This action will permanently delete the post and all associated comments. This cannot be undone.</span>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="border-t border-red-50 pt-4 flex gap-3">
                                <Button
                                    size="md"
                                    variant="light"
                                    className="text-slate-700 font-bold rounded-xl flex-1 hover:bg-slate-50 transition"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={processing}
                                >
                                    <X className="size-4 mr-1" />
                                    Cancel
                                </Button>
                                <Button
                                    size="md"
                                    isLoading={processing}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex-1 shadow-lg shadow-red-200"
                                    onClick={confirmDelete}
                                    startContent={<Trash2 className="size-4" />}
                                >
                                    {processing ? 'Deleting...' : 'Delete Post'}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}