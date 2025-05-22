import { NextRequest, NextResponse } from 'next/server';
import { getCurrentTime } from '@/lib/utils';
import User from '@/models/User';
import { getServerSession } from "next-auth"
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {

    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 })
    }

    try {
        const body = await request.json();
        const { userId, text, voice, speed } = body;
        const token = process.env.NEXT_PUBLIC_TK;

        if (!token) {
            return NextResponse.json(
                { error: 'API token not configured' },
                { status: 500 }
            );
        }

        if (!userId || !text || !voice) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // 检查文本长度
        const textLength = text.trim().length;
        if (textLength === 0) {
            return NextResponse.json(
                { error: 'Text cannot be empty' },
                { status: 400 }
            );
        }

        // 计算所需费用 - 每个字符0.1点
        const requiredBalance = textLength * 0.1;

        // 获取用户信息和余额
        const dbUser = await User.findById(userId);
        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // 检查用户余额是否足够
        if (dbUser.balance < requiredBalance) {
            return NextResponse.json(
                {
                    error: 'Insufficient balance',
                    requiredBalance: requiredBalance.toFixed(1),
                    currentBalance: dbUser.balance.toFixed(1)
                },
                { status: 402 }
            );
        }

        // 调用Replicate API创建预测
        const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                version: "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
                input: {
                    text: text,
                    voice: voice,
                    speed: speed || 1.0
                }
            })
        });

        if (!replicateResponse.ok) {
            return NextResponse.json(
                { error: `Failed to create prediction: ${replicateResponse.status}` },
                { status: replicateResponse.status }
            );
        }

        const prediction = await replicateResponse.json();
        console.log('Prediction created:', prediction.id);

        // 轮询获取结果
        let completed;
        const maxAttempts = 15; // 最大轮询次数
        const pollingInterval = 2000; // 轮询间隔（毫秒）

        for (let i = 0; i < maxAttempts; i++) {
            const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!statusResponse.ok) {
                return NextResponse.json(
                    { error: `Failed to check prediction status: ${statusResponse.status}` },
                    { status: statusResponse.status }
                );
            }

            const latest = await statusResponse.json();
            console.log(`Polling attempt ${i + 1}/${maxAttempts}, status: ${latest.status}`);

            // 检查处理是否完成
            if (latest.status !== "starting" && latest.status !== "processing") {
                completed = latest;
                break;
            }

            // 等待下一次轮询
            await new Promise(resolve => setTimeout(resolve, pollingInterval));
        }

        if (!completed) {
            return NextResponse.json(
                { error: 'Processing timed out. Please try again.' },
                { status: 408 }
            );
        }

        // 检查是否有输出
        if (!completed.output) {
            return NextResponse.json(
                { error: 'No output was generated.' },
                { status: 500 }
            );
        }

        // 计算并扣除用户余额
        const usedBalance = (textLength * 0.1).toFixed(2);
        const newBalance = (dbUser.balance - parseFloat(usedBalance)).toFixed(2);

        // 更新用户余额
        await User.findOneAndUpdate(
            { _id: userId },
            { $set: { balance: parseFloat(newBalance) } }
        );

        // 记录语音生成
        // 构建完整的 URL
        const origin = request.headers.get('origin') || 'http://localhost:3000';
        const voiceApiUrl = new URL('/api/voice/add', origin).toString();

        const voiceResponse = await fetch(voiceApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                voiceUrl: completed.output,
                text: text,
                cost: usedBalance,
                balance: newBalance,
                createDate: getCurrentTime()
            })
        });

        if (!voiceResponse.ok) {
            console.error('Failed to record voice generation');
        }

        // 获取音频文件内容
        const audioResponse = await fetch(completed.output);
        if (!audioResponse.ok) {
            throw new Error(`Failed to fetch audio file: ${audioResponse.status}`);
        }

        // 获取音频文件的ArrayBuffer
        const audioBuffer = await audioResponse.arrayBuffer();

        // 返回结果，包含音频文件和元数据
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'X-Used-Balance': usedBalance,
                'X-Current-Balance': newBalance
            }
        });

    } catch (error) {
        console.error('Error processing prediction:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
