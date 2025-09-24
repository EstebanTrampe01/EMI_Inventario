/**
 * DashboardLayout - Template component for the main dashboard layout structure
 *
 * A comprehensive layout template that provides the complete dashboard structure
 * including sidebar navigation, header with notifications, and main content area.
 * Features responsive design with mobile navigation support and system status
 * indicators throughout the interface.
 *
 * @param props - Component props
 * @param props.children - Content to be rendered in the main content area
 *
 * @returns A complete dashboard layout with sidebar, header, and content area
 *
 * @example
 * ```tsx
 * <DashboardLayout>
 *   <div>
 *     <h1>Dashboard Content</h1>
 *     <p>Your dashboard widgets and components go here</p>
 *   </div>
 * </DashboardLayout>
 * ```
 *
 * @features
 * - Responsive sidebar navigation with predefined menu items
 * - Mobile-friendly overlay navigation
 * - Header with system status indicators and notifications
 * - Dark/light mode toggle with persistent theme preference
 * - Notification badge with alert count
 * - Consistent spacing and typography
 * - Automatic active state management for navigation items
 */

"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Bell, Menu, Home, Leaf, Database } from "lucide-react";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import ThemeToggle from "@/components/atoms/ThemeToggle";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, User, LogIn } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Obtener información de autenticación con next-auth
  const { data: session, status: sessionStatus } = useSession();

  // Define sidebar items directly in the client component
  const sidebarItems = [
    { id: "overview", label: "Información", icon: Home, href: "/dashboard" },
    /*{
      id: "environmental",
      label: "Histórico",
      icon: Leaf,
      href: "/dashboard/history",
    },
    { id: "alerts", label: "Alertas", icon: Bell, href: "/dashboard/alerts" },*/
  ];

  return (
    <div className="flex h-screen bg-default-50 dark:bg-default-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-default-100/50 dark:bg-default-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}