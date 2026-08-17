import { NextResponse } from 'next/server'

export async function GET() {
   const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_URL || 'http://localhost:7777'))
   
   response.cookies.delete('store_token')
   response.cookies.delete('store_logged_in')
   
   return response
}