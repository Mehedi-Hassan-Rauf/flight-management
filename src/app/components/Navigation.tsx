'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    router.push('/')
  }
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {
          isLoggedIn ? (
            <Link href="/flights" className="text-xl font-bold">Flight Management</Link>
          ) : (
            <Link href="/" className="text-xl font-bold">Flight Management</Link>
          )
        }
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              {/* <Link href="/flights" className="hover:text-gray-300">Flights</Link> */}
              <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-gray-300">Login</Link>
              <Link href="/auth/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

