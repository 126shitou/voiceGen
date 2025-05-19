import type { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDB } from '@/mongodb/database';
import User from '@/models/User'
import Order from '@/models/Order'
import { getCurrentTime } from '@/lib/utils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-04-30.basil"
})


const PRODUCT_TOKEN_LIST = [
    { key: 'prod_SL2WEtUTGlLgST', value: 100 },
    { key: 'prod_SL2Wik94PZXSNa', value: 700 }
]


export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const rawBody = await req.text()
        const signature = req.headers.get("stripe-signature") || ""

        const event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_KEY || ""
        )

        if (event.type === "checkout.session.completed") {
            const session = event.data.object
            const line_items = await stripe.checkout.sessions.listLineItems(session.id);
            await connectToDB();
            const user = await User.findById(session.client_reference_id)
            console.log("session", JSON.stringify(session));
            console.log("line_items", JSON.stringify(line_items));
            if (user) {
                line_items.data.forEach(async ele => {
                    const pId = ele.price?.product
                    let v = PRODUCT_TOKEN_LIST.find(i => i.key === pId)?.value || 0
                    user.balance += v

                    const order = new Order({
                        userId: session.client_reference_id,
                        price: session.amount_total,
                        payCurrency: session.currency,
                        payName: session.customer_details?.name,
                        payEmail: session.customer_details?.email,
                        product: pId,
                        createDate: getCurrentTime()
                    })
                    await order.save()
                });
                await user.save();
            }

            return new Response(JSON.stringify({ received: true }), { status: 200 })
        }

    } catch (e) {
        console.log("error", e);
    }

}
