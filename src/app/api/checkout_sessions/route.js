import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { getUserSession } from '@/lib/core/session';

export async function POST(request) {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin');

        const formData = await request.formData();
        const classId = formData.get('class_id');
        const className = formData.get('class_name');
        const trainerName = formData.get('trainer_name');
        const price = parseFloat(formData.get('price'));
        const image = formData.get('image');

        const user = await getUserSession();

      
        const session = await stripe.checkout.sessions.create({
            customer_email: user?.email,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: className,
                            description: `Trainer: ${trainerName}`,
                            images: image ? [image] : [],
                        },
                        unit_amount: Math.round(price * 100), 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: { 
                classId,
                className,
                trainerName,
                price: price.toString()
            },
            
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&classId=${classId}`,
            cancel_url: `${origin}/classes/${classId}`,
        });

      
        return NextResponse.redirect(session.url, 303);
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}