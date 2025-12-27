import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Magal de Touba - Guide du Pèlerin",
  description: "Application web pour accompagner les pèlerins pendant le Magal de Touba",
  generator: "korka-dev",
  icons: {
    icon: [
      {
        url: "/public/images/logo-magal.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/public/images/logo-magal.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/public/images/logo-magal.png",
        type: "image/png",
      },
    ],
    apple: "/public/images/logo-magal.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
