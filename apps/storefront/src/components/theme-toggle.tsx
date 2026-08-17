'use client'

import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
   const { resolvedTheme, setTheme } = useTheme()
   const [mounted, setMounted] = useState(false)

   useEffect(() => {
      setMounted(true)
   }, [])

   if (!mounted) {
      return (
         <Button variant="outline" size="icon" className="h-9 w-9 border-white/20">
            <div className="h-4 w-4" />
         </Button>
      )
   }

   return (
      <Button
         variant="outline"
         size="icon"
         className="h-9 w-9 border-white/20 text-white hover:bg-white/10 hover:text-white"
         onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      >
         {resolvedTheme === 'dark' ? (
            <SunIcon className="h-4 w-4" />
         ) : (
            <MoonIcon className="h-4 w-4" />
         )}
      </Button>
   )
}