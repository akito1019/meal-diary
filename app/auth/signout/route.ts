import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = await createServerClient()

  await supabase.auth.signOut()

  return NextResponse.redirect(`${requestUrl.origin}/auth/login`, {
    status: 301,
  })
}