"use client";

import React, { useState, useTransition } from 'react';
import { CircleInfo } from "@gravity-ui/icons";
import { Button, Modal } from "@heroui/react";

export default function RemoveFavoriteBtn({ classId, userEmail, onRemoveAction }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("classId", classId);
            formData.append("userEmail", userEmail);
            
            await onRemoveAction(formData);
            setIsOpen(false);
        });
    };

    return (
        <>
           
            <Button 
                type="button"
                onPress={() => setIsOpen(true)} 
                className="bg-transparent hover:bg-red-50 text-red-500 font-semibold px-3 py-2 rounded-lg text-sm transition-colors inline-flex items-center gap-1.5 min-w-0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Remove
            </Button>

            <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog className="sm:max-w-[360px]">
                            <Modal.Header>
                                <Modal.Icon className="bg-red-100 text-red-600">
                                    <CircleInfo className="size-5" />
                                </Modal.Icon>
                                <Modal.Heading>Remove From Favorites</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-sm text-zinc-500">
                                    Are you sure you want to remove this class from your favorites?
                                </p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button 
                                    variant="secondary" 
                                    onPress={() => setIsOpen(false)}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    className="bg-red-600 text-white hover:bg-red-700 font-medium"
                                    onPress={handleDelete}
                                    disabled={isPending}
                                >
                                    {isPending ? "Removing..." : "Remove"}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </>
    );
}