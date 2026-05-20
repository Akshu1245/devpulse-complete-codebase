"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-outline-variant/10 bg-[#0b0d12]/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-display-lg text-xl text-primary tracking-tight font-bold hover:shadow-[0_0_15px_rgba(207,188,255,0.2)] transition-shadow"
          >
            DevPulse
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-on-surface text-sm font-medium transition-colors font-body-md"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/demo"
              className="text-tertiary hover:text-tertiary/80 text-sm font-medium transition-colors font-body-md"
            >
              Live Demo
            </Link>
            <Link
              href="/login"
              className="bg-primary hover:bg-primary/90 text-on-primary text-sm font-bold px-4 py-2 rounded font-body-md transition-all shadow-[0_0_12px_rgba(207,188,255,0.25)]"
            >
              Sign In
            </Link>
          </nav>

          <button
            className="md:hidden text-on-surface-variant hover:text-on-surface p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant/10 px-4 py-4 space-y-3 bg-[#0b0d12]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-on-surface-variant hover:text-on-surface font-medium font-body-md"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/demo"
            className="block text-tertiary font-medium font-body-md"
            onClick={() => setMobileOpen(false)}
          >
            Live Demo
          </Link>
          <Link
            href="/login"
            className="block bg-primary text-on-primary text-center font-bold px-4 py-2 rounded font-body-md"
            onClick={() => setMobileOpen(false)}
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
