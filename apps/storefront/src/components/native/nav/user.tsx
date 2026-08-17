'use client'

import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
   CreditCardIcon,
   HeartIcon,
   ListOrderedIcon,
   LogOutIcon,
   MapPinIcon,
   UserIcon,
} from 'lucide-react'
import { ShoppingBasketIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export function UserNav() {
   const router = useRouter()
   const [isLoading, setIsLoading] = useState(false)
   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

   useEffect(() => {
      const checkAuth = async () => {
         const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
         )
         const { data: { session } } = await supabase.auth.getSession()
         setIsAuthenticated(!!session)
      }
      checkAuth()
   }, [])

   async function onLogout() {
      setIsLoading(true)
      try {
         const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
         )
         await supabase.auth.signOut()
         setIsAuthenticated(false)
         router.push('/')
         router.refresh()
      } catch (error) {
         console.error({ error })
      } finally {
         setIsLoading(false)
      }
   }

   if (isAuthenticated === null) {
      return (
         <Button size="icon" variant="outline" className="h-9" disabled>
            <UserIcon className="h-4" />
         </Button>
      )
   }

   if (!isAuthenticated) {
      return (
         <Link href="/login">
            <Button variant="outline" className="h-9">
               Login
            </Button>
         </Link>
      )
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="h-9">
               <UserIcon className="h-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuGroup>
               <Link href="/profile/addresses">
                  <DropdownMenuItem className="flex gap-2">
                     <MapPinIcon className="h-4" />
                     Edit Addresses
                  </DropdownMenuItem>
               </Link>
               <Link href="/profile/edit">
                  <DropdownMenuItem className="flex gap-2">
                     <UserIcon className="h-4" />
                     Edit Profile
                  </DropdownMenuItem>
               </Link>
               <Link href="/profile/orders">
                  <DropdownMenuItem className="flex gap-2">
                     <ListOrderedIcon className="h-4" />
                     Orders
                  </DropdownMenuItem>
               </Link>
               <Link href="/profile/payments">
                  <DropdownMenuItem className="flex gap-2">
                     <CreditCardIcon className="h-4" />
                     Payments
                  </DropdownMenuItem>
               </Link>
               <DropdownMenuSeparator />
               <Link href="/cart">
                  <DropdownMenuItem className="flex gap-2">
                     <ShoppingBasketIcon className="h-4" /> Cart
                  </DropdownMenuItem>
               </Link>
               <Link href="/wishlist">
                  <DropdownMenuItem className="flex gap-2">
                     <HeartIcon className="h-4" /> Wishlist
                  </DropdownMenuItem>
               </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex gap-2" onClick={onLogout} disabled={isLoading}>
               <LogOutIcon className="h-4" /> Logout
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}