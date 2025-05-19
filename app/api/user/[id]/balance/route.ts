import type { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User'
import { connectToDB } from '@/mongodb/database';

type IParams = {
    params: {
        id: string
    }
}


// 更新用户余额
export const POST = async (req: NextRequest, { params }: IParams) => {
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
        user.Balance += Number(amount);

        // 确保余额不为负数
        if (user.Balance < 0) {
            user.Balance = 0;
        }

        // 保存更新后的用户信息
        await user.save();

        return new Response(JSON.stringify({
            success: true,
            balance: user.Balance
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("API:/api/user/[id]=>post error=>", error);
        return new Response(JSON.stringify({ error: 'Failed to update balance' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
