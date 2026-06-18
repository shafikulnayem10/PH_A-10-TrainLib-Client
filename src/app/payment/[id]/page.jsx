'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getClassDetails } from '@/lib/api/classes';
import { Card, Button, Spinner } from '@heroui/react'; 

const ImplementCheckoutPage = () => {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getClassDetails(id)
                .then((data) => {
                    setClassData(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch class details:", err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center">
                <Spinner size="lg" label="Loading booking detail..." color="primary" />
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="w-full min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">
                Class details not found.
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full">
                
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black text-zinc-100 tracking-tight">Implement Stripe Checkout here</h1>
                    <p className="text-zinc-500 text-xs mt-1">Review your selected class details before moving to hosted payment gate.</p>
                </div>

                <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                 
                    <div className="flex flex-col gap-5 p-0">
                        {classData.image && (
                            <img 
                                src={classData.image} 
                                alt={classData.name || classData.className} 
                                className="w-full h-44 object-cover rounded-xl border border-zinc-800"
                            />
                        )}

                        <div className="flex flex-col gap-1 border-b border-zinc-800 pb-4">
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2.5 py-1 rounded-md w-fit uppercase tracking-wider">
                                Booking Preview
                            </span>
                            
                         
                            <h2 className="text-xl font-extrabold text-zinc-100 mt-2">
                                {classData.name || classData.className}
                            </h2>
                            
                            <p className="text-zinc-400 text-sm mt-0.5">
                                Trainer: <span className="text-zinc-200 font-semibold">{classData.trainerName}</span>
                            </p>
                        </div>

                        <div className="flex justify-between items-center bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Class Price</span>
                            <span className="text-2xl font-black text-blue-500">${classData.price}</span>
                        </div>

                       
                        <form action="/api/checkout_sessions" method="POST" className="mt-2">
                            <input type="hidden" name="class_id" value={classData._id} />
                            <input type="hidden" name="class_name" value={classData.name || classData.className} />
                            <input type="hidden" name="trainer_name" value={classData.trainerName} />
                            <input type="hidden" name="price" value={classData.price} />
                            <input type="hidden" name="image" value={classData.image || ''} />

                            <Button 
                                type="submit" 
                                role="link"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl text-sm shadow-lg shadow-blue-950/20 transition duration-200"
                            >
                                Checkout
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ImplementCheckoutPage;