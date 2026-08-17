import { ModalProvider } from '@/providers/modal-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { UserContextProvider } from '@/state/User'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
   title: 'SINAG',
   description: 'E-Commerce Store',
   keywords: ['E-Commerce', 'Store', 'Shop', 'Sinag', 'SINAG'],
   authors: [{ name: 'Sinag', url: 'https://github.com/sinag-support' }],
   creator: 'Sinag',
   publisher: 'Sinag',
}

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className={inter.className} suppressHydrationWarning>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
               <UserContextProvider>
                  <ToastProvider />
                  <ModalProvider />
                  {children}
               </UserContextProvider>
            </ThemeProvider>
         </body>
      </html>
   )
}