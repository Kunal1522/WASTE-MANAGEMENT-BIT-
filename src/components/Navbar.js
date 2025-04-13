'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'

export default function Navbar() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()

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
    <nav className="fixed w-full top-0 bg-white shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-green-600">
                WasteManage
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.path
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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
      <div className="sm:hidden hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === item.path
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-4 pb-3 border-t border-gray-200">
            {isSignedIn ? (
              <div className="px-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="px-4">
                <SignInButton mode="modal">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md w-full">
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
