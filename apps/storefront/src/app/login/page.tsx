import config from '@/config/site'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { UserAuthForm } from './components/user-auth-form'
import { ThemeToggle } from '@/components/theme-toggle'

export const metadata: Metadata = {
   title: 'Sign In - SINAG',
   description: 'Sign in to your SINAG account',
}

export default function LoginPage() {
   return (
      <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
         <div className="relative hidden h-full flex-col bg-emerald-950 p-10 text-white lg:flex dark:border-r">
            <div className="relative z-20 flex items-center justify-between">
               <div className="flex items-center text-lg font-medium">
                  <Image
                     src="/sinag.png"
                     alt="SINAG Logo"
                     width={40}
                     height={40}
                     className="mr-2"
                  />
                  {config.name}
               </div>
               <ThemeToggle />
            </div>
            <div className="relative z-20 mt-auto">
               <div className="space-y-4">
                  <h2 className="text-4xl font-light tracking-tight">
                     Welcome to SINAG
                  </h2>
                  <p className="text-white/70 text-base max-w-sm leading-relaxed">
                     Sign in to access your account and manage your orders.
                  </p>
               </div>
            </div>
            <div className="relative z-20 mt-8 text-xs text-white/30">
               © {new Date().getFullYear()} SINAG. All rights reserved.
            </div>
         </div>
         <div className="flex h-screen items-center justify-center p-8 lg:p-12">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
               <div className="flex items-center justify-between lg:hidden">
                  <div className="flex items-center gap-2">
                     <Image
                        src="/sinag.png"
                        alt="SINAG Logo"
                        width={32}
                        height={32}
                     />
                     <span className="text-xl font-semibold">{config.name}</span>
                  </div>
                  <ThemeToggle />
               </div>
               <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                     Welcome back
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     Sign in to your account to continue
                  </p>
               </div>
               <UserAuthForm />
               <p className="px-8 text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-medium text-emerald-700 hover:underline">
                     Sign up
                  </Link>
               </p>
            </div>
         </div>
      </div>
   )
}