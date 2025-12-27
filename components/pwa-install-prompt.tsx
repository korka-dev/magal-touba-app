"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, X } from "lucide-react"
import Image from "next/image"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return
    }

    // Check if user has previously dismissed the prompt
    const hasUserDismissed = localStorage.getItem("pwa-prompt-dismissed")
    if (hasUserDismissed) {
      return
    }

    const handler = (e: Event) => {
      // Prevent the default mini-infobar from appearing
      e.preventDefault()
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show the custom install prompt
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("[v0] User accepted the install prompt")
    } else {
      console.log("[v0] User dismissed the install prompt")
    }

    // Clear the deferredPrompt for next time
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember that user dismissed the prompt
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-slide-up">
      <Card className="bg-white dark:bg-gray-800 shadow-xl border-2 border-green-600">
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image src="/images/logo-magal.jpg" alt="Logo Magal" fill className="rounded-lg object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Télécharger l'App</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={handleDismiss}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Installez l'application de Magal de Touba sur votre appareil pour un accès rapide et une expérience optimale, même hors
                ligne.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Installer
                </Button>
                <Button variant="outline" onClick={handleDismiss} size="sm" className="flex-1 bg-transparent">
                  Plus tard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
