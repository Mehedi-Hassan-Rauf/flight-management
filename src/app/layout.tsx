import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { metadata } from './metadata'
import { Navigation } from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Navigation />
        <main className="container mx-auto mt-8">
          {children}
        </main>
      </body>
    </html>
  )
}

