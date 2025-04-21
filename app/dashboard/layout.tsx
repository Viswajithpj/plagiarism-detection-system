"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, BookOpen, Users, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  if (!user) return null

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Assignments", href: "/dashboard/assignments", icon: FileText },
    { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
    ...(user.is_teacher ? [{ name: "Students", href: "/dashboard/students", icon: Users }] : []),
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-800 text-white">
        <h1 className="text-xl font-bold">PlagiarismDetect</h1>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-slate-800 text-white w-64 flex-shrink-0 flex flex-col",
          "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4 border-b border-slate-700 hidden md:block">
          <h1 className="text-xl font-bold">PlagiarismDetect</h1>
          <p className="text-sm text-slate-400">Academic integrity tool</p>
        </div>

        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-lg font-semibold">
              {user.first_name?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{user.first_name ? `${user.first_name} ${user.last_name}` : user.username}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-slate-700 transition-colors"
            >
              <item.icon className="h-5 w-5 text-slate-400" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-6 bg-slate-50">{children}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} />}
    </div>
  )
}
