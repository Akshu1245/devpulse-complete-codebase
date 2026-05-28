"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderOpen,
  Search,
  Shield,
  Zap,
  Ghost,
  Users,
  TrendingUp,
  Coins,
  ClipboardList,
  Settings,
  CreditCard,
  Upload,
  Wrench,
  Brain,
  Gauge,
  BookOpen,
  BarChart3,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group?: string;
}

const navItems: NavItem[] = [
  // Main
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "main" },
  { label: "Collections", href: "/collections", icon: FolderOpen, group: "main" },
  { label: "Import", href: "/import", icon: Upload, group: "main" },

  // Security
  { label: "Scanning", href: "/scanning", icon: Search, group: "security" },
  { label: "Compliance", href: "/compliance", icon: Shield, group: "security" },
  { label: "Kill Switch", href: "/kill-switch", icon: Zap, group: "security" },
  { label: "Shadow APIs", href: "/shadow-apis", icon: Ghost, group: "security" },
  { label: "Playbooks", href: "/playbooks", icon: BookOpen, group: "security" },

  // AI Governance
  { label: "Agent Drift", href: "/agent-drift", icon: Brain, group: "ai" },
  { label: "Analytics", href: "/analytics", icon: TrendingUp, group: "ai" },
  { label: "Token Analytics", href: "/token-analytics", icon: Coins, group: "ai" },
  { label: "Metrics", href: "/metrics", icon: BarChart3, group: "ai" },
  { label: "Benchmark", href: "/benchmark", icon: Gauge, group: "ai" },

  // Account
  { label: "Team", href: "/team", icon: Users, group: "account" },
  { label: "Audit Log", href: "/audit-log", icon: ClipboardList, group: "account" },
  { label: "Settings", href: "/settings", icon: Settings, group: "account" },
  { label: "Billing", href: "/billing", icon: CreditCard, group: "account" },
  { label: "Admin", href: "/admin", icon: Wrench, group: "account" },
];

const GROUP_LABELS: Record<string, string> = {
  main: "Overview",
  security: "Security",
  ai: "AI Governance",
  account: "Account",
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const groups = ["main", "security", "ai", "account"];

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-surface-container-low/90 backdrop-blur-2xl border-r border-outline-variant/20 z-40 flex flex-col py-6 gap-container-gap transform transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${collapsed ? "lg:w-20 px-2 lg:px-3" : "lg:w-64 px-4"} w-64`}
      >
        {/* Logo and Toggle */}
        <div
          className={`flex items-center justify-between mb-6 border-b border-outline-variant/10 pb-4 ${collapsed ? "lg:flex-col lg:gap-4 lg:items-center" : "px-2"}`}
        >
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 ${collapsed ? "lg:justify-center" : ""}`}
          >
            <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-on-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                security
              </span>
            </div>
            <div className={collapsed ? "lg:hidden" : ""}>
              <h1 className="font-headline-lg text-headline-lg text-primary leading-none">
                RakshEx AI
              </h1>
              <p className="font-label-caps text-[9px] text-on-surface-variant tracking-[0.2em] mt-1">
                System Alpha-9
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden text-on-surface-variant hover:text-on-surface p-1"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 p-1.5 rounded transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto space-y-1">
          {groups.map((group) => {
            const groupItems = navItems.filter((i) => i.group === group);
            return (
              <div key={group} className="mb-4">
                {collapsed ? (
                  group !== groups[0] && (
                    <div className="hidden lg:block border-t border-outline-variant/10 my-3 mx-2" />
                  )
                ) : (
                  <p className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.2em] px-3 mb-2 uppercase">
                    {GROUP_LABELS[group]}
                  </p>
                )}
                <div className="space-y-0.5">
                  {groupItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 active:translate-x-1
                          ${
                            active
                              ? "bg-primary-container/20 text-primary border-l-2 border-primary font-bold"
                              : "text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface"
                          } ${collapsed ? "lg:justify-center lg:px-2 lg:gap-0" : ""}`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${active ? "text-primary" : "text-on-surface-variant"}`}
                        />
                        <span
                          className={`font-body-md text-sm transition-opacity duration-200 ${collapsed ? "lg:hidden" : ""}`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-outline-variant/10 pt-4 px-2">
          {user ? (
            <div
              className={`flex items-center gap-3 ${collapsed ? "lg:flex-col lg:items-center lg:gap-2" : ""}`}
            >
              <div className="w-8 h-8 rounded bg-primary-container/30 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {(user.name || user.email || "U")[0].toUpperCase()}
              </div>
              <div className={`flex-1 min-w-0 ${collapsed ? "lg:hidden" : ""}`}>
                <p className="text-xs font-semibold text-on-surface truncate">
                  {user.name || user.email}
                </p>
                <p className="text-[10px] text-primary tracking-wider uppercase">
                  {user.plan || "free"} plan
                </p>
              </div>
              <button
                onClick={logout}
                className="text-on-surface-variant hover:text-error transition-colors p-1 shrink-0"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`text-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 ${collapsed ? "lg:justify-center" : ""}`}
              title="Sign in"
            >
              <span className={collapsed ? "lg:hidden" : ""}>Sign in</span>{" "}
              <span className="text-primary">→</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
