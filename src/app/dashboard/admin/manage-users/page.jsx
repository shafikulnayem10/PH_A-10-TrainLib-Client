'use client';

import React, { useEffect, useState } from 'react';
import { 
    Card, Table, Chip, Button, Spinner, Modal, Avatar, Input
} from "@heroui/react";
import { 
    Users, Shield, User, Mail, Calendar, 
    Search, RefreshCw, Ban, CheckCircle, 
    Crown, AlertTriangle, X, UserCog, 
    ShieldCheck, UserX, UserCheck
} from "lucide-react";
import { toast } from "react-hot-toast";
import { 
    fetchAdminUsersAction, 
    updateUserStatusAction, 
    makeUserAdminAction 
} from "@/lib/actions/admin";

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const result = await fetchAdminUsersAction();
            if (result?.success) {
                setUsers(result.data || []);
            } else {
                toast.error(result?.message || "Failed to load users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Network error. Could not retrieve users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = (user, type) => {
        setSelectedUser(user);
        setActionType(type);
        setShowConfirmModal(true);
    };

    const confirmAction = async () => {
        setProcessing(true);

        const userId = selectedUser?.id || selectedUser?._id;
        
        if (!userId) {
            toast.error("User ID not found");
            setProcessing(false);
            return;
        }

        const previousUsers = users;
        
        if (actionType === 'block') {
            setUsers(prevUsers =>
                prevUsers.map(u => 
                    (u.id === userId || u._id === userId) 
                        ? { ...u, softBanned: true }
                        : u
                )
            );
        } else if (actionType === 'unblock') {
            setUsers(prevUsers =>
                prevUsers.map(u => 
                    (u.id === userId || u._id === userId) 
                        ? { ...u, softBanned: false }
                        : u
                )
            );
        } else if (actionType === 'make-admin') {
            setUsers(prevUsers =>
                prevUsers.map(u => 
                    (u.id === userId || u._id === userId) 
                        ? { ...u, role: 'admin' }
                        : u
                )
            );
        }

        try {
            let result;
            if (actionType === 'block') {
                result = await updateUserStatusAction(userId, 'blocked');
            } else if (actionType === 'unblock') {
                result = await updateUserStatusAction(userId, 'active');
            } else if (actionType === 'make-admin') {
                result = await makeUserAdminAction(userId);
            }

            if (result?.success) {
                toast.success(result.message);
                setShowConfirmModal(false);
            } else {
                setUsers(previousUsers);
                toast.error(result?.message || "Action failed");
            }
        } catch (error) {
            console.error("Error performing action:", error);
            setUsers(previousUsers);
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

    const isUserSoftBlocked = (user) => {
        return user?.softBanned === true;
    };

    const getStatusChip = (user) => {
        if (isUserSoftBlocked(user)) {
            return (
                <Chip 
                    size="sm" 
                    className="bg-red-50 text-red-700 border border-red-200 font-semibold"
                    startContent={<Ban className="size-3" />}
                >
                    Blocked
                </Chip>
            );
        }
        return (
            <Chip 
                size="sm" 
                className="bg-green-50 text-green-700 border border-green-200 font-semibold"
                startContent={<CheckCircle className="size-3" />}
            >
                Active
            </Chip>
        );
    };

    const getRoleChip = (role) => {
        if (role === 'admin') {
            return (
                <Chip 
                    size="sm" 
                    className="bg-purple-50 text-purple-700 border border-purple-200 font-semibold"
                    startContent={<Crown className="size-3" />}
                >
                    Admin
                </Chip>
            );
        }
        if (role === 'trainer') {
            return (
                <Chip 
                    size="sm" 
                    className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold"
                    startContent={<UserCog className="size-3" />}
                >
                    Trainer
                </Chip>
            );
        }
        return (
            <Chip 
                size="sm" 
                className="bg-gray-50 text-gray-600 border border-gray-200 font-semibold"
                startContent={<User className="size-3" />}
            >
                User
            </Chip>
        );
    };

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Spinner size="lg" color="primary" />
                <p className="text-gray-500 text-sm font-medium">Loading users...</p>
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
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Users</h1>
                        <p className="text-slate-500 text-sm">
                            Manage all registered users, their roles and status
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        isIconOnly 
                        variant="light" 
                        onClick={fetchUsers} 
                        className="text-blue-600 hover:bg-blue-50"
                        disabled={loading}
                    >
                        <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    startContent={<Search className="size-4 text-slate-400" />}
                    classNames={{
                        inputWrapper: "bg-white border border-slate-200 hover:border-slate-300 focus-within:!border-blue-600 rounded-xl shadow-sm transition-all duration-200",
                        input: "text-slate-800 placeholder:text-slate-400"
                    }}
                />
            </div>

            <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table aria-label="Manage users table">
                        <Table.ScrollContainer>
                            <Table.Content className="min-w-[900px]">
                                <Table.Header>
                                    <Table.Column>USER</Table.Column>
                                    <Table.Column>EMAIL</Table.Column>
                                    <Table.Column>ROLE</Table.Column>
                                    <Table.Column>STATUS</Table.Column>
                                    <Table.Column>JOINED</Table.Column>
                                    <Table.Column align="center">ACTIONS</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {filteredUsers.map((user) => (
                                        <Table.Row key={user.id || user._id} className="hover:bg-slate-50/50 transition">
                                            <Table.Cell>
                                                <div className="flex items-center gap-3">
                                                   
                                                    <span className="font-semibold text-slate-900">
                                                        {user.name || 'Unknown User'}
                                                    </span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-slate-600 text-sm flex items-center gap-1">
                                                    <Mail className="size-3.5 text-slate-400" />
                                                    {user.email || 'No email'}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {getRoleChip(user.role)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {getStatusChip(user)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-slate-500 text-xs flex items-center gap-1">
                                                    <Calendar className="size-3 text-slate-400" />
                                                    {formatDate(user.createdAt)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                    {user.role !== 'admin' && (
                                                        <Button
                                                            size="sm"
                                                            variant="flat"
                                                            onClick={() => handleAction(user, 'make-admin')}
                                                            className="bg-purple-50 text-purple-600 hover:bg-purple-100 min-w-[80px] h-8 text-xs font-semibold"
                                                            startContent={<Crown className="size-3" />}
                                                            disabled={processing}
                                                        >
                                                            Make Admin
                                                        </Button>
                                                    )}
                                                    
                                                    {isUserSoftBlocked(user) ? (
                                                        <Button
                                                            size="sm"
                                                            variant="flat"
                                                            onClick={() => handleAction(user, 'unblock')}
                                                            className="bg-green-50 text-green-600 hover:bg-green-100 min-w-[80px] h-8 text-xs font-semibold"
                                                            startContent={<CheckCircle className="size-3" />}
                                                            disabled={processing}
                                                        >
                                                            Unblock
                                                        </Button>
                                                    ) : (
                                                        user.role !== 'admin' && (
                                                            <Button
                                                                size="sm"
                                                                variant="flat"
                                                                onClick={() => handleAction(user, 'block')}
                                                                className="bg-red-50 text-red-600 hover:bg-red-100 min-w-[80px] h-8 text-xs font-semibold"
                                                                startContent={<Ban className="size-3" />}
                                                                disabled={processing}
                                                            >
                                                                Block
                                                            </Button>
                                                        )
                                                    )}
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </div>
            </Card>

            <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
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
                            max-w-md
                            "
                        >
                            <Modal.CloseTrigger onClick={() => setShowConfirmModal(false)} disabled={processing} />
                            <Modal.Header
                                className="
                                bg-gradient-to-r
                                from-slate-50
                                via-white
                                to-slate-50
                                border-b
                                border-slate-100
                                px-6
                                py-5
                                "
                            >
                                <Modal.Icon className={`p-2 rounded-xl ${
                                    actionType === 'block' ? 'bg-red-50 text-red-600' :
                                    actionType === 'unblock' ? 'bg-green-50 text-green-600' :
                                    'bg-purple-50 text-purple-600'
                                }`}>
                                    {actionType === 'block' && <Ban className="size-5" />}
                                    {actionType === 'unblock' && <CheckCircle className="size-5" />}
                                    {actionType === 'make-admin' && <Crown className="size-5" />}
                                </Modal.Icon>
                                <Modal.Heading className="text-xl font-bold text-slate-900">
                                    {actionType === 'block' && 'Block User'}
                                    {actionType === 'unblock' && 'Unblock User'}
                                    {actionType === 'make-admin' && 'Make Admin'}
                                </Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="py-4">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                        actionType === 'block' ? 'bg-red-100' :
                                        actionType === 'unblock' ? 'bg-green-100' :
                                        'bg-purple-100'
                                    }`}>
                                        {actionType === 'block' && <UserX className="size-8 text-red-600" />}
                                        {actionType === 'unblock' && <UserCheck className="size-8 text-green-600" />}
                                        {actionType === 'make-admin' && <ShieldCheck className="size-8 text-purple-600" />}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Are you sure?</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {actionType === 'block' && (
                                            <>You are about to block <span className="font-semibold text-slate-900">{selectedUser?.name}</span>. 
                                            They will still be able to browse but cannot book classes, apply as trainer, or post comments.</>
                                        )}
                                        {actionType === 'unblock' && (
                                            <>You are about to unblock <span className="font-semibold text-slate-900">{selectedUser?.name}</span>. 
                                            They will regain full access to all platform features.</>
                                        )}
                                        {actionType === 'make-admin' && (
                                            <>You are about to promote <span className="font-semibold text-slate-900">{selectedUser?.name}</span> to Admin. 
                                            They will have full administrative access to the platform.</>
                                        )}
                                    </p>
                                    {actionType === 'make-admin' && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 flex items-start gap-2">
                                            <AlertTriangle className="size-4 flex-shrink-0 mt-0.5" />
                                            <span>This action grants full administrative privileges. Please ensure this user is trusted.</span>
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
                                        actionType === 'block' ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200' :
                                        actionType === 'unblock' ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200' :
                                        'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200'
                                    }`}
                                    onClick={confirmAction}
                                >
                                    {actionType === 'block' && 'Block User'}
                                    {actionType === 'unblock' && 'Unblock User'}
                                    {actionType === 'make-admin' && 'Promote to Admin'}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}