import { NextRequest, NextResponse } from 'next/server';
import { getCurrentTime } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, text, voice, speed } = body;
    const token = process.env.NEXT_PUBLIC_TK;

    if (!token) {
      return NextResponse.json(
        { error: 'API token is not configured' },
        { status: 500 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // 获取用户信息和余额
    const userResponse = await fetch(`${request.nextUrl.origin}/api/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: userResponse.status }
      );
    }

    const { user: dbUser } = await userResponse.json();

    // 计算所需费用 - 每个字符0.1点
    const textLength = text.trim().length;
    const requiredBalance = textLength * 0.1;

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

    // 创建预测
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        version: "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
        input: {
          text: text,
          voice: voice,
          speed: speed
        }
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      return NextResponse.json(
        { error: 'Failed to create prediction', details: errorData },
        { status: createResponse.status }
      );
    }

    const prediction = await createResponse.json();

    // 轮询预测结果
    let completed;
    const maxAttempts = 15; // 最大轮询次数
    const pollingInterval = 2000; // 轮询间隔（毫秒）

    for (let i = 0; i < maxAttempts; i++) {
      // 等待一段时间再检查状态
      await new Promise(resolve => setTimeout(resolve, pollingInterval));

      // 获取最新状态
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!statusResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to check prediction status' },
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
    }

    if (!completed) {
      return NextResponse.json(
        { error: 'Processing timed out. Please try again.' },
        { status: 408 }
      );
    }

    // 检查输出
    if (!completed.output) {
      return NextResponse.json(
        { error: 'No output was generated.' },
        { status: 500 }
      );
    }

    // 计算并扣除用户余额
    const usedBalance = (textLength * 0.1).toFixed(2);

    // 更新用户余额
    const balanceResponse = await fetch(`${request.nextUrl.origin}/api/user/${userId}/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: -usedBalance })
    });

    if (!balanceResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to update user balance' },
        { status: balanceResponse.status }
      );
    }

    const { balance } = await balanceResponse.json();

    // 记录语音生成
    const voiceResponse = await fetch(`${request.nextUrl.origin}/api/voice/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        voiceUrl: completed.output,
        text: text,
        cost: usedBalance,
        balance: balance,
        createDate: getCurrentTime()
      })
    });

    if (!voiceResponse.ok) {
      console.error('Failed to record voice generation');
    }

    // 返回结果
    return NextResponse.json({
      output: completed.output,
      usedBalance,
      balance
    });
  } catch (error) {
    console.error('Error processing prediction:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const token = process.env.NEXT_PUBLIC_TK;

    if (!id) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: 'API token is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to get prediction', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting prediction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}