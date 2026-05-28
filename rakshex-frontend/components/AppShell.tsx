"use client";

import { useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { PublicHeader } from "@/components/PublicHeader";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/reset-password",
  "/privacy",
  "/terms",
  "/cookies",
  "/pricing",
  "/demo",
  "/blog",
  "/blog/helicone-alternative",
  "/blog/portkey-alternative",
  "/blog/lakera-alternative",
  "/compare",
  "/compare/helicone",
  "/compare/portkey",
  "/compare/lakera",
  "/compare/langsmith",
  "/compare/datadog",
  "/compare/snyk",
  "/roi-calculator",
  "/features",
  "/about",
  "/faq",
  "/trust",
  "/changelog",
  "/integrations",
  "/partners",
  "/open-source",
  "/status",
  "/solutions/fintech",
  "/solutions/healthcare",
  "/solutions/enterprise",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => p === pathname || (p !== "/" && pathname.startsWith(p)));
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setCollapsed(true);
    }
  }, []);

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  if (isPublicPath(pathname)) {
    return (
      <>
        <PublicHeader />
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] flex text-[#e6e0e9]">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 ${
          isMounted ? "transition-all duration-300" : ""
        } ${collapsed ? "lg:pl-20" : "lg:pl-64"}`}
      >
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#0b0d12]/80 backdrop-blur-md border-b border-outline-variant/10 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-on-surface-variant hover:text-on-surface p-1"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="font-display-lg text-primary text-md">RakshEx</span>
        </div>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
