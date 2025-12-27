"use client"

import { Suspense } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { LandingPage } from "@/components/landing-page"
import { MainInterface } from "@/components/main-interface"

function App() {
  const { user } = useAuth()

  return user ? <MainInterface /> : <LandingPage />
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
