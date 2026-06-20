import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { createClassBooking } from '@/lib/api/classes';
import SuccessClient from './SuccessClient';

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

        const userRole = session.metadata?.role || 'user';
        const dashboardLink = `/dashboard/${userRole}`;

        let backendResponse = null;
        try {
            backendResponse = await createClassBooking(bookingData);
        } catch (error) {
            console.error("Backend Mutation Error:", error);
        }

        // Pass data to client component
        return (
            <SuccessClient 
                session={session}
                userRole={userRole}
                dashboardLink={dashboardLink}
                backendResponse={backendResponse}
            />
        );
    }

    return null;
}