'use client';

import React, { useState } from 'react';
import { 
    Form,
    Fieldset,
    Input,
    TextArea,
    Label, 
    Button
} from "@heroui/react";
import { ImageUp, Loader2, BookOpen, Clock, DollarSign, Calendar } from "lucide-react"; 
import { toast } from "react-hot-toast";
import { getUserToken } from "@/lib/core/session"; 
import { addClassAction } from "@/lib/actions/trainer"; 

const inputClassNames = {
    inputWrapper: "bg-white border border-blue-200 hover:border-blue-400 focus-within:!border-blue-600 rounded-lg shadow-none h-11 transition",
    input: "text-blue-950 placeholder:text-blue-300 font-medium",
    label: "text-blue-950 font-semibold text-sm mb-1"
};

const textAreaClassNames = {
    inputWrapper: "bg-white border border-blue-200 hover:border-blue-400 focus-within:!border-blue-600 rounded-lg shadow-none transition",
    input: "text-blue-950 placeholder:text-blue-300 font-medium resize-none",
    label: "text-blue-950 font-semibold text-sm mb-1"
};

export default function AddClassPage() {
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        className: '',
        category: 'Fitness',
        difficulty: 'Beginner',
        duration: '',
        price: '',
        classSchedule: '', 
        description: '',
        objectives: '',
        requirements: '',
        image: '' 
    });

    const categories = [
        { label: "Fitness", value: "Fitness" },
        { label: "Yoga", value: "Yoga" },
        { label: "CrossFit", value: "CrossFit" },
        { label: "Gymnastics", value: "Gymnastics" },
        { label: "Cardio", value: "Cardio" }
    ];

    const difficultyLevels = [
        { label: "Beginner", value: "Beginner" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advanced" }
    ];

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0]; 

        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, image: "File size exceeds 5MB limit" }));
            return;
        }

        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
            setErrors(prev => ({ ...prev, image: "Only PNG and JPG files are allowed" }));
            return;
        }

        setUploading(true);
        const imgFormData = new FormData();
        imgFormData.append('image', file);

        try {
            const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
            
            if (!IMGBB_API_KEY) {
                setErrors(prev => ({ ...prev, image: "API key not configured" }));
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
                setFormData(prev => ({ ...prev, image: data.data.url }));
                setErrors(prev => ({ ...prev, image: null }));
                toast.success("Class image uploaded successfully!");
            } else {
                setErrors(prev => ({ ...prev, image: data.error?.message || "Upload failed. Try again." }));
            }
        } catch (err) {
            console.error("Image upload error:", err);
            setErrors(prev => ({ ...prev, image: `Network error: ${err.message}` }));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.className.trim()) newErrors.className = "Class name is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.duration.trim()) newErrors.duration = "Duration is required";
        if (!formData.price) newErrors.price = "Price is required";
        if (!formData.image) newErrors.image = "Please upload a class cover image";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);

        try {
            const token = await getUserToken();

            if (!token) {
                toast.error("Your session has expired. Please log in again.");
                setSubmitting(false);
                return;
            }

            const submissionData = {
                ...formData,
                price: parseFloat(formData.price),
                objectives: formData.objectives,
                requirements: formData.requirements,
                status: "Pending"
            };

            const result = await addClassAction(submissionData);

            if (result?.success) {
                toast.success("Class published successfully!");
                setFormData({ 
                    className: '', 
                    category: 'Fitness', 
                    difficulty: 'Beginner',
                    duration: '', 
                    price: '',
                    classSchedule: '',
                    description: '', 
                    objectives: '', 
                    requirements: '', 
                    image: '' 
                });
                setErrors({});
            } else {
                const errMsg = result?.message || result?.error || JSON.stringify(result) || "Failed to publish class.";
                toast.error(errMsg);
            }
        } catch (error) {
            console.error("SUBMIT ERROR:", error);
            toast.error(`Server error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-8 bg-white p-8 border border-blue-100 rounded-2xl shadow-sm">
            <Form onSubmit={handleSubmit} className="space-y-8" validationErrors={errors}>
                <Fieldset className="space-y-6 w-full">
                    <legend className="text-2xl font-bold text-blue-950 border-b border-blue-100 w-full pb-4 mb-2 flex items-center gap-2">
                        <BookOpen className="size-6 text-blue-600" /> Add New Class
                    </legend>

                    <Input 
                        label="Class Name"
                        labelPlacement="outside"
                        placeholder="e.g., Elite CrossFit Power Hour"
                        value={formData.className}
                        onChange={(e) => setFormData({...formData, className: e.target.value})}
                        isInvalid={!!errors.className} 
                        errorMessage={errors.className}
                        classNames={inputClassNames}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col w-full">
                            <label className="text-blue-950 font-semibold text-sm mb-1">Category</label>
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="bg-white border border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:outline-none rounded-lg h-11 transition w-full px-3 text-blue-950 font-medium cursor-pointer appearance-none"
                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231e3a8a\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="text-blue-950 font-semibold text-sm mb-1">Difficulty Level</label>
                            <select 
                                value={formData.difficulty}
                                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                className="bg-white border border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:outline-none rounded-lg h-11 transition w-full px-3 text-blue-950 font-medium cursor-pointer appearance-none"
                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231e3a8a\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                            >
                                {difficultyLevels.map((lvl) => (
                                    <option key={lvl.value} value={lvl.value}>
                                        {lvl.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="duration" className="text-blue-950 font-semibold text-sm mb-1">Duration</Label>
                            <Input 
                                id="duration"
                                placeholder="e.g., 60 mins"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                isInvalid={!!errors.duration}
                                errorMessage={errors.duration}
                                startContent={<Clock size={16} className="text-blue-400 flex-shrink-0" />}
                                classNames={inputClassNames}
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="price" className="text-blue-950 font-semibold text-sm mb-1">Price ($)</Label>
                            <Input 
                                id="price"
                                type="number"
                                placeholder="e.g., 49.99"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                isInvalid={!!errors.price}
                                errorMessage={errors.price}
                                startContent={<DollarSign size={16} className="text-blue-400 flex-shrink-0" />}
                                classNames={inputClassNames}
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="classSchedule" className="text-blue-950 font-semibold text-sm mb-1">Class Schedule</Label>
                            <Input 
                                id="classSchedule"
                                placeholder="e.g., Mon, Wed, Fri - 10AM"
                                value={formData.classSchedule}
                                onChange={(e) => setFormData({...formData, classSchedule: e.target.value})}
                                startContent={<Calendar size={16} className="text-blue-400 flex-shrink-0" />}
                                classNames={inputClassNames}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <span className="text-blue-950 font-semibold text-sm">Class Cover Image</span>
                        <div className="flex items-center gap-5 p-6 border-2 border-dashed border-blue-300 bg-blue-50/40 rounded-xl transition-colors hover:bg-blue-50/60">
                            <label className="w-20 h-20 border-2 border-dashed border-blue-300 hover:border-blue-500 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group relative overflow-hidden">
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/jpg" 
                                    onChange={handleImageUpload} 
                                    className="hidden" 
                                    disabled={uploading || submitting}
                                />
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        {uploading ? (
                                            <Loader2 size={20} className="text-blue-600 animate-spin" />
                                        ) : (
                                            <ImageUp size={20} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                                        )}
                                    </>
                                )}
                            </label>

                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-blue-950">
                                    {uploading ? 'Uploading...' : 'Upload image'}
                                </span>
                                <span className="text-xs text-blue-600 font-medium">PNG, JPG up to 5MB</span>
                                {errors.image && <span className="text-xs text-red-500 mt-1">{errors.image}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="description" className="text-blue-950 font-semibold text-sm mb-1">Description</Label>
                        <TextArea 
                            id="description"
                            placeholder="Write a detailed description about your class..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            isInvalid={!!errors.description}
                            errorMessage={errors.description}
                            minRows={4}
                            classNames={textAreaClassNames}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="objectives" className="text-blue-950 font-semibold text-sm mb-1">Learning Objectives</Label>
                            <Input 
                                id="objectives"
                                placeholder="e.g., Weight loss, Core strength"
                                value={formData.objectives}
                                onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                                classNames={inputClassNames}
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="requirements" className="text-blue-950 font-semibold text-sm mb-1">Requirements</Label>
                            <Input 
                                id="requirements"
                                placeholder="e.g., Yoga mat, Water bottle"
                                value={formData.requirements}
                                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                classNames={inputClassNames}
                            />
                        </div>
                    </div>
                </Fieldset>

                <div className="flex justify-end gap-3 pt-6 border-t border-blue-100 w-full">
                    <Button
                        type="submit"
                        isLoading={submitting}
                        disabled={uploading || submitting}
                        className="bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 rounded-lg px-8 h-11 transition-all shadow-md shadow-blue-200/50"
                    >
                        {submitting ? 'Publishing...' : 'Publish Class'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}