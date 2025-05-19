import type { NextRequest } from 'next/server';
import Voice from '@/models/Voice';
import { connectToDB } from '@/mongodb/database';

type IParams = {
    params: {
        id: string
    }
}

// 获取用户的语音历史
export const GET = async (req: NextRequest, { params }: IParams) => {
    try {
        await connectToDB();
        
        // 查找用户的所有语音记录并按创建日期降序排序
        const voices = await Voice.find({ userId: params.id }).sort({ createDate: -1 });
        
        return new Response(JSON.stringify({ 
            success: true,
            voices 
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("API:/api/voice/user/[id]=>get error=>", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch voice history' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
