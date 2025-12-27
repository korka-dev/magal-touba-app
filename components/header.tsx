"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { LogOut, User, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { AuthDialog } from "./auth-dialog"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {onMenuClick && (
              <Button variant="ghost" size="sm" onClick={onMenuClick} className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-primary leading-tight">{"Magal Touba 2025"}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{"Guide du Pèlerin"}</p>
            </div>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{"Mon compte"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <span className="text-xs text-muted-foreground">
                    {user.role === "pelerin"
                      ? "Pèlerin"
                      : user.role === "responsable"
                        ? "Responsable"
                        : "Administrateur"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {"Déconnexion"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setAuthDialogOpen(true)} size="sm">
              {"Connexion"}
            </Button>
          )}
        </div>
      </header>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  )
}
