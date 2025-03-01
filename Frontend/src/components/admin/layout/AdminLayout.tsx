"use client"

import type React from "react"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiFilm,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiBell,
} from "react-icons/fi"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: FiHome },
    { name: "Movies", href: "/admin/movies", icon: FiFilm },
    { name: "Users", href: "/admin/users", icon: FiUsers },
    { name: "Analytics", href: "/admin/analytics", icon: FiBarChart2 },
    { name: "Settings", href: "/admin/settings", icon: FiSettings },
  ]

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-900 p-4 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
              <span className="text-xl font-bold">MovieAdmin</span>
            </Link>
            <button
              className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-8 flex-1 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-800/50 to-pink-800/50 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive(item.href) ? "text-purple-400" : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto border-t border-gray-800 pt-4">
            <Link
              to="/logout"
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <FiLogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-white" />
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center md:hidden">
              <button type="button" className="text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
                <FiMenu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-1 justify-end md:justify-between">
              <div className="hidden md:block">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-md border-0 bg-gray-800 py-1.5 pl-10 pr-3 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white">
                  <FiBell className="h-6 w-6" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-xs text-white">
                    3
                  </span>
                </button>
                <div className="relative">
                  <button className="flex rounded-full bg-gray-800 text-sm">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                      <span className="font-medium text-white">A</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>

        {/* Mobile bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-800 md:hidden">
          <div className="flex items-center justify-around p-3">
            {navigation.slice(0, 4).map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center ${isActive(item.href) ? "text-purple-400" : "text-gray-400"}`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="mt-1 text-xs">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

