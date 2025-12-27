"use client"

import { Suspense } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { LandingPage } from "@/components/landing-page"
import { MainInterface } from "@/components/main-interface"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

function App() {
  const { user } = useAuth()

  return (
    <>
      <PWAInstallPrompt />
      {user ? <MainInterface /> : <LandingPage />}
    </>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Suspense>
  )
}
