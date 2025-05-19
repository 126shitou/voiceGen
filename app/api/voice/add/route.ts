import type { NextRequest } from 'next/server';
import Voice from '@/models/Voice';
import { connectToDB } from '@/mongodb/database';

export const POST = async (req: NextRequest) => {

    try {
        // 解析请求体
        const res = await req.json();

        await connectToDB();

        // 验证必需字段
        if (!res.voiceUrl) {
            return new Response(JSON.stringify({ error: 'Voice URL is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 创建新的Voice记录
        const newVoice = new Voice(res);

        // 保存到数据库
        await newVoice.save();

        return new Response(JSON.stringify({
            success: true,
            voice: newVoice
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("API:/api/voice/add=>post error=>", error);
        return new Response(JSON.stringify({ error: 'Failed to add voice' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}