'use client';

import React, { useEffect, useState } from 'react';
import {
    Card, Chip, Button, Spinner, Modal
} from "@heroui/react";
import {
    UserCog, User, Mail, Calendar,
    RefreshCw, AlertTriangle, X, Crown,
    Shield, Clock, UserMinus
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
    fetchTrainersAction,
    demoteTrainerAction
} from "@/lib/actions/admin";

export default function ManageTrainersPage() {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const fetchTrainers = async () => {
        setLoading(true);
        try {
            const result = await fetchTrainersAction();
            if (result?.success) {
                setTrainers(result.data || []);
            } else {
                toast.error(result?.message || "Failed to load trainers");
            }
        } catch (error) {
            console.error("Error fetching trainers:", error);
            toast.error("Network error. Could not retrieve trainers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleDemoteClick = (trainer) => {
        setSelectedTrainer(trainer);
        setShowConfirmModal(true);
    };

    const confirmDemote = async () => {
        setProcessing(true);
        try {
            const result = await demoteTrainerAction(selectedTrainer._id);

            if (result?.success) {
                toast.success("Trainer demoted to user successfully!");
                setShowConfirmModal(false);
                fetchTrainers();
            } else {
                toast.error(result?.message || "Failed to demote trainer.");
            }
        } catch (error) {
            console.error("Error demoting trainer:", error);
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Spinner size="lg" color="primary" />
                <p className="text-gray-500 text-sm font-medium">Loading trainers...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                        <UserCog className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Trainers</h1>
                        <p className="text-slate-500 text-sm">
                            View and manage all registered trainers on the platform
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        isIconOnly
                        variant="light"
                        onClick={fetchTrainers}
                        className="text-blue-600 hover:bg-blue-50"
                        disabled={loading}
                    >
                        <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {trainers.length === 0 ? (
                <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-full text-blue-400 border border-blue-100">
                            <UserCog className="size-12 stroke-[1.5]" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">No trainers found</h2>
                        <p className="text-slate-500 text-sm max-w-md">
                            There are no trainers registered on the platform yet.
                            Trainers will appear here once they are approved.
                        </p>
                    </div>
                </Card>
            ) : (
                <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">TRAINER</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">EMAIL</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">STATUS</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">JOINED</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-700">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainers.map((trainer) => (
                                    <tr key={trainer._id} className="hover:bg-slate-50/50 transition border-b border-slate-100">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="font-semibold text-slate-900 block">
                                                        {trainer.name || 'Unknown Trainer'}
                                                    </span>
                                                    <span className="text-xs text-blue-600 flex items-center gap-1">
                                                        <Crown className="size-3" />
                                                        Trainer
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-slate-600 text-sm flex items-center gap-1">
                                                <Mail className="size-3.5 text-slate-400" />
                                                {trainer.email || 'No email'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Chip
                                                size="sm"
                                                className="bg-green-50 text-green-700 border border-green-200 font-semibold"
                                                startContent={<Shield className="size-3" />}
                                            >
                                                Active
                                            </Chip>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-slate-500 text-xs flex items-center gap-1">
                                                <Calendar className="size-3 text-slate-400" />
                                                {formatDate(trainer.createdAt)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                onClick={() => handleDemoteClick(trainer)}
                                                className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold min-w-[120px]"
                                                startContent={<UserMinus className="size-3.5" />}
                                            >
                                                Demote to User
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
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
                            <Modal.CloseTrigger onClick={() => setShowConfirmModal(false)} />
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
                                    Demote Trainer
                                </Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="py-4">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <UserMinus className="size-8 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Are you sure?</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        You are about to demote <span className="font-semibold text-slate-900">{selectedTrainer?.name}</span> from Trainer to User.
                                    </p>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2 text-left w-full">
                                        <AlertTriangle className="size-4 flex-shrink-0 mt-0.5" />
                                        <span>This action will remove all trainer privileges. The user will lose access to trainer-only features and their classes will remain in the system.</span>
                                    </div>
                                    <p className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1">
                                        <AlertTriangle className="size-3" />
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="border-t border-red-50 pt-4 flex gap-3">
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
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex-1 shadow-lg shadow-red-200"
                                    onClick={confirmDemote}
                                    startContent={<UserMinus className="size-4" />}
                                >
                                    {processing ? 'Demoting...' : 'Demote to User'}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}