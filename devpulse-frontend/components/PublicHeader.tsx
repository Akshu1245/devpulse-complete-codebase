"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Countdown timer for announcement bar
  useEffect(() => {
    const targetDate = new Date("2026-06-15T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="fixed top-0 left-0 right-0 w-full z-50 flex flex-col">
      {/* SECTION 1 - Top Announcement Banner */}
      <div className="w-full h-10 bg-slate-900 border-b border-glass flex items-center justify-between px-6 text-xs select-none">
        <div className="flex items-center gap-1.5 text-white">
          <span>🔒</span>
          <span>
            RakshEx Launch Week — 4 Patents. 478 Tests.{" "}
            <Link href="/changelog" className="text-cyan-400 hover:underline font-bold">
              Now Live →
            </Link>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-on-surface-variant">
          <span>Ends in:</span>
          <span className="text-cyan-400 font-bold">{formatNumber(timeLeft.days)}</span>d
          <span className="text-cyan-400 font-bold">{formatNumber(timeLeft.hours)}</span>h
          <span className="text-cyan-400 font-bold">{formatNumber(timeLeft.minutes)}</span>m
          <span className="text-cyan-400 font-bold">{formatNumber(timeLeft.seconds)}</span>s
        </div>
      </div>

      {/* SECTION 2 - Navbar Redesign (Mega Menu) */}
      <header className="w-full bg-[#0f172a]/95 backdrop-blur-md border-b border-glass h-16 flex items-center relative">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-400/30 rounded flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                <span className="material-symbols-outlined text-cyan-400 font-bold text-base">
                  shield
                </span>
              </div>
              <span className="text-white font-headline-md text-headline-md font-bold tracking-tight">
                RakshEx
              </span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-6">
              {/* Products Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("products")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-on-surface-variant hover:text-white transition-colors py-5 text-sm font-semibold focus:outline-none">
                  Products
                  <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                </button>
                {activeDropdown === "products" && (
                  <div className="absolute top-[52px] left-0 w-[640px] bg-slate-900 border border-glass rounded-lg shadow-2xl p-6 grid grid-cols-2 gap-6 z-50">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                      <Link
                        href="/scanning"
                        className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors group"
                      >
                        <span className="text-xl">🔒</span>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                            Security Scanner
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                            87-payload injection library, OWASP Top 10
                          </p>
                        </div>
                      </Link>
                      <Link
                        href="/kill-switch"
                        className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors group"
                      >
                        <span className="text-xl">⚡</span>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                            AgentGuard Kill Switch
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                            Autonomous circuit breaker for AI agents
                          </p>
                        </div>
                      </Link>
                      <Link
                        href="/shadow-apis"
                        className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors group"
                      >
                        <span className="text-xl">👻</span>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                            Shadow API Discovery
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                            Find undocumented endpoints before attackers do
                          </p>
                        </div>
                      </Link>
                      <Link
                        href="/scanning"
                        className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors group"
                      >
                        <span className="text-xl">🔑</span>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                            Credential Scanner
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                            10-rule secret detection, Aadhaar + PAN support
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4">
                      <Link
                        href="/token-analytics"
                        className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors group"
                      >
                        <span className="text-xl">💰</span>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                            Cost Monitor
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                            Holt-Winters forecasting, anomaly detection
                          </p>
                        </div>
                      </Link>
                      <Link
                        href="/token-analytics"
                        className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors group"
                      >
                        <span className="text-xl">🧠</span>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                            Thinking Token Attribution
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                            World-first reasoning token isolation
                          </p>
                        </div>
                      </Link>
                      <Link
                        href="/compliance"
                        className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors group"
                      >
                        <span className="text-xl">📋</span>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                            Compliance Reports
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                            SOC2, PCI DSS, OWASP. One-click PDF export
                          </p>
                        </div>
                      </Link>
                      <Link
                        href="/playbooks"
                        className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors group"
                      >
                        <span className="text-xl">🤖</span>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                            MCP Governance
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1 leading-normal">
                            Tool registry, risk scoring, approval workflows
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Compare Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("compare")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-on-surface-variant hover:text-white transition-colors py-5 text-sm font-semibold focus:outline-none">
                  Compare
                  <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                </button>
                {activeDropdown === "compare" && (
                  <div className="absolute top-[52px] left-0 w-56 bg-slate-900 border border-glass rounded-lg shadow-2xl p-3 flex flex-col gap-1 z-50">
                    <Link
                      href="/compare/snyk"
                      className="px-3 py-2 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                      RakshEx vs Snyk
                    </Link>
                    <Link
                      href="/compare/datadog"
                      className="px-3 py-2 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                      RakshEx vs Datadog
                    </Link>
                    <Link
                      href="/compare/traceable-ai"
                      className="px-3 py-2 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                      RakshEx vs Traceable AI
                    </Link>
                    <Link
                      href="/compare/salt-security"
                      className="px-3 py-2 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                      RakshEx vs Salt Security
                    </Link>
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("resources")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-on-surface-variant hover:text-white transition-colors py-5 text-sm font-semibold focus:outline-none">
                  Resources
                  <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                </button>
                {activeDropdown === "resources" && (
                  <div className="absolute top-[52px] left-0 w-48 bg-slate-900 border border-glass rounded-lg shadow-2xl p-3 flex flex-col gap-1 z-50">
                    <Link
                      href="/blog"
                      className="px-3 py-2 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                      Blog
                    </Link>
                    <Link
                      href="/docs"
                      className="px-3 py-2 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                      Documentation
                    </Link>
                    <Link
                      href="/changelog"
                      className="px-3 py-2 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                      Changelog
                    </Link>
                    <Link
                      href="/roi-calculator"
                      className="px-3 py-2 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                      ROI Calculator
                    </Link>
                    <Link
                      href="/faq"
                      className="px-3 py-2 text-sm text-on-surface-variant hover:text-white hover:bg-white/5 rounded transition-colors"
                    >
                      FAQ
                    </Link>
                  </div>
                )}
              </div>

              {/* Pricing Link */}
              <Link
                href="/pricing"
                className="text-on-surface-variant hover:text-white transition-colors py-5 text-sm font-semibold"
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Social Icons + Auth */}
          <div className="hidden md:flex items-center gap-5">
            {/* Discord */}
            <a
              href="https://discord.gg/rakshexhq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-white transition-colors flex items-center"
              title="Join Discord"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.89-.66,1.75-1.37,2.58-2.1a75.43,75.43,0,0,0,93.18,0c.84.73,1.69,1.44,2.58,2.1a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,48.24,123.63,25.41,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.88,46,53.88,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.12,46,96.12,53,91,65.69,84.69,65.69Z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/Akshu1245/devpulse-complete-codebase"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-white transition-colors flex items-center"
              title="View on GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
            </a>

            <Link
              href="/login"
              className="text-on-surface-variant hover:text-white transition-colors px-3 py-2 text-sm font-semibold"
            >
              Sign In
            </Link>
            <Link
              href={`${APP_URL}/api/oauth/login`}
              className="px-4 py-2 bg-cyan-500 text-[#0f172a] hover:bg-cyan-400 font-bold rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all text-sm"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile hamburger icon */}
          <button
            className="md:hidden text-on-surface-variant hover:text-white p-2 focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0f172a] border-b border-glass px-6 py-6 space-y-4 flex flex-col z-50 max-h-[80vh] overflow-y-auto">
            <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Products</p>
            <div className="grid grid-cols-1 gap-2 pl-2">
              <Link
                href="/scanning"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-on-surface-variant hover:text-white flex items-center gap-2"
              >
                <span>🔒</span> Security Scanner
              </Link>
              <Link
                href="/kill-switch"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-on-surface-variant hover:text-white flex items-center gap-2"
              >
                <span>⚡</span> AgentGuard Kill Switch
              </Link>
              <Link
                href="/shadow-apis"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-on-surface-variant hover:text-white flex items-center gap-2"
              >
                <span>👻</span> Shadow API Discovery
              </Link>
              <Link
                href="/token-analytics"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-on-surface-variant hover:text-white flex items-center gap-2"
              >
                <span>💰</span> Cost Monitor
              </Link>
              <Link
                href="/compliance"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-on-surface-variant hover:text-white flex items-center gap-2"
              >
                <span>📋</span> Compliance Reports
              </Link>
            </div>

            <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase pt-2">
              Compare
            </p>
            <div className="grid grid-cols-1 gap-2 pl-2">
              <Link
                href="/compare/snyk"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-on-surface-variant hover:text-white"
              >
                vs Snyk
              </Link>
              <Link
                href="/compare/datadog"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-on-surface-variant hover:text-white"
              >
                vs Datadog
              </Link>
            </div>

            <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase pt-2">
              Resources
            </p>
            <div className="grid grid-cols-1 gap-2 pl-2">
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-on-surface-variant hover:text-white"
              >
                Blog
              </Link>
              <Link
                href="/docs"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-on-surface-variant hover:text-white"
              >
                Documentation
              </Link>
              <Link
                href="/roi-calculator"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-on-surface-variant hover:text-white"
              >
                ROI Calculator
              </Link>
            </div>

            <div className="border-t border-glass pt-4 flex flex-col gap-3">
              <Link
                href="/login"
                className="text-on-surface-variant hover:text-white text-sm font-semibold text-center py-2"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href={`${APP_URL}/api/oauth/login`}
                className="bg-cyan-500 text-[#0f172a] text-center font-bold px-4 py-2 rounded"
                onClick={() => setMobileOpen(false)}
              >
                Start Free
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
