'use client';

import React, { useEffect, useState } from 'react';
import {
    Card, Chip, Button, Spinner, Modal
} from "@heroui/react";
import {
    BookOpen, CheckCircle, XCircle, Clock, Calendar,
    Mail, RefreshCw, AlertTriangle, X,
    Trash2, DollarSign, RotateCcw
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
    fetchAdminClassesAction,
    updateClassStatusAction,
    deleteClassAction
} from "@/lib/actions/admin";

export default function ManageClassesPage() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const result = await fetchAdminClassesAction();
            if (result?.success) {
                setClasses(result.data || []);
            } else {
                toast.error(result?.message || "Failed to load classes");
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast.error("Network error. Could not retrieve classes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleAction = (classData, type) => {
        setSelectedClass(classData);
        setActionType(type);
        setShowConfirmModal(true);
    };

    const confirmAction = async () => {
        setProcessing(true);

        const classId = selectedClass._id;
        const previousClasses = classes;
        let newStatus = '';

        if (actionType === 'delete') {
            setClasses(prevClasses =>
                prevClasses.filter(cls => cls._id !== classId)
            );
        } else {
            newStatus = actionType === 'approve' || actionType === 'reapprove' ? 'approved' : 'rejected';
            setClasses(prevClasses =>
                prevClasses.map(cls =>
                    cls._id === classId
                        ? { ...cls, status: newStatus }
                        : cls
                )
            );
        }

        try {
            let result;
            if (actionType === 'approve') {
                result = await updateClassStatusAction(classId, 'approved');
            } else if (actionType === 'reject') {
                result = await updateClassStatusAction(classId, 'rejected');
            } else if (actionType === 'delete') {
                result = await deleteClassAction(classId);
            } else if (actionType === 'reapprove') {
                result = await updateClassStatusAction(classId, 'approved');
            }

            if (result?.success) {
                toast.success(result.message);
                setShowConfirmModal(false);
                await fetchClasses();
            } else {
                setClasses(previousClasses);
                toast.error(result?.message || "Action failed");
            }
        } catch (error) {
            console.error("Error performing action:", error);
            setClasses(previousClasses);
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
            day: 'numeric'
        });
    };

    const getStatusChip = (status) => {
        if (status === 'approved') {
            return (
                <Chip
                    size="sm"
                    className="bg-green-50 text-green-700 border border-green-200 font-semibold"
                    startContent={<CheckCircle className="size-3" />}
                >
                    Approved
                </Chip>
            );
        } else if (status === 'rejected') {
            return (
                <Chip
                    size="sm"
                    className="bg-red-50 text-red-700 border border-red-200 font-semibold"
                    startContent={<XCircle className="size-3" />}
                >
                    Rejected
                </Chip>
            );
        }
        return (
            <Chip
                size="sm"
                className="bg-amber-50 text-amber-700 border border-amber-200 font-semibold"
                startContent={<Clock className="size-3" />}
            >
                Pending
            </Chip>
        );
    };

    const getActionButtons = (classData) => {
        if (classData.status === 'pending') {
            return (
                <>
                    <Button
                        size="sm"
                        onClick={() => handleAction(classData, 'approve')}
                        className="bg-green-50 text-green-600 hover:bg-green-100 min-w-[80px] h-8 text-xs font-semibold"
                        startContent={<CheckCircle className="size-3" />}
                        disabled={processing}
                    >
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleAction(classData, 'reject')}
                        className="bg-red-50 text-red-600 hover:bg-red-100 min-w-[80px] h-8 text-xs font-semibold"
                        startContent={<XCircle className="size-3" />}
                        disabled={processing}
                    >
                        Reject
                    </Button>
                </>
            );
        } else if (classData.status === 'approved') {
            return (
                <Button
                    size="sm"
                    onClick={() => handleAction(classData, 'reject')}
                    className="bg-red-50 text-red-600 hover:bg-red-100 min-w-[80px] h-8 text-xs font-semibold"
                    startContent={<XCircle className="size-3" />}
                    disabled={processing}
                >
                    Reject
                </Button>
            );
        } else if (classData.status === 'rejected') {
            return (
                <Button
                    size="sm"
                    onClick={() => handleAction(classData, 'reapprove')}
                    className="bg-green-50 text-green-600 hover:bg-green-100 min-w-[80px] h-8 text-xs font-semibold"
                    startContent={<RotateCcw className="size-3" />}
                    disabled={processing}
                >
                    Approve
                </Button>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Spinner size="lg" color="primary" />
                <p className="text-gray-500 text-sm font-medium">Loading classes...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                        <BookOpen className="size-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Classes</h1>
                            <Chip
                                size="sm"
                                className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold"
                            >
                                Total: {classes.length}
                            </Chip>
                        </div>
                        <p className="text-slate-500 text-sm">
                            Review and manage all class submissions from trainers
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        isIconOnly
                        variant="light"
                        onClick={fetchClasses}
                        className="text-blue-600 hover:bg-blue-50"
                        disabled={loading}
                    >
                        <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {classes.length === 0 ? (
                <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-full text-blue-400 border border-blue-100">
                            <BookOpen className="size-12 stroke-[1.5]" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">No classes found</h2>
                        <p className="text-slate-500 text-sm max-w-md">
                            There are no classes submitted by trainers yet.
                            Classes will appear here once trainers add them.
                        </p>
                    </div>
                </Card>
            ) : (
                <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">CLASS</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">TRAINER</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">CATEGORY</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">PRICE</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">STATUS</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-700">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((classData) => (
                                    <tr key={classData._id} className="hover:bg-slate-50/50 transition border-b border-slate-100">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={classData.image || "/placeholder.jpg"}
                                                    alt={classData.className}
                                                    className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder.jpg';
                                                    }}
                                                />
                                                <div>
                                                    <span className="font-semibold text-slate-900 block line-clamp-1">
                                                        {classData.className || 'Unknown Class'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Clock className="size-3" />
                                                        {classData.duration || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <span className="text-sm font-semibold text-slate-900 block">
                                                        {classData.trainerName || 'Unknown Trainer'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="size-3" />
                                                        {classData.trainerEmail || 'No email'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Chip
                                                size="sm"
                                                className="bg-purple-50 text-purple-700 border border-purple-200 font-semibold"
                                            >
                                                {classData.category || 'Uncategorized'}
                                            </Chip>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-bold text-slate-900 flex items-center gap-1">
                                                <DollarSign className="size-3.5 text-slate-400" />
                                                {classData.price || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusChip(classData.status)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                {getActionButtons(classData)}
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    onClick={() => handleAction(classData, 'delete')}
                                                    className="bg-red-50 text-red-600 hover:bg-red-100 min-w-[70px] h-8 text-xs font-semibold"
                                                    startContent={<Trash2 className="size-3" />}
                                                    disabled={processing}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                <Modal.Backdrop className={`${actionType === 'delete' ? 'bg-red-950/20' : actionType === 'approve' || actionType === 'reapprove' ? 'bg-green-950/20' : 'bg-amber-950/20'} backdrop-blur-sm`}>
                    <Modal.Container>
                        <Modal.Dialog
                            className={`
                            bg-white
                            rounded-3xl
                            border
                            ${actionType === 'delete' ? 'border-red-100' : actionType === 'approve' || actionType === 'reapprove' ? 'border-green-100' : 'border-amber-100'}
                            shadow-[0_25px_80px_rgba(0,0,0,0.15)]
                            overflow-hidden
                            max-w-md
                            `}
                        >
                            <Modal.CloseTrigger onClick={() => setShowConfirmModal(false)} disabled={processing} />
                            <Modal.Header
                                className={`
                                bg-gradient-to-r
                                ${actionType === 'delete' ? 'from-red-50 via-white to-red-50' : actionType === 'approve' || actionType === 'reapprove' ? 'from-green-50 via-white to-green-50' : 'from-amber-50 via-white to-amber-50'}
                                border-b
                                ${actionType === 'delete' ? 'border-red-100' : actionType === 'approve' || actionType === 'reapprove' ? 'border-green-100' : 'border-amber-100'}
                                px-6
                                py-5
                                `}
                            >
                                <Modal.Icon className={`p-2 rounded-xl ${
                                    actionType === 'delete' ? 'bg-red-50 text-red-600' :
                                    actionType === 'approve' || actionType === 'reapprove' ? 'bg-green-50 text-green-600' :
                                    'bg-amber-50 text-amber-600'
                                }`}>
                                    {actionType === 'delete' && <Trash2 className="size-5" />}
                                    {(actionType === 'approve' || actionType === 'reapprove') && <CheckCircle className="size-5" />}
                                    {actionType === 'reject' && <XCircle className="size-5" />}
                                </Modal.Icon>
                                <Modal.Heading className="text-xl font-bold text-slate-900">
                                    {actionType === 'delete' && 'Delete Class'}
                                    {(actionType === 'approve' || actionType === 'reapprove') && 'Approve Class'}
                                    {actionType === 'reject' && 'Reject Class'}
                                </Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="py-4">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                        actionType === 'delete' ? 'bg-red-100' :
                                        actionType === 'approve' || actionType === 'reapprove' ? 'bg-green-100' :
                                        'bg-amber-100'
                                    }`}>
                                        {actionType === 'delete' && <Trash2 className="size-8 text-red-600" />}
                                        {(actionType === 'approve' || actionType === 'reapprove') && <CheckCircle className="size-8 text-green-600" />}
                                        {actionType === 'reject' && <XCircle className="size-8 text-amber-600" />}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Are you sure?</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {actionType === 'delete' && (
                                            <>You are about to permanently delete the class <span className="font-semibold text-slate-900">"{selectedClass?.className}"</span>.
                                            This action cannot be undone.</>
                                        )}
                                        {(actionType === 'approve' || actionType === 'reapprove') && (
                                            <>You are about to approve the class <span className="font-semibold text-slate-900">"{selectedClass?.className}"</span>.
                                            It will become visible to all users.</>
                                        )}
                                        {actionType === 'reject' && (
                                            <>You are about to reject the class <span className="font-semibold text-slate-900">"{selectedClass?.className}"</span>.
                                            The trainer will be notified.</>
                                        )}
                                    </p>
                                    {actionType === 'delete' && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 flex items-start gap-2 text-left w-full">
                                            <AlertTriangle className="size-4 flex-shrink-0 mt-0.5" />
                                            <span>This action will permanently remove the class and all associated data.</span>
                                        </div>
                                    )}
                                    {(actionType === 'approve' || actionType === 'reapprove') && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800 flex items-start gap-2 text-left w-full">
                                            <CheckCircle className="size-4 flex-shrink-0 mt-0.5" />
                                            <span>This class will be visible to all users on the platform.</span>
                                        </div>
                                    )}
                                    {actionType === 'reject' && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2 text-left w-full">
                                            <AlertTriangle className="size-4 flex-shrink-0 mt-0.5" />
                                            <span>The trainer will be notified that their class has been rejected.</span>
                                        </div>
                                    )}
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="border-t border-slate-100 pt-4 flex gap-3">
                                <Button
                                    size="md"
                                    variant="light"
                                    className="text-slate-700 font-bold rounded-xl flex-1 hover:bg-slate-50 transition"
                                    onClick={() => setShowConfirmModal(false)}
                                    disabled={processing}
                                >
                                    <X className="size-4 mr-1" />
                                    Cancel
                                </Button>
                                <Button
                                    size="md"
                                    isLoading={processing}
                                    className={`font-bold rounded-xl flex-1 transition ${
                                        actionType === 'delete' ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200' :
                                        (actionType === 'approve' || actionType === 'reapprove') ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200' :
                                        'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200'
                                    }`}
                                    onClick={confirmAction}
                                >
                                    {actionType === 'delete' && 'Delete Class'}
                                    {(actionType === 'approve' || actionType === 'reapprove') && 'Approve Class'}
                                    {actionType === 'reject' && 'Reject Class'}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}