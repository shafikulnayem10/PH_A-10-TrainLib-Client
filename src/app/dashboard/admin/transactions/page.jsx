'use client';

import React, { useEffect, useState } from 'react';
import {
    Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Chip, Button, Spinner, Input, Pagination
} from "@heroui/react";
import {
    DollarSign, Calendar, User, Mail, RefreshCw,
    Search, CreditCard, Clock, CheckCircle, XCircle,
    AlertTriangle, FileText, Receipt, Users, TrendingUp
} from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchTransactionsAction } from "@/lib/actions/admin";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const result = await fetchTransactionsAction();
            if (result?.success) {
                setTransactions(result.data || []);
            } else {
                toast.error(result?.message || "Failed to load transactions");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error("Network error. Could not retrieve transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

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

    const formatCurrency = (amount) => {
        if (!amount) return '$0.00';
        return `$${Number(amount).toFixed(2)}`;
    };

    const getStatusChip = (status) => {
        if (status === 'completed' || status === 'success' || status === 'paid') {
            return (
                <Chip
                    size="sm"
                    className="bg-green-50 text-green-700 border border-green-200 font-semibold"
                    startContent={<CheckCircle className="size-3" />}
                >
                    Completed
                </Chip>
            );
        } else if (status === 'pending') {
            return (
                <Chip
                    size="sm"
                    className="bg-amber-50 text-amber-700 border border-amber-200 font-semibold"
                    startContent={<Clock className="size-3" />}
                >
                    Pending
                </Chip>
            );
        } else if (status === 'failed') {
            return (
                <Chip
                    size="sm"
                    className="bg-red-50 text-red-700 border border-red-200 font-semibold"
                    startContent={<XCircle className="size-3" />}
                >
                    Failed
                </Chip>
            );
        }
        return (
            <Chip
                size="sm"
                className="bg-green-50 text-green-700 border border-green-200 font-semibold"
                startContent={<CheckCircle className="size-3" />}
            >
                Completed
            </Chip>
        );
    };

    const filteredTransactions = transactions.filter(t =>
        t.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.className?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const uniqueUsers = new Set(transactions.map(t => t.userEmail)).size;
    const averageAmount = transactions.length > 0 ? totalRevenue / transactions.length : 0;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Spinner size="lg" color="primary" />
                <p className="text-gray-500 text-sm font-medium">Loading transactions...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                        <Receipt className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transactions</h1>
                        <p className="text-slate-500 text-sm">
                            View all payment transactions across the platform
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        isIconOnly
                        variant="light"
                        onClick={fetchTransactions}
                        className="text-blue-600 hover:bg-blue-50"
                        disabled={loading}
                    >
                        <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <Input
                    placeholder="Search by email, name, transaction ID, or class..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    startContent={<Search className="size-4 text-slate-400" />}
                    classNames={{
                        inputWrapper: "bg-white border border-slate-200 hover:border-slate-300 focus-within:!border-blue-600 rounded-xl shadow-sm transition-all duration-200",
                        input: "text-slate-800 placeholder:text-slate-400"
                    }}
                />
            </div>

            {transactions.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium">Total Transactions</p>
                        <p className="text-2xl font-bold text-blue-700">{transactions.length}</p>
                    </div>
                    <div className="bg-green-50/30 border border-green-100 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-700">
                            {formatCurrency(totalRevenue)}
                        </p>
                    </div>
                    <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium">Average Amount</p>
                        <p className="text-2xl font-bold text-purple-700">
                            {formatCurrency(averageAmount)}
                        </p>
                    </div>
                    <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-4">
                        <p className="text-xs text-slate-500 font-medium">Unique Users</p>
                        <p className="text-2xl font-bold text-amber-700">{uniqueUsers}</p>
                    </div>
                </div>
            )}

            {filteredTransactions.length === 0 ? (
                <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-full text-blue-400 border border-blue-100">
                            <Receipt className="size-12 stroke-[1.5]" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {searchTerm ? 'No matching transactions found' : 'No transactions available'}
                        </h2>
                        <p className="text-slate-500 text-sm max-w-md">
                            {searchTerm
                                ? 'Try adjusting your search terms or filters.'
                                : 'Transactions will appear here once payments are processed.'}
                        </p>
                    </div>
                </Card>
            ) : (
                <>
                    <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table aria-label="Transactions table">
                                <TableHeader>
                                    <TableColumn isRowHeader>USER</TableColumn>
                                    <TableColumn>CLASS</TableColumn>
                                    <TableColumn>AMOUNT</TableColumn>
                                    <TableColumn>DATE</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                    <TableColumn>TRANSACTION ID</TableColumn>
                                </TableHeader>
                             
                                <TableBody
                                    items={paginatedTransactions}
                                    emptyContent="No transactions found."
                                >
                                    {(transaction) => (
                                        <TableRow key={transaction._id} className="hover:bg-slate-50/50 transition">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">
                                                        {transaction.userName || 'Unknown User'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="size-3" />
                                                        {transaction.userEmail || 'No email'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-slate-700">
                                                    {transaction.className || 'Unknown Class'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-bold text-slate-900 flex items-center gap-1">
                                                    <DollarSign className="size-3.5 text-slate-400" />
                                                    {formatCurrency(transaction.amount)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-slate-600 flex items-center gap-1">
                                                    <Calendar className="size-3.5 text-slate-400" />
                                                    {formatDate(transaction.date)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusChip(transaction.status || 'completed')}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                    {transaction.transactionId?.slice(0, 12)}...
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                total={totalPages}
                                initialPage={1}
                                page={currentPage}
                                onChange={setCurrentPage}
                                color="primary"
                                className="gap-2"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}