'use client';

import React, { useState } from 'react';
import { Button, Input, TextArea, Card } from "@heroui/react";
import { MessageSquare, ImageUp, ArrowLeft, Send, X, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { createAdminForumPostAction } from "@/lib/actions/admin";

const inputClassNames = {
    label: "text-blue-800 font-semibold text-sm block mb-1.5",
    inputWrapper: `
        bg-white
        border-2
        border-blue-100
        hover:border-blue-300
        focus-within:!border-blue-600
        rounded-2xl
        shadow-sm
        transition-all
        duration-300
        w-full
        max-w-full
    `,
    input: `
        text-slate-800
        placeholder:text-slate-400
        w-full
    `,
    mainWrapper: "w-full max-w-full",
    labelWrapper: "w-full",
};

const textAreaClassNames = {
    label: "text-blue-800 font-semibold text-sm block mb-1.5",
    inputWrapper: `
        bg-white
        border-2
        border-blue-100
        hover:border-blue-300
        focus-within:!border-blue-600
        rounded-2xl
        shadow-sm
        transition-all
        duration-300
        w-full
        max-w-full
        min-h-[150px]
    `,
    input: `
        text-slate-800
        placeholder:text-slate-400
        w-full
        min-h-[120px]
    `,
    mainWrapper: "w-full max-w-full",
    labelWrapper: "w-full",
};

export default function AdminAddForumPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [imageError, setImageError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        description: ''
    });

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        if (file.size > 5 * 1024 * 1024) {
            setImageError("File size exceeds 5MB limit");
            toast.error("File size exceeds 5MB limit");
            return;
        }

        if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type)) {
            setImageError("Only PNG, JPG, WebP, and GIF files are allowed");
            toast.error("Only PNG, JPG, WebP, and GIF files are allowed");
            return;
        }

        setUploading(true);
        setImageError('');
        
        const imgFormData = new FormData();
        imgFormData.append('image', file);

        try {
            const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
            
            if (!IMGBB_API_KEY) {
                setImageError("API key not configured");
                toast.error("Image upload service is not configured");
                return;
            }

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: imgFormData
            });

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                const imageUrl = data.data.url;
                setFormData(prev => ({ ...prev, image: imageUrl }));
                setImagePreview(imageUrl);
                setImageError('');
                toast.success("Image uploaded successfully!");
            } else {
                setImageError(data.error?.message || "Upload failed. Try again.");
                toast.error(data.error?.message || "Upload failed. Try again.");
            }
        } catch (err) {
            console.error("Image upload error:", err);
            setImageError(`Network error: ${err.message}`);
            toast.error(`Network error: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Please enter a post title");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Please enter a description");
            return;
        }

        if (!formData.image) {
            toast.error("Please upload an image");
            return;
        }

        setLoading(true);

        try {
            const result = await createAdminForumPostAction(formData);

            if (result?.success) {
                toast.success("Forum post created successfully!");
                router.push('/dashboard/admin');
            } else {
                toast.error(result?.message || "Failed to create post");
            }
        } catch (error) {
            console.error("Error creating forum post:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto my-8 px-4">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-blue-100">
                <Link href="/dashboard/admin" className="p-2 hover:bg-blue-50 rounded-xl transition">
                    <ArrowLeft className="size-5 text-blue-600" />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                        <MessageSquare className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-blue-950 tracking-tight">Add Forum Post</h1>
                        <p className="text-blue-500 font-medium text-sm">Share announcements with the community</p>
                    </div>
                </div>
            </div>

            <Card className="border border-blue-100 shadow-sm rounded-2xl bg-white p-8 max-w-full">
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    <div className="w-full">
                        <label className="text-blue-800 font-semibold text-sm block mb-1.5">
                            Post Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="e.g., Important Announcement: New Platform Features"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            classNames={inputClassNames}
                            startContent={<MessageSquare className="size-4 text-blue-400 mr-1 flex-shrink-0" />}
                            isRequired
                            size="lg"
                            fullWidth={true}
                        />
                    </div>

                    <div className="w-full">
                        <label className="text-blue-800 font-semibold text-sm block mb-1.5">
                            Post Image <span className="text-red-500">*</span>
                        </label>
                        
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex items-center gap-5 p-6 border-2 border-dashed border-blue-300 bg-blue-50/40 rounded-xl transition-colors hover:bg-blue-50/60 w-full">
                                <label className="w-24 h-24 border-2 border-dashed border-blue-300 hover:border-blue-500 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group relative overflow-hidden flex-shrink-0">
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" 
                                        onChange={handleImageUpload} 
                                        className="hidden" 
                                        disabled={uploading || loading}
                                    />
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            {uploading ? (
                                                <Loader2 size={24} className="text-blue-600 animate-spin" />
                                            ) : (
                                                <ImageUp size={24} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                                            )}
                                            <span className="text-[10px] text-blue-400 mt-1 font-medium">
                                                {uploading ? 'Uploading...' : 'Upload'}
                                            </span>
                                        </>
                                    )}
                                </label>

                                <div className="flex flex-col gap-1 flex-1">
                                    <span className="text-sm font-semibold text-blue-950">
                                        {uploading ? 'Uploading image...' : 'Upload an image for your post'}
                                    </span>
                                    <span className="text-xs text-blue-600 font-medium">PNG, JPG, WebP, GIF up to 5MB</span>
                                    {imageError && (
                                        <span className="text-xs text-red-500 mt-1">{imageError}</span>
                                    )}
                                    {imagePreview && !uploading && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({...formData, image: ''});
                                                setImagePreview('');
                                                setImageError('');
                                            }}
                                            className="text-xs text-red-500 font-semibold hover:text-red-700 transition mt-1 flex items-center gap-1 w-fit"
                                        >
                                            <X size={14} />
                                            Remove image
                                        </button>
                                    )}
                                </div>
                            </div>

                            {imagePreview && !uploading && (
                                <div className="relative w-full max-h-[500px] rounded-xl overflow-hidden border border-blue-100 bg-blue-50/30 p-2">
                                    <img 
                                        src={imagePreview} 
                                        alt="Post image preview" 
                                        className="w-full h-auto max-h-[480px] object-contain rounded-lg"
                                        onError={(e) => {
                                            e.target.src = '/placeholder.jpg';
                                            toast.error("Image failed to load");
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="text-blue-800 font-semibold text-sm block mb-1.5">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <TextArea
                            placeholder="Write a detailed announcement or post for the community..."
                            minRows={8}
                            maxRows={15}
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            classNames={textAreaClassNames}
                            isRequired
                            fullWidth={true}
                            size="lg"
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-blue-100 w-full">
                        <Button
                            type="button"
                            onClick={() => router.push('/dashboard/admin')}
                            className="flex-1 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition h-12"
                            disabled={loading || uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={loading}
                            disabled={uploading || !formData.image}
                            className="flex-[2] bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 h-12 flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            <Send className="size-4" />
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}