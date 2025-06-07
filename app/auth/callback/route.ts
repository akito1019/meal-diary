import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/`)
}