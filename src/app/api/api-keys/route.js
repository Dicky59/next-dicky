import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Get all API keys
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('API keys data:', data) // Debug log
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create a new API key
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, description } = body

    // Generate API key
    const generateApiKey = () => {
      const prefix = 'pk_'
      const randomPart = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15)
      return prefix + randomPart.toUpperCase()
    }

    const newApiKey = {
      name,
      description,
      key: generateApiKey(),
      last_used: null
    }

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .insert([newApiKey])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
