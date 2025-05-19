import Stripe from 'stripe'

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "")

export const POST = async (req, res) => {

    if (req.method === "POST") {
        try {
            const { userId } = await req.json()

            const params = {
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                client_reference_id: userId,
                line_items: [
                    {
                        price: 'price_1RPfUJPsq011JgrIILrZCvJg',
                        quantity: 1,
                    },
                ],
                success_url: `${req.headers.get("origin")}/success`,
                cancel_url: `${req.headers.get("origin")}/canceled`,
            }
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create(params);
            return new Response(JSON.stringify(session), { status: 200 });
        } catch (err) {
            return NextResponse.json(
                { error: err.message },
                { status: err.statusCode || 500 }
            )
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}