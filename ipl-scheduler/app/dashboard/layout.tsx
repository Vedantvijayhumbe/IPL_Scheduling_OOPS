"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { BirdIcon as Cricket, Calendar, Users, MapPin, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Check if user is authenticated (in a real app, this would be more robust)
  useEffect(() => {
    // This is just a dummy check for demonstration
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true") // For demo purposes
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Cricket className="h-5 w-5" /> },
    { href: "/dashboard/teams", label: "Teams", icon: <Users className="h-5 w-5" /> },
    { href: "/dashboard/venues", label: "Venues", icon: <MapPin className="h-5 w-5" /> },
    { href: "/dashboard/schedule", label: "Schedule", icon: <Calendar className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Cricket className="h-6 w-6" />
            <span>IPL Scheduler</span>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-5 mx-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t p-4 flex flex-col gap-4 bg-background">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4 border-t">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6">{children}</main>

      {/* Footer */}
      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} IPL Scheduler. All rights reserved.
      </footer>
    </div>
  )
}
