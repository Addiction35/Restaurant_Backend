import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { POSProvider } from "@/context/pos-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CHILI POS - Restaurant Point of Sale System",
  description: "A modern restaurant point of sale system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <POSProvider>
          {children}
          <Toaster />
        </POSProvider>
      </body>
    </html>
  )
}



import './globals.css'