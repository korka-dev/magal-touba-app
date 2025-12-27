"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Menu } from "lucide-react"
import Image from "next/image"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo + Titre */}
          <div className="flex items-center gap-3">
            {/* Logo circulaire */}
            <div className="relative h-10 w-10">
              <Image
                src="/images/logo-magal.png" // Remplacez par votre chemin d'image
                alt="Logo Magal Touba"
                fill
                className="rounded-full object-cover border-2 border-primary"
              />
            </div>

            {/* Texte */}
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-primary">Magal bu Touba</h1>
              <p className="text-xs text-muted-foreground">Guide du Pèlerin</p>
            </div>
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                  <Menu className="h-4 w-4 sm:hidden" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.phone}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Message de bienvenue */}
{user && (
  <div className="bg-primary/10 py-3 border-b">
    <div className="container mx-auto px-4">
      <p className="text-sm text-primary text-center">
        Dalal ak jàmm {user.name}, di la ñaanal Magal bu jàmm te bu barkeel.
      </p>
    </div>
  </div>
)}

    </>
  )
}
