import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, message: 'API key is required' },
        { status: 400 }
      );
    }

    // Check if the API key exists in the database
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('key', apiKey.trim())
      .single();

    if (error || !data) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid API key'
      }, { status: 401 });
    }

    // Update last_used timestamp
    await supabaseAdmin
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('key', apiKey.trim());

    // API key is valid
    return NextResponse.json({
      valid: true,
      message: 'API key is valid',
      user: {
        id: data.id,
        name: data.name || 'API User',
        validatedAt: new Date().toISOString(),
        apiKeyName: data.name,
        description: data.description
      }
    });
    
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
