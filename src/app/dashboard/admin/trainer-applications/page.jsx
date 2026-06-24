'use client';

import React, { useEffect, useState } from 'react';
import {
    Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Chip, Button, Spinner, Modal, Input, TextArea
} from "@heroui/react";
import {
    Users, Eye, CheckCircle, XCircle, Calendar,
    User, Mail, Clock, RefreshCw, AlertTriangle,
    Award, FileText, MessageSquare
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
    fetchTrainerApplicationsAction,
    updateTrainerApplicationAction
} from "@/lib/actions/admin";

export default function TrainerApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [processing, setProcessing] = useState(false);
    const [actionType, setActionType] = useState('');

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const result = await fetchTrainerApplicationsAction();
            if (result?.success) {
                setApplications(result.data || []);
            } else {
                toast.error(result?.message || "Failed to load applications");
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast.error("Network error. Could not retrieve applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setFeedback(application.feedback || '');
        setActionType('');
        setShowDetailsModal(true);
    };

    const handleApprove = async () => {
        setActionType('approve');
        setProcessing(true);

        const applicationId = selectedApplication._id;
        const previousApplications = applications;
        setApplications(prevApps =>
            prevApps.filter(app => app._id !== applicationId)
        );

        try {
            const result = await updateTrainerApplicationAction(
                applicationId,
                'Approved',
                null
            );

            if (result?.success) {
                toast.success("Application approved! User is now a trainer.");
                setShowDetailsModal(false);
                setSelectedApplication(null);
            } else {
                setApplications(previousApplications);
                toast.error(result?.message || "Failed to approve application.");
            }
        } catch (error) {
            console.error("Error approving application:", error);
            setApplications(previousApplications);
            toast.error("Network error. Please try again.");
        } finally {
            setProcessing(false);
            setActionType('');
        }
    };

    const handleReject = async () => {
        if (!feedback.trim()) {
            toast.error("Please provide feedback before rejecting.");
            return;
        }

        setActionType('reject');
        setProcessing(true);

        const applicationId = selectedApplication._id;
        const previousApplications = applications;
        setApplications(prevApps =>
            prevApps.filter(app => app._id !== applicationId)
        );

        try {
            const result = await updateTrainerApplicationAction(
                applicationId,
                'Rejected',
                feedback.trim()
            );

            if (result?.success) {
                toast.success("Application rejected. Feedback has been sent.");
                setShowDetailsModal(false);
                setSelectedApplication(null);
                setFeedback('');
            } else {
                setApplications(previousApplications);
                toast.error(result?.message || "Failed to reject application.");
            }
        } catch (error) {
            console.error("Error rejecting application:", error);
            setApplications(previousApplications);
            toast.error("Network error. Please try again.");
        } finally {
            setProcessing(false);
            setActionType('');
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Spinner size="lg" color="primary" />
                <p className="text-gray-500 text-sm font-medium">Loading applications...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                        <Users className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trainer Applications</h1>
                        <p className="text-slate-500 text-sm">
                            Review and manage pending trainer applications
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        isIconOnly
                        variant="light"
                        onClick={fetchApplications}
                        className="text-blue-600 hover:bg-blue-50"
                        disabled={loading}
                    >
                        <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {applications.length === 0 ? (
                <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-full text-blue-400 border border-blue-100">
                            <Users className="size-12 stroke-[1.5]" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">No pending applications</h2>
                        <p className="text-slate-500 text-sm max-w-md">
                            There are no trainer applications waiting for review at this time.
                        </p>
                    </div>
                </Card>
            ) : (
                <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table aria-label="Trainer applications table">
                            <TableHeader>
                                <TableColumn isRowHeader>APPLICANT</TableColumn>
                                <TableColumn>SPECIALTY</TableColumn>
                                <TableColumn>EXPERIENCE</TableColumn>
                                <TableColumn>APPLIED ON</TableColumn>
                                <TableColumn align="center">ACTIONS</TableColumn>
                            </TableHeader>
                          
                            <TableBody
                                items={applications}
                                emptyContent="No applications found."
                            >
                                {(app) => (
                                    <TableRow key={app._id} className="hover:bg-slate-50/50 transition">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="font-semibold text-slate-900 block">
                                                        {app.userName || 'Unknown User'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="size-3" />
                                                        {app.userEmail || 'No email'}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="sm"
                                                className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold"
                                            >
                                                {app.specialty || 'Not specified'}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-slate-900">
                                                {app.experience || 0} years
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-600">
                                                    {formatDate(app.appliedAt)}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {formatTime(app.appliedAt)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                onClick={() => handleViewDetails(app)}
                                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold"
                                                startContent={<Eye className="size-3.5" />}
                                                disabled={processing}
                                            >
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
                <Modal.Backdrop className="bg-slate-950/20 backdrop-blur-sm">
                    <Modal.Container>
                        <Modal.Dialog
                            className="
                            bg-white
                            rounded-3xl
                            border
                            border-slate-100
                            shadow-[0_25px_80px_rgba(0,0,0,0.15)]
                            overflow-hidden
                            max-w-lg
                            "
                        >
                            <Modal.CloseTrigger onClick={() => setShowDetailsModal(false)} disabled={processing} />
                            <Modal.Header
                                className="
                                bg-gradient-to-r
                                from-blue-50
                                via-white
                                to-blue-50
                                border-b
                                border-slate-100
                                px-6
                                py-5
                                "
                            >
                                <Modal.Icon className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                                    <FileText className="size-5" />
                                </Modal.Icon>
                                <Modal.Heading className="text-xl font-bold text-slate-900">
                                    Application Details
                                </Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="py-4 space-y-4 max-h-[500px] overflow-y-auto">
                                {selectedApplication && (
                                    <>
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                            <div>
                                                <h3 className="font-bold text-slate-900">
                                                    {selectedApplication.userName || 'Unknown User'}
                                                </h3>
                                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                                    <Mail className="size-3.5" />
                                                    {selectedApplication.userEmail || 'No email'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-3">
                                                <p className="text-xs text-slate-500 font-medium">Experience</p>
                                                <p className="text-lg font-bold text-slate-900">
                                                    {selectedApplication.experience || 0} years
                                                </p>
                                            </div>
                                            <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-3">
                                                <p className="text-xs text-slate-500 font-medium">Specialty</p>
                                                <p className="text-lg font-bold text-slate-900">
                                                    {selectedApplication.specialty || 'Not specified'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-3">
                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                <Clock className="size-3.5" />
                                                Applied On
                                            </p>
                                            <p className="font-semibold text-slate-900">
                                                {formatDate(selectedApplication.appliedAt)} at {formatTime(selectedApplication.appliedAt)}
                                            </p>
                                        </div>

                                        {selectedApplication.bio && (
                                            <div className="border border-slate-200 rounded-xl p-3">
                                                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                    <MessageSquare className="size-3.5" />
                                                    Biography
                                                </p>
                                                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                                                    {selectedApplication.bio}
                                                </p>
                                            </div>
                                        )}

                                        <div className={`border-t border-slate-200 pt-4 transition-all duration-200 ${actionType === 'reject' ? 'block' : 'hidden'}`}>
                                            <label className="text-sm font-bold text-red-700 block mb-2">
                                                Feedback Required for Rejection
                                            </label>
                                            <TextArea
                                                placeholder="Please provide reason for rejection..."
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                minRows={3}
                                                classNames={{
                                                    inputWrapper: "bg-white border border-red-200 hover:border-red-300 focus-within:!border-red-600 rounded-xl shadow-sm transition-all duration-200",
                                                    input: "text-slate-800 placeholder:text-slate-400"
                                                }}
                                            />
                                            {!feedback.trim() && (
                                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                    <AlertTriangle className="size-3" />
                                                    Feedback is required to reject this application
                                                </p>
                                            )}
                                        </div>

                                        {actionType === 'approve' && (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                                                <p className="text-sm text-emerald-700 font-medium">
                                                    <CheckCircle className="size-4 inline mr-1" />
                                                    Click "Confirm Approve" to approve this application
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Modal.Body>
                            <Modal.Footer className="border-t border-slate-100 pt-4 flex gap-3">
                                <Button
                                    size="md"
                                    variant="light"
                                    className="text-slate-700 font-bold rounded-xl flex-1 hover:bg-slate-50 transition"
                                    onClick={() => {
                                        setActionType('');
                                        setShowDetailsModal(false);
                                    }}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>

                                {actionType === 'approve' ? (
                                    <Button
                                        size="md"
                                        isLoading={processing}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex-1 shadow-lg shadow-emerald-200"
                                        onClick={handleApprove}
                                        startContent={<CheckCircle className="size-4" />}
                                    >
                                        Confirm Approve
                                    </Button>
                                ) : actionType === 'reject' ? (
                                    <Button
                                        size="md"
                                        isLoading={processing}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex-1 shadow-lg shadow-red-200"
                                        onClick={handleReject}
                                        startContent={<XCircle className="size-4" />}
                                    >
                                        Confirm Reject
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            size="md"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex-1 shadow-lg shadow-emerald-200"
                                            onClick={() => setActionType('approve')}
                                            startContent={<CheckCircle className="size-4" />}
                                            disabled={processing}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="md"
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex-1 shadow-lg shadow-red-200"
                                            onClick={() => setActionType('reject')}
                                            startContent={<XCircle className="size-4" />}
                                            disabled={processing}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}