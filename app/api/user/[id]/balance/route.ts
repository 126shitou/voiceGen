import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User'
import { connectToDB } from '@/mongodb/database';
import { getServerSession } from "next-auth"
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type IParams = {
    params: {
        id: string
    }
}


// 更新用户余额
export const POST = async (req: NextRequest, { params }: IParams) => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 })
    }

    try {
        await connectToDB();

        const { amount } = await req.json();

        // 查找用户
        const user = await User.findById(params.id);

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 更新用户余额
        let newBalance = (user.balance + Number(amount)).toFixed(2)
        user.balance = newBalance

        // 确保余额不为负数
        if (user.balance < 0) {
            user.balance = 0;
        }

        // 保存更新后的用户信息
        await user.save();

        return new Response(JSON.stringify({
            success: true,
            balance: user.balance
        }), {
            status: 200,
        });
    } catch (error) {
        console.error("API:/api/user/[id]=>post error=>", error);
        return new Response(JSON.stringify({ error: 'Failed to update balance' }), {
            status: 500,
        });
    }
}
