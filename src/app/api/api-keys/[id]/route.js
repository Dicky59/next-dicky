import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Update an API key
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, key } = body

    const updateData = {
      name,
      description
    }

    // Only update the key if it's provided (for edit mode)
    if (key) {
      updateData.key = key
    }

    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete an API key
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error } = await supabaseAdmin
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'API key deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
