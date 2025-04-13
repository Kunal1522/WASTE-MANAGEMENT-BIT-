import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '../components/Navbar'
import { UserSync } from '../components/UserSync'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Waste Management App',
  description: 'Track and collect waste for environmental impact',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <UserSync />
          <main className="pt-16"> {/* Add padding to account for fixed navbar */}
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}