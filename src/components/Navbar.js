'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'

export default function Navbar() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Collect Waste', path: '/collect' },
    { name: 'Report Waste', path: '/report' }
  ]

  // Save user to DB on login
  useEffect(() => {
    if (isSignedIn && user) {
      const clerkId = user.id
      const name = user.fullName || `${user.firstName} ${user.lastName}`
      const email = user.emailAddresses[0]?.emailAddress

      fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId, name, email })
      })
        .then(res => res.json())
        .then(data => console.log('User synced:', data))
        .catch(err => console.error('Error syncing user:', err))
    }
  }, [isSignedIn, user])

  return (
    <nav className="fixed w-full top-0 bg-gradient-to-r from-green-700 to-green-600 shadow-lg z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                </svg>
                WasteManage
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.path
                      ? 'border-white text-white'
                      : 'border-transparent text-green-100 hover:text-white hover:border-green-200'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isSignedIn ? (
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "border-2 border-white"
                  }
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-white hover:bg-green-100 text-green-700 font-medium py-2 px-4 rounded-md transition-colors duration-200">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-green-100 hover:text-white hover:bg-green-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 bg-green-800">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === item.path
                  ? 'bg-green-900 border-white text-white'
                  : 'border-transparent text-green-100 hover:bg-green-700 hover:border-green-300 hover:text-white'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-4 pb-3 border-t border-green-700">
            {isSignedIn ? (
              <div className="px-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="px-4">
                <SignInButton mode="modal">
                  <button className="bg-white hover:bg-green-100 text-green-700 font-medium py-2 px-4 rounded-md w-full transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
