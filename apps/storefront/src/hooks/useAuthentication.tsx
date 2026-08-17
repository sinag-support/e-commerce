'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export function useAuthenticated() {
   const [authenticated, setAuthenticated] = useState<boolean | null>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const checkAuth = async () => {
         const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
         )
         const { data: { session } } = await supabase.auth.getSession()
         setAuthenticated(!!session)
         setLoading(false)
      }
      checkAuth()
   }, [])

   return { authenticated, loading }
}