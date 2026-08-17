'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PasswordRequirementsProps {
   password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
   const [requirements, setRequirements] = useState({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
   })

   useEffect(() => {
      setRequirements({
         length: password.length >= 8,
         uppercase: /[A-Z]/.test(password),
         lowercase: /[a-z]/.test(password),
         number: /[0-9]/.test(password),
         special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      })
   }, [password])

   const requirementsList = [
      { key: 'length', label: 'At least 8 characters' },
      { key: 'uppercase', label: 'One uppercase letter' },
      { key: 'lowercase', label: 'One lowercase letter' },
      { key: 'number', label: 'One number' },
      { key: 'special', label: 'One special character (!@#$%^&* etc.)' },
   ]

   return (
      <div className="space-y-2 mt-2">
         {requirementsList.map((req) => {
            const met = requirements[req.key as keyof typeof requirements]
            return (
               <div
                  key={req.key}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                     met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                  }`}
               >
                  {met ? (
                     <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                     <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{req.label}</span>
               </div>
            )
         })}
      </div>
   )
}