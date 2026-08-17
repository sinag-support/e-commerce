import { NextResponse } from 'next/server'

export async function GET() {
   const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_URL || 'http://localhost:8888'))
   
   response.cookies.delete('admin_token')
   response.cookies.delete('admin_logged_in')
   
   return response
}