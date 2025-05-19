import type { NextRequest } from 'next/server';
import Order from '@/models/Order';
import { connectToDB } from '@/mongodb/database';

type IParams = {
    params: {
        id: string
    }
}

// 获取用户的订单历史
export const GET = async (req: NextRequest, { params }: IParams) => {
    try {
        await connectToDB();
        
        // 查找用户的所有订单并按创建日期降序排序
        const orders = await Order.find({ userId: params.id }).sort({ createDate: -1 });
        
        return new Response(JSON.stringify({ 
            success: true,
            orders 
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("API:/api/order/user/[id]=>get error=>", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch order history' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
