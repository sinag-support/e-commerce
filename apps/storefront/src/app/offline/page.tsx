import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
         <h1 className="text-4xl font-bold mb-4">You're Offline</h1>
         <p className="text-muted-foreground mb-8 max-w-md">
            It looks like you're not connected to the internet. 
            Please check your connection and try again.
         </p>
         <Button asChild>
            <Link href="/">Try Again</Link>
         </Button>
      </div>
   )
}