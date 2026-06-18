import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CircleCheckFill, Envelope, ArrowLeft } from '@gravity-ui/icons';

import { createClassBooking } from '@/lib/api/classes'; 

export default async function Success({ searchParams }) {
    const { session_id, classId } = await searchParams;

    if (!session_id) {
        throw new Error('Please provide a valid session_id (`cs_test_...`)');
    }

  
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.status === 'open') {
        return redirect('/');
    }

    if (session.status === 'complete') {
       
        const bookingData = {
            classId: classId,
            userEmail: session.customer_details?.email,
            className: session.metadata?.className,
            trainerName: session.metadata?.trainerName,
            price: parseFloat(session.metadata?.price || 0),
            transactionId: session.id,
        };

    
        let backendResponse = null;
        try {
            backendResponse = await createClassBooking(bookingData);
        } catch (error) {
            console.error("Backend Mutation Error:", error);
        }

        return (
            <div className="w-full min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center p-6 select-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

                <section className="relative max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center overflow-hidden">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <CircleCheckFill className="w-8 h-8 text-emerald-500" />
                    </div>

                    <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight mb-2">
                        Payment Successful!
                    </h1>
                  
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        {backendResponse?.message || "Thank you for your enrollment! Your seat has been secured and the booking is verified."}
                    </p>

                    <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 text-left space-y-3.5 text-xs mb-8">
                        <div className="flex items-start gap-2.5">
                            <Envelope className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                            <div>
                                <span className="block font-semibold text-zinc-400 mb-0.5">Confirmation Email</span>
                                <span className="text-zinc-200 break-all">{session.customer_details?.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/dashboard"
                            className="block w-full text-center text-xs font-semibold px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-950/30 transition duration-200"
                        >
                            Go to Dashboard Workspace
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 py-1 transition"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Return to Homepage
                        </Link>
                    </div>
                </section>
            </div>
        );
    }
}