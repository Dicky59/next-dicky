import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request) {
  try {
    // Check for API key in query params
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('apiKey');
    
    if (!apiKey) {
      return NextResponse.json(
        { authenticated: false, message: 'API key is required' },
        { status: 401 }
      );
    }

    // Validate API key against database
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('key', apiKey.trim())
      .single();

    if (error || !data) {
      return NextResponse.json(
        { authenticated: false, message: 'Invalid API key' },
        { status: 401 }
      );
    }

    // API key is valid
    return NextResponse.json({
      authenticated: true,
      user: {
        id: data.id,
        name: data.name || 'API User',
        accessLevel: 'full',
        lastSeen: new Date().toISOString(),
        apiKeyName: data.name,
        description: data.description,
        lastUsed: data.last_used
      }
    });
    
  } catch (error) {
    console.error('Error checking auth:', error);
    return NextResponse.json(
      { authenticated: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
