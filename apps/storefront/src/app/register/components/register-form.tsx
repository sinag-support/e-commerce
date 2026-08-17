'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createBrowserClient } from '@supabase/ssr'
import { isEmailValid } from '@persepolis/regex'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { isPasswordValid, passwordRequirements } from '@/lib/validation'

export function RegisterForm() {
   const router = useRouter()
   const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   )
   const [isLoading, setIsLoading] = useState(false)
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [name, setName] = useState('')
   const [error, setError] = useState('')
   const [emailError, setEmailError] = useState('')
   const [touched, setTouched] = useState({
      name: false,
      email: false,
      password: false,
   })

   const passwordChecks = passwordRequirements.map((req) => ({
      ...req,
      isValid: req.validate(password),
   }))

   const allValid = isPasswordValid(password)

   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setEmail(value)
      if (value && !isEmailValid(value)) {
         setEmailError('Please enter a valid email address')
      } else {
         setEmailError('')
      }
   }

   async function onSubmit(e: React.FormEvent) {
      e.preventDefault()
      setIsLoading(true)
      setError('')

      if (!name.trim()) {
         setError('Please enter your full name')
         setIsLoading(false)
         return
      }

      if (!isEmailValid(email)) {
         setEmailError('Please enter a valid email address')
         setIsLoading(false)
         return
      }

      if (!allValid) {
         setError('Please meet all password requirements')
         setIsLoading(false)
         return
      }

      try {
         const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
               data: {
                  name,
               },
            },
         })

         if (error) {
            setError(error.message)
            setIsLoading(false)
            return
         }

         if (data.user) {
            if (data.user.confirmed_at) {
               router.push('/login?registered=true')
            } else {
               router.push('/login?confirm=true')
            }
         }
      } catch (error) {
         setError('An unexpected error occurred')
         console.error(error)
      } finally {
         setIsLoading(false)
      }
   }

   async function signInWithGoogle() {
      setIsLoading(true)
      setError('')

      try {
         const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
               redirectTo: `${window.location.origin}/api/auth/callback`,
            },
         })

         if (error) {
            setError(error.message)
            setIsLoading(false)
         }
      } catch (error) {
         setError('An unexpected error occurred')
         console.error(error)
         setIsLoading(false)
      }
   }

   return (
      <div className="grid gap-6">
         <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
               <Label htmlFor="name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
               </Label>
               <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  disabled={isLoading}
                  className={touched.name && !name.trim() ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
               />
               {touched.name && !name.trim() && (
                  <p className="text-sm text-destructive">Full name is required</p>
               )}
            </div>

            <div className="grid gap-2">
               <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-destructive">*</span>
               </Label>
               <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  disabled={isLoading}
                  className={touched.email && emailError ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
               />
               {touched.email && emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
               )}
            </div>

            <div className="grid gap-2">
               <Label htmlFor="password" className="text-sm font-medium">
                  Password <span className="text-destructive">*</span>
               </Label>
               <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  disabled={isLoading}
                  className={touched.password && !allValid ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
               />
            </div>

            {touched.password && (
               <div className="grid gap-1.5 rounded-lg bg-muted p-3">
                  {passwordChecks.map((check) => (
                     <div
                        key={check.id}
                        className="flex items-center gap-2 text-sm"
                     >
                        {check.isValid ? (
                           <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                           <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className={check.isValid ? 'text-success' : 'text-muted-foreground'}>
                           {check.label}
                        </span>
                     </div>
                  ))}
               </div>
            )}

            {error && (
               <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
               type="submit"
               disabled={isLoading || !!emailError || !allValid || !name.trim()}
               className="w-full"
            >
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Create Account
            </Button>
         </form>

         <div className="relative">
            <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
               </span>
            </div>
         </div>

         <Button
            type="button"
            variant="outline"
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="w-full"
         >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
               <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
               />
               <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
               />
               <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
               />
               <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
               />
            </svg>
            Google
         </Button>
      </div>
   )
}