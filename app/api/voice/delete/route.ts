import Voice from '@/models/Voice';
import { connectToDB } from '@/mongodb/database';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// 删除语音记录
export async function DELETE(req: NextRequest) {
  try {
    // 从请求中获取用户ID和语音ID
    const { voiceId, userId } = await req.json();
    
    if (!voiceId || !userId) {
      return new Response(JSON.stringify({ error: 'Voice ID and User ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectToDB();
    
    // 查找语音记录并确保它属于当前用户
    const voice = await Voice.findOne({ _id: voiceId, userId });
    
    if (!voice) {
      return new Response(JSON.stringify({ error: 'Voice not found or not authorized to delete' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 删除语音记录
    await Voice.findByIdAndDelete(voiceId);
    
    // 获取更新后的语音列表
    const updatedVoices = await Voice.find({ userId }).sort({ createDate: -1 });
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Voice record deleted successfully',
      voices: updatedVoices
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("API:/api/voice/delete=>delete error=>", error);
    return new Response(JSON.stringify({ error: 'Failed to delete voice record' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
