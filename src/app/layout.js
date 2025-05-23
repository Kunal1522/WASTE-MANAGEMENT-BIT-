import { Poppins } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '../components/Navbar'
import { UserSync } from '../components/UserSync'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Waste Management App',
  description: 'Track and collect waste for environmental impact',
  icons: {
    icon: '/tree.png', // or '/my-icon.png'
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={poppins.className}>
          <Navbar />
          <UserSync />
          <main className="pt-24"> {/* Increased padding to ensure content appears below the navbar */}
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}