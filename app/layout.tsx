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
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/images/logo-magal.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/logo-magal.jpg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/images/logo-magal.jpg",
        type: "image/png",
      },
    ],
    apple: "/images/logo-magal.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Magal Touba",
  },
}

export const viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Magal Touba" />
        <meta name="apple-mobile-web-app-title" content="Magal Touba" />
        <meta name="msapplication-starturl" content="/" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                      console.log('[v0] Service Worker registered:', registration.scope);
                    })
                    .catch((error) => {
                      console.log('[v0] Service Worker registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
