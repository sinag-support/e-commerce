'use client'

import { createBrowserClient } from '@supabase/ssr'
import React, { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext({
   user: null,
   loading: true,
   refreshUser: () => {},
})

export const useUserContext = () => {
   return useContext(UserContext)
}

export const UserContextProvider = ({ children }) => {
   const [user, setUser] = useState(null)
   const [loading, setLoading] = useState(true)

   const refreshUser = async () => {
      try {
         setLoading(true)
         const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
         )
         const { data: { user } } = await supabase.auth.getUser()
         if (user) {
            setUser(user)
         } else {
            setUser(null)
         }
      } catch (error) {
         console.error({ error })
         setUser(null)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      refreshUser()

      const supabase = createBrowserClient(
         process.env.NEXT_PUBLIC_SUPABASE_URL!,
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
         (event, session) => {
            if (event === 'SIGNED_IN') {
               refreshUser()
            } else if (event === 'SIGNED_OUT') {
               setUser(null)
               setLoading(false)
            }
         }
      )

      return () => {
         subscription?.unsubscribe()
      }
   }, [])

   return (
      <UserContext.Provider value={{ user, loading, refreshUser }}>
         {children}
      </UserContext.Provider>
   )
}