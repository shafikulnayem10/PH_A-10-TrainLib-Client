'use client';

import React, { useEffect, useState } from 'react';
import { 
    Table, Chip, Spinner, Button, Card, Input, TextArea, Modal
} from "@heroui/react";
import { 
    BookOpen, Users, Clock, Plus, RefreshCw, Pencil, Trash2, Eye, 
    Mail, User, DollarSign, Calendar, FileText, Target, Award, 
    Image as ImageIcon, AlertTriangle 
} from "lucide-react";
import Link from 'next/link';
import { getTrainerClasses, getClassStudents, updateTrainerClass, deleteTrainerClass } from "@/lib/api/dashboard/trainer/trainer";
import { toast } from "react-hot-toast";

const inputClassNames = {
  label: "text-blue-800 font-semibold text-sm block mb-1.5",
  
  inputWrapper: `
    bg-white
    border-2
    border-blue-200
    hover:border-blue-400
    focus-within:!border-blue-600
    rounded-2xl
    shadow-sm
    transition-all
    duration-300
    w-full
  `,

  input: `
    text-blue-950
    placeholder:text-blue-300
    w-full
  `,
  
  mainWrapper: "w-full",
  labelWrapper: "w-full",
};

export default function MyClassesPage() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    
    const [modals, setModals] = useState({
        view: false,
        edit: false,
        delete: false
    });

    const [selectedClassId, setSelectedClassId] = useState(null);
    const [students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [editFormData, setEditFormData] = useState({
        className: '', category: 'Fitness', difficulty: 'Beginner',
        duration: '', price: '', classSchedule: '', description: '',
        objectives: '', requirements: '', image: ''
    });

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await getTrainerClasses();
            if (response?.success) {
                setClasses(response.data || []);
            } else {
                toast.error("Failed to load classes.");
            }
        } catch (error) {
            toast.error("Network error. Could not retrieve classes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleViewStudents = async (classId) => {
        setSelectedClassId(classId);
        setStudentsLoading(true);
        setModals(prev => ({ ...prev, view: true }));
        try {
            const res = await getClassStudents(classId);
            if (res?.success) {
                setStudents(res.data || []);
            }
        } catch (err) {
            toast.error("Error loading attendees list.");
        } finally {
            setStudentsLoading(false);
        }
    };

    const handleOpenEdit = (targetClass) => {
        setSelectedClassId(targetClass._id);
        setEditFormData({
            className: targetClass.className || '',
            category: targetClass.category || 'Fitness',
            difficulty: targetClass.difficulty || 'Beginner',
            duration: targetClass.duration || '',
            price: targetClass.price !== undefined ? String(targetClass.price) : '',
            classSchedule: targetClass.classSchedule || '',
            description: targetClass.description || '',
            objectives: Array.isArray(targetClass.objectives) ? targetClass.objectives.join(', ') : '',
            requirements: Array.isArray(targetClass.requirements) ? targetClass.requirements.join(', ') : '',
            image: targetClass.image || ''
        });
        setModals(prev => ({ ...prev, edit: true }));
    };

    const handleOpenDelete = (classData) => {
        setSelectedClass(classData);
        setSelectedClassId(classData._id);
        setModals(prev => ({ ...prev, delete: true }));
    };

    const handleUpdateSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!editFormData.className?.trim() || !editFormData.duration?.trim() || !String(editFormData.price).trim()) {
            toast.error("Please fill in all mandatory fields.");
            return;
        }

        setSubmitting(true);
        try {
            const formattedData = {
                ...editFormData,
                price: Number(editFormData.price) || 0,
                objectives: editFormData.objectives ? editFormData.objectives.split(',').map(i => i.trim()).filter(Boolean) : [],
                requirements: editFormData.requirements ? editFormData.requirements.split(',').map(i => i.trim()).filter(Boolean) : []
            };

            const result = await updateTrainerClass(selectedClassId, formattedData);
            if (result?.success) {
                toast.success("Class details updated successfully!");
                setModals(prev => ({ ...prev, edit: false }));
                fetchClasses();
            } else {
                toast.error(result?.message || "Failed to update.");
            }
        } catch (err) {
            toast.error("Server error occurred during update.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setSubmitting(true);
        try {
            const result = await deleteTrainerClass(selectedClassId);
            if (result?.success) {
                toast.success("Class removed successfully.");
                setModals(prev => ({ ...prev, delete: false }));
                fetchClasses();
            } else {
                toast.error(result?.message || "Could not delete class.");
            }
        } catch (err) {
            toast.error("Server authentication or connection failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto my-8 px-4">
            {/* Header with Gradient */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8 mb-8 shadow-xl shadow-blue-200/50">
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                            <BookOpen className="size-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">My Managed Classes</h1>
                            <p className="text-sm text-blue-100/90 font-medium">Update records, delete templates, and track attendees.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button isIconOnly variant="light" onClick={fetchClasses} className="text-white hover:bg-white/20">
                            <RefreshCw className="size-5" />
                        </Button>
                        <Link 
                            href="/dashboard/trainer/add-class"
                            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold rounded-xl px-5 h-11 transition-all flex items-center gap-2 border border-white/20"
                        >
                            <Plus size={18} /> Add New Class
                        </Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
                    <Spinner size="lg" color="primary" />
                    <p className="text-blue-600 font-medium">Loading records...</p>
                </div>
            ) : classes.length === 0 ? (
                <Card className="border border-blue-100 shadow-sm rounded-3xl bg-white p-12 text-center">
                    <Card.Header className="flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-blue-50 rounded-full text-blue-400 border border-blue-100">
                            <BookOpen className="size-12 stroke-[1.5]" />
                        </div>
                        <Card.Title className="text-lg font-bold text-blue-950">No classes found</Card.Title>
                        <p className="text-blue-400 text-sm">Start by creating your first class</p>
                    </Card.Header>
                    <Card.Footer className="justify-center">
                        <Link 
                            href="/dashboard/trainer/add-class"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 inline-flex items-center justify-center h-10 no-underline transition shadow-lg shadow-blue-200/50"
                        >
                            <Plus className="size-4 mr-1" /> Create Class
                        </Link>
                    </Card.Footer>
                </Card>
            ) : (
                <div className="bg-white border border-blue-100 rounded-3xl shadow-xl shadow-blue-100/40 overflow-hidden">
                    <Table aria-label="Trainer classes actions list">
                        <Table.ScrollContainer>
                            <Table.Content className="min-w-[800px]">
                                <Table.Header>
                                    <Table.Column isRowHeader>CLASS DETAILS</Table.Column>
                                    <Table.Column>CATEGORY</Table.Column>
                                    <Table.Column>DURATION</Table.Column>
                                    <Table.Column>STATUS</Table.Column>
                                    <Table.Column>ATTENDEES</Table.Column>
                                    <Table.Column align="center">ACTIONS</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {classes.map((item) => (
                                        <Table.Row key={item._id} className="hover:bg-blue-50/30 transition">
                                            <Table.Cell>
                                                <div className="flex items-center gap-4">
                                                    <img src={item.image || "/placeholder.jpg"} alt="" className="w-12 h-12 rounded-xl object-cover border border-blue-100 bg-blue-50 flex-shrink-0" />
                                                    <div>
                                                        <span className="font-bold text-blue-950 block line-clamp-1">{item.className}</span>
                                                        <span className="text-xs text-blue-500 font-semibold">Price: ${item.price}</span>
                                                    </div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell><Chip size="sm" variant="flat" className="bg-blue-50 border border-blue-200 text-blue-700 font-medium">{item.category}</Chip></Table.Cell>
                                            <Table.Cell><div className="flex items-center gap-1 text-blue-600"><Clock size={14} className="text-blue-400" />{item.duration}</div></Table.Cell>
                                            <Table.Cell>
                                                <Chip size="sm" className={item.status === 'approved' ? "bg-emerald-50 text-emerald-700 border-emerald-200 border font-semibold" : "bg-amber-50 text-amber-700 border-amber-200 border font-semibold"}>
                                                    {item.status || 'pending'}
                                                </Chip>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Button size="sm" variant="light" startContent={<Eye size={14} />} onClick={() => handleViewStudents(item._id)} className="text-blue-600 font-semibold hover:bg-blue-50">
                                                    Students ({item.bookingCount || 0})
                                                </Button>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button size="sm" isIconOnly variant="flat" onClick={() => handleOpenEdit(item)} className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                                                        <Pencil size={15} />
                                                    </Button>
                                                    <Button size="sm" isIconOnly variant="flat" onClick={() => handleOpenDelete(item)} className="bg-red-50 text-red-600 hover:bg-red-100">
                                                        <Trash2 size={15} />
                                                    </Button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </div>
            )}

            {/* View Enrolled Students Modal */}
            <Modal isOpen={modals.view} onClose={() => setModals(prev => ({ ...prev, view: false }))}>
                <Modal.Backdrop className="bg-blue-950/40 backdrop-blur-sm">
                    <Modal.Container>
                        <Modal.Dialog
                            className="
                            bg-white
                            rounded-3xl
                            border
                            border-blue-100
                            shadow-[0_25px_80px_rgba(37,99,235,0.15)]
                            overflow-hidden
                            "
                        >
                            <Modal.CloseTrigger onClick={() => setModals(prev => ({ ...prev, view: false }))} />
                            <Modal.Header
                                className="
                                bg-gradient-to-r
                                from-blue-50
                                via-white
                                to-blue-50
                                border-b
                                border-blue-100
                                px-6
                                py-5
                                "
                            >
                                <Modal.Icon className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                                    <Users className="size-5" />
                                </Modal.Icon>
                                <Modal.Heading className="text-xl font-bold text-blue-950">Enrolled Students</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="py-4">
                                {studentsLoading ? (
                                    <div className="flex justify-center p-6"><Spinner color="primary" /></div>
                                ) : students.length === 0 ? (
                                    <p className="text-center text-blue-400 text-sm font-medium py-4">No trainees have registered or booked this class yet.</p>
                                ) : (
                                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                                        {students.map((student, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 border border-blue-100 rounded-xl bg-blue-50/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><User size={16} /></div>
                                                    <div>
                                                        <p className="font-bold text-blue-950 text-sm">{student.userName || 'Enrolled Trainee'}</p>
                                                        <p className="text-xs text-blue-500 font-medium flex items-center gap-1"><Mail size={12} /> {student.userEmail}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-semibold text-blue-600 bg-white border border-blue-100 rounded-md px-2 py-1">
                                                    {student.bookedAt ? new Date(student.bookedAt).toLocaleDateString() : 'Booked'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer className="border-t border-blue-50 pt-4">
                                <Button size="md" className="bg-blue-50 text-blue-600 font-bold rounded-xl w-full hover:bg-blue-100 transition" onClick={() => setModals(prev => ({ ...prev, view: false }))}>Close</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

            {/* Update/Edit Class Modal */}
            <Modal isOpen={modals.edit} onClose={() => setModals(prev => ({ ...prev, edit: false }))}>
                <Modal.Backdrop className="bg-blue-950/40 backdrop-blur-sm">
                    <Modal.Container>
                        <Modal.Dialog
                            className="
                            bg-white
                            rounded-3xl
                            border
                            border-blue-100
                            shadow-[0_25px_80px_rgba(37,99,235,0.15)]
                            overflow-hidden
                            "
                        >
                            <Modal.CloseTrigger onClick={() => setModals(prev => ({ ...prev, edit: false }))} />
                            <Modal.Header
                                className="
                                bg-gradient-to-r
                                from-blue-50
                                via-white
                                to-blue-50
                                border-b
                                border-blue-100
                                px-6
                                py-5
                                "
                            >
                                <Modal.Icon className="bg-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-200">
                                    <Pencil className="size-5" />
                                </Modal.Icon>
                                <Modal.Heading className="text-xl font-bold text-blue-950">Update Class Data</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="space-y-4 max-h-[480px] overflow-y-auto px-6 py-4">
                                <div className="w-full">
                                    <label className="text-blue-800 font-semibold text-sm block mb-1.5">Class Name</label>
                                    <Input 
                                        placeholder="e.g. Elite CrossFit Power Hour" 
                                        value={editFormData.className} 
                                        onChange={e => setEditFormData({...editFormData, className: e.target.value})} 
                                        classNames={inputClassNames} 
                                        startContent={<Award className="size-4 text-blue-400 mr-1" />}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="w-full">
                                        <label className="text-blue-800 font-semibold text-sm block mb-1.5">Duration</label>
                                        <Input 
                                            placeholder="e.g. 60 mins" 
                                            value={editFormData.duration} 
                                            onChange={e => setEditFormData({...editFormData, duration: e.target.value})} 
                                            classNames={inputClassNames} 
                                            startContent={<Clock className="size-4 text-blue-400 mr-1" />}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="text-blue-800 font-semibold text-sm block mb-1.5">Price ($)</label>
                                        <Input 
                                            type="number" 
                                            placeholder="e.g. 49.99" 
                                            value={editFormData.price} 
                                            onChange={e => setEditFormData({...editFormData, price: e.target.value})} 
                                            classNames={inputClassNames} 
                                            startContent={<DollarSign className="size-4 text-blue-400 mr-1" />}
                                        />
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label className="text-blue-800 font-semibold text-sm block mb-1.5">Class Schedule</label>
                                    <Input 
                                        placeholder="e.g. Mon, Wed, Fri - 10AM" 
                                        value={editFormData.classSchedule} 
                                        onChange={e => setEditFormData({...editFormData, classSchedule: e.target.value})} 
                                        classNames={inputClassNames} 
                                        startContent={<Calendar className="size-4 text-blue-400 mr-1" />}
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="text-blue-800 font-semibold text-sm block mb-1.5">Detailed Description</label>
                                    <TextArea 
                                        placeholder="Write a detailed description about your class, focus areas, and target audience..." 
                                        minRows={5} 
                                        maxRows={8}
                                        value={editFormData.description} 
                                        onChange={e => setEditFormData({...editFormData, description: e.target.value})} 
                                        classNames={{
                                            ...inputClassNames,
                                            inputWrapper: `
                                                ${inputClassNames.inputWrapper}
                                                min-h-[120px]
                                                w-full
                                            `,
                                            input: `
                                                ${inputClassNames.input}
                                                min-h-[100px]
                                            `
                                        }}
                                        startContent={<FileText className="size-4 text-blue-400 mr-1 mt-2 self-start" />}
                                        fullWidth={true}
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="text-blue-800 font-semibold text-sm block mb-1.5">Learning Objectives (Comma separated)</label>
                                    <Input 
                                        placeholder="e.g. Weight loss, Core strength" 
                                        value={editFormData.objectives} 
                                        onChange={e => setEditFormData({...editFormData, objectives: e.target.value})} 
                                        classNames={inputClassNames} 
                                        startContent={<Target className="size-4 text-blue-400 mr-1" />}
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="text-blue-800 font-semibold text-sm block mb-1.5">Requirements (Comma separated)</label>
                                    <Input 
                                        placeholder="e.g. Yoga mat, Water bottle" 
                                        value={editFormData.requirements} 
                                        onChange={e => setEditFormData({...editFormData, requirements: e.target.value})} 
                                        classNames={inputClassNames} 
                                        startContent={<Plus className="size-4 text-blue-400 mr-1" />}
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="text-blue-800 font-semibold text-sm block mb-1.5">Class Cover Image URL</label>
                                    <Input 
                                        placeholder="https://i.ibb.co/..." 
                                        value={editFormData.image} 
                                        onChange={e => setEditFormData({...editFormData, image: e.target.value})} 
                                        classNames={inputClassNames} 
                                        startContent={<ImageIcon className="size-4 text-blue-400 mr-1" />}
                                    />
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="border-t border-blue-100 px-6 py-4 bg-blue-50/30 flex justify-end gap-3">
                                <Button size="md" variant="light" className="text-blue-700 font-bold hover:bg-blue-100 rounded-xl" onClick={() => setModals(prev => ({ ...prev, edit: false }))}>Cancel</Button>
                                <Button
                                    isLoading={submitting}
                                    onClick={handleUpdateSubmit}
                                    className="
                                    bg-gradient-to-r
                                    from-blue-600
                                    to-indigo-600
                                    hover:from-blue-700
                                    hover:to-indigo-700
                                    text-white
                                    font-bold
                                    rounded-2xl
                                    px-8
                                    h-12
                                    shadow-lg
                                    shadow-blue-200/50
                                    "
                                >
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={modals.delete} onClose={() => setModals(prev => ({ ...prev, delete: false }))}>
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
                            "
                        >
                            <Modal.CloseTrigger onClick={() => setModals(prev => ({ ...prev, delete: false }))} />
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
                                    <Trash2 className="size-5" />
                                </Modal.Icon>
                                <Modal.Heading className="text-xl font-bold text-red-950">Confirm Delete</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body className="py-4">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                        <Trash2 className="size-8 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Are you sure?</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        You are about to permanently delete the class <span className="font-semibold text-slate-900">"{selectedClass?.className || 'this class'}"</span>.
                                    </p>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 flex items-start gap-2 text-left w-full">
                                        <AlertTriangle className="size-4 flex-shrink-0 mt-0.5" />
                                        <span>This action will permanently remove the class and all associated data.</span>
                                    </div>
                                    <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                        <AlertTriangle className="size-3" />
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="border-t border-red-50 pt-4 flex gap-3">
                                <Button size="md" variant="light" className="text-slate-700 font-bold rounded-xl flex-1 hover:bg-slate-50 transition" onClick={() => setModals(prev => ({ ...prev, delete: false }))}>Cancel</Button>
                                <Button size="md" isLoading={submitting} className="bg-red-600 text-white font-bold rounded-xl flex-1 hover:bg-red-700 transition shadow-lg shadow-red-200" onClick={handleDeleteConfirm}>Delete Permanently</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}