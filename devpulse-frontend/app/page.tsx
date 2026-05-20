"use client";
import Link from "next/link";
import { useEffect } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function JsonLdInjector() {
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://devpulse.in/#organization",
          name: "DevPulse",
          url: "https://devpulse.in",
          logo: "https://devpulse.in/logo.png",
          description:
            "AI Runtime Governance Platform — security scanning, cost monitoring, and compliance for production AI agents.",
          sameAs: [
            "https://twitter.com/devpulsehq",
            "https://github.com/Akshu1245/devpulse-complete-codebase",
          ],
        },
        {
          "@type": "WebSite",
          "@id": "https://devpulse.in/#website",
          url: "https://devpulse.in",
          name: "DevPulse",
          publisher: { "@id": "https://devpulse.in/#organization" },
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://devpulse.in/#product",
          name: "DevPulse",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "42",
          },
          featureList: [
            "AI Agent Security Scanning",
            "LLM Cost Monitoring",
            "Shadow API Detection",
            "Prompt Injection Prevention",
            "PII Redaction",
            "Kill Switch",
          ],
        },
      ],
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  return null;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-[#e6e0e9] font-body-md relative overflow-hidden">
      <JsonLdInjector />
      <div className="scan-line opacity-10"></div>

      {/* Hero */}
      <div className="text-center py-24 px-4 relative z-10 max-w-[1600px] mx-auto">
        <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold font-label-caps mb-6 border border-primary/20 tracking-wider">
          🚀 First AI Runtime Governance Platform Built in India
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display-lg text-on-surface tracking-tighter leading-none">
          Secure Your AI Agents
          <br />
          <span className="text-primary font-bold">Before They Cost You</span>
        </h1>
        <p className="text-md text-on-surface-variant max-w-3xl mx-auto mb-10 leading-relaxed">
          DevPulse scans every API endpoint, tracks every LLM token, and blocks every prompt
          injection — all inside your VS Code. Built with 4 patents, 478+ tests, and
          enterprise-grade security.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 mb-16">
          <Link
            href="/demo"
            className="bg-tertiary text-on-tertiary px-8 py-4 rounded font-bold hover:shadow-[0_0_20px_rgba(231,195,101,0.4)] transition-all text-sm cursor-pointer font-body-md"
          >
            Try Live Demo — No Signup
          </Link>
          <Link
            href={`${APP_URL}/api/oauth/login`}
            className="bg-primary text-on-primary px-8 py-4 rounded font-bold hover:shadow-[0_0_20px_rgba(207,188,255,0.4)] transition-all text-sm cursor-pointer font-body-md"
          >
            Start Free Trial
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-container-gap max-w-4xl mx-auto">
          <StatCard value="478+" label="Server Tests" />
          <StatCard value="4" label="Patents Filed" />
          <StatCard value="37" label="API Routers" />
          <StatCard value="18" label="DB Migrations" />
        </div>
      </div>

      {/* How it Works */}
      <div className="max-w-[1600px] mx-auto px-6 pb-24 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-2 font-display-lg text-on-surface">
          How It Works
        </h2>
        <p className="text-on-surface-variant text-center mb-12 max-w-2xl mx-auto text-sm">
          Three steps from zero to protected. No configuration required.
        </p>
        <div className="grid md:grid-cols-3 gap-container-gap">
          {[
            {
              step: "1",
              title: "Drop a Collection",
              desc: "Import your Postman, OpenAPI, or Bruno collection. DevPulse auto-detects every endpoint, scans for secrets, and finds vulnerabilities in 3 seconds.",
              icon: "📂",
            },
            {
              step: "2",
              title: "See Instant Findings",
              desc: "Get security scores, credential leaks, OWASP compliance mapping, and PCI DSS audit reports. All with one click. No manual configuration.",
              icon: "🔍",
            },
            {
              step: "3",
              title: "Deploy Protection",
              desc: "Install our VS Code extension or GitHub Action. Every PR gets scanned. Every LLM call gets monitored. Your entire team stays protected.",
              icon: "🛡",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="glass-card p-8 rounded-xl text-center relative overflow-hidden group"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="text-primary text-[11px] font-bold font-label-caps mb-2 tracking-wider">
                STEP {s.step}
              </div>
              <h3 className="text-lg font-bold mb-3 font-display-lg text-on-surface">{s.title}</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed font-body-md">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Differentiation */}
      <div className="py-24 px-6 relative z-10 border-t border-outline-variant/10 bg-surface-container-low/30">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 font-display-lg text-on-surface">
            What Makes DevPulse Different
          </h2>
          <p className="text-on-surface-variant text-center mb-12 max-w-2xl mx-auto text-sm">
            We combined API security + LLM cost governance into one platform. Nobody else does this.
          </p>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-data-tabular">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-on-surface-variant font-label-caps uppercase tracking-wider">
                    <th className="py-4 px-6 font-bold">Capability</th>
                    <th className="py-4 px-4 text-center font-bold">Postman</th>
                    <th className="py-4 px-4 text-center font-bold">Snyk</th>
                    <th className="py-4 px-4 text-center font-bold">Datadog</th>
                    <th className="py-4 px-6 text-center text-primary font-bold">DevPulse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {[
                    ["API Security Scanning", "❌", "❌", "❌", "✅"],
                    ["LLM Cost Tracking", "❌", "❌", "✅", "✅"],
                    ["Prompt Injection Blocking", "❌", "❌", "❌", "✅"],
                    ["PII Redaction (real-time)", "❌", "❌", "❌", "✅"],
                    ["Shadow API Detection", "❌", "❌", "❌", "✅"],
                    ["Kill Switch", "❌", "❌", "❌", "✅"],
                    ["PCI DSS Compliance", "❌", "❌", "❌", "✅"],
                    ["VS Code Integration", "❌", "❌", "❌", "✅"],
                    ["MCP Tool Governance", "❌", "❌", "❌", "✅"],
                    ["SSO + RBAC", "✅", "✅", "✅", "✅"],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-variant/30 transition-colors">
                      <td className="py-4 px-6 text-on-surface font-semibold">{row[0]}</td>
                      {row.slice(1).map((cell, j) => (
                        <td
                          key={j}
                          className={`py-4 px-4 text-center ${j === 3 ? "text-primary font-bold bg-primary/5" : ""}`}
                        >
                          {cell === "✅" ? (
                            <span className="px-2 py-0.5 rounded border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold">
                              YES
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded border border-outline-variant/20 bg-surface-container-low text-on-surface-variant text-[10px] font-bold opacity-30">
                              NO
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-[1600px] mx-auto py-24 px-6 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-2 font-display-lg text-on-surface">
          Everything You Need to Ship Secure AI
        </h2>
        <p className="text-on-surface-variant text-center mb-12 max-w-2xl mx-auto text-sm">
          One platform. Every surface covered. No stitching tools together.
        </p>
        <div className="grid md:grid-cols-3 gap-container-gap">
          <FeatureCard
            icon="🔒"
            title="Security Scanner"
            desc="87-payload prompt injection library, BOLA/IDOR detection, insecure HTTP, missing auth, secret leaks. OWASP API Top 10 + PCI DSS mapped."
          />
          <FeatureCard
            icon="💰"
            title="Cost Monitor"
            desc="Holt-Winters forecasting, anomaly detection, per-model cost breakdown. Track thinking tokens from o1/o3/Claude. Budget caps with kill switch."
          />
          <FeatureCard
            icon="👻"
            title="Shadow API Discovery"
            desc="Static route extraction for Express, FastAPI, Flask, Django, Spring Boot, Laravel. No production infrastructure needed."
          />
          <FeatureCard
            icon="🧠"
            title="Thinking Token Attribution"
            desc="First-in-world isolation of reasoning tokens. Differential computation + timing signals. Full pricing tables for all providers. Patent NHCE/DEV/2026/002."
          />
          <FeatureCard
            icon="🔑"
            title="Credential Scanning"
            desc="10-rule secret detection: AWS, GitHub, OpenAI, Anthropic, Stripe, Slack, JWT, private keys. Aadhaar & PAN detection for India compliance."
          />
          <FeatureCard
            icon="📋"
            title="Compliance Reports"
            desc="SOC2 evidence builder, PCI DSS v4.0.1 mapping, OWASP compliance scores. Export as JSON, CSV, PDF. Ready for Vanta/Drata import."
          />
          <FeatureCard
            icon="⚡"
            title="Kill Switch"
            desc="Autonomous circuit breaker. Trip on budget, anomaly, or red-team score. Sub-second response. Tested with 200→402 trip in CI."
          />
          <FeatureCard
            icon="🤖"
            title="Security Copilot"
            desc="Deterministic explainers for every finding. OWASP + PCI DSS citations. No hallucination risk. CWE-mapped remediation suggestions."
          />
          <FeatureCard
            icon="🔌"
            title="GitHub Action"
            desc="PR comments with severity badges. Exact endpoint names, one-line fixes, cost impact in USD + INR. CI/CD integration in every repo."
          />
          <FeatureCard
            icon="🏢"
            title="Enterprise SSO"
            desc="SAML 2.0 + OIDC with JIT provisioning. 4-role RBAC. Workspace isolation. Okta, Google Workspace, Microsoft Entra support."
          />
          <FeatureCard
            icon="📊"
            title="Red Team Scheduler"
            desc="Automated adversarial testing. 87-payload library, cron scheduling, security scoring, run history. Continuous posture assessment."
          />
          <FeatureCard
            icon="🌐"
            title="MCP Governance"
            desc="MCP tool registry, risk scoring, approval workflows. Tool-call allowlists per agent. Prompt injection detection on tool inputs."
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-[1200px] mx-auto px-6 pb-24 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-2 font-display-lg text-on-surface">
          Simple, Transparent Pricing
        </h2>
        <p className="text-on-surface-variant text-center mb-12 text-sm">
          Start free. Scale when you're ready. All prices in USD with INR equivalent.
        </p>
        <div className="grid md:grid-cols-3 gap-container-gap">
          <PricingCard
            plan="Free"
            price="$0"
            inr="₹0"
            features={["2 Collections", "3 Scans/day", "OWASP Top 10 audit", "Community Support"]}
            cta="Get Started"
            href="/register"
          />
          <PricingCard
            plan="Pro"
            price="$99"
            inr="≈ ₹8,299"
            popular
            features={[
              "Unlimited Collections",
              "Advanced Security Scanning",
              "Kill Switch & Budget Caps",
              "Team (5 members)",
              "Slack & Discord Alerts",
              "API Access",
            ]}
            cta="Start Free Trial"
            href="/billing"
          />
          <PricingCard
            plan="Enterprise"
            price="$499"
            inr="≈ ₹41,599"
            features={[
              "Everything in Pro",
              "SSO / SAML 2.0",
              "25 Team Members + RBAC",
              "Priority Support, 4h SLA",
              "SOC2 Evidence Builder",
              "Custom Data Retention",
            ]}
            cta="Contact Sales"
            href="/billing"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary/10 via-tertiary/5 to-[#0b0d12] py-20 px-6 text-center border-t border-b border-outline-variant/10 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display-lg text-on-surface">
          Ready to Ship Secure AI?
        </h2>
        <p className="text-md text-on-surface-variant mb-8 max-w-2xl mx-auto leading-relaxed">
          478+ tests. 4 patents. 37 API routers. One platform. Deploy in 5 minutes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/demo"
            className="bg-tertiary text-on-tertiary px-8 py-4 rounded font-bold hover:shadow-[0_0_20px_rgba(231,195,101,0.45)] transition-all text-sm cursor-pointer font-body-md"
          >
            Try Live Demo →
          </Link>
          <Link
            href={`${APP_URL}/api/oauth/login`}
            className="bg-primary text-on-primary px-8 py-4 rounded font-bold hover:shadow-[0_0_20px_rgba(207,188,255,0.45)] transition-all text-sm cursor-pointer font-body-md"
          >
            Start Free Trial
          </Link>
        </div>
      </div>

      {/* Integrations */}
      <div className="max-w-[1200px] mx-auto py-16 px-6 text-center relative z-10">
        <p className="text-on-surface-variant text-[11px] font-bold font-label-caps mb-6 uppercase tracking-widest">
          Works With Your Stack
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-on-surface-variant text-xs">
          {[
            "OpenAI",
            "Anthropic",
            "Gemini",
            "Postman",
            "VS Code",
            "GitHub",
            "Slack",
            "Express",
            "FastAPI",
            "Django",
          ].map((name) => (
            <span
              key={name}
              className="bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10 text-on-surface font-semibold font-body-md"
            >
              {name}
            </span>
          ))}
        </div>
        <Link
          href="/integrations"
          className="inline-block mt-6 text-primary text-xs font-bold font-body-md hover:underline"
        >
          View all 40+ integrations →
        </Link>
      </div>

      {/* Testimonials */}
      <div className="max-w-[1200px] mx-auto py-16 px-6 border-t border-outline-variant/10 relative z-10">
        <p className="text-on-surface-variant text-[11px] font-bold font-label-caps mb-8 text-center uppercase tracking-widest">
          What Early Users Say
        </p>
        <div className="grid md:grid-cols-3 gap-container-gap">
          {[
            {
              quote:
                "DevPulse found 3 secrets we did not know we had. One was a production Stripe key in a test collection.",
              author: "Engineering Lead",
              company: "Undisclosed Fintech Startup",
            },
            {
              quote:
                "The kill switch saved us. Our customer service bot had a bug that would have burned $12K in a weekend.",
              author: "CTO",
              company: "HealthTech Platform",
            },
            {
              quote:
                "SOC 2 evidence used to take us a week. With DevPulse, we generate it in one click. Our auditor was impressed.",
              author: "Security Engineer",
              company: "Enterprise SaaS",
            },
          ].map((t) => (
            <div key={t.author} className="glass-card p-6 rounded-xl relative overflow-hidden">
              <p className="text-on-surface-variant text-xs leading-relaxed mb-4 italic">
                "{t.quote}"
              </p>
              <div className="text-xs">
                <div className="font-bold text-on-surface font-body-md">{t.author}</div>
                <div className="text-on-surface-variant font-body-md text-[11px]">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Preview */}
      <div className="max-w-[800px] mx-auto py-16 px-6 border-t border-outline-variant/10 relative z-10">
        <h2 className="text-2xl font-bold text-center mb-8 font-display-lg text-on-surface">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "How long does setup take?",
              a: "Most users scan their first collection in under 5 minutes. No infrastructure changes required.",
            },
            {
              q: "Do you store our API data?",
              a: "We only store metadata. Request/response bodies are scanned in-memory and never persisted.",
            },
            {
              q: "What compliance standards do you support?",
              a: "OWASP API Top 10, OWASP LLM Top 10, PCI DSS v4.0.1, and SOC 2 Trust Services Criteria.",
            },
          ].map((faq) => (
            <div key={faq.q} className="glass-card p-5 rounded-xl">
              <h3 className="font-bold text-primary mb-1 text-sm font-display-lg">{faq.q}</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed font-body-md">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/faq" className="text-primary text-xs font-bold font-body-md hover:underline">
            See all 12 FAQs →
          </Link>
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-[600px] mx-auto py-16 px-6 border-t border-outline-variant/10 text-center relative z-10">
        <h2 className="text-2xl font-bold mb-2 font-display-lg text-on-surface">
          Stay Ahead of AI Risks
        </h2>
        <p className="text-on-surface-variant mb-6 text-xs font-body-md">
          Weekly insights on AI security, cost optimization, and compliance. No spam.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for subscribing! We will send you our first issue soon.");
          }}
        >
          <input
            type="email"
            placeholder="you@company.com"
            required
            className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded px-4 py-2.5 text-on-surface placeholder-on-surface-variant/40 outline-none focus:border-primary font-body-md text-xs"
          />
          <button
            type="submit"
            className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded font-body-md text-xs cursor-pointer hover:shadow-[0_0_15px_rgba(207,188,255,0.3)] transition-shadow"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Trust */}
      <div className="max-w-[1000px] mx-auto py-16 px-6 text-center border-t border-outline-variant/10 relative z-10">
        <p className="text-on-surface-variant text-[11px] font-bold font-label-caps mb-6 tracking-widest">
          TRUSTED BY ENGINEERS WORLDWIDE
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-container-gap text-on-surface-variant text-xs">
          <TrustBadge title="4 Patents" desc="NHCE/DEV/2026/001–004" />
          <TrustBadge title="478+ Tests" desc="Server-side test suite" />
          <TrustBadge title="18 Migrations" desc="Drizzle ORM + MySQL" />
          <TrustBadge title="India Built" desc="Bengaluru, Karnataka" />
        </div>
      </div>

      <footer className="border-t border-outline-variant/10 py-12 px-6 text-on-surface-variant relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs font-body-md">
          <div>
            <h4 className="font-bold text-on-surface mb-3 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="hover:text-on-surface transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-on-surface transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-on-surface transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-on-surface transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-on-surface transition-colors">
                  Live Demo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-3 uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/solutions/fintech" className="hover:text-on-surface transition-colors">
                  Fintech
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/healthcare"
                  className="hover:text-on-surface transition-colors"
                >
                  Healthcare
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/enterprise"
                  className="hover:text-on-surface transition-colors"
                >
                  Enterprise
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-on-surface transition-colors">
                  Comparisons
                </Link>
              </li>
              <li>
                <Link href="/roi-calculator" className="hover:text-on-surface transition-colors">
                  ROI Calculator
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-3 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="hover:text-on-surface transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-on-surface transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-on-surface transition-colors">
                  Trust Center
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-on-surface transition-colors">
                  Status
                </Link>
              </li>
              <li>
                <Link href="/open-source" className="hover:text-on-surface transition-colors">
                  Open Source
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-3 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-on-surface transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-on-surface transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <a
                  href="mailto:press@devpulse.in"
                  className="hover:text-on-surface transition-colors"
                >
                  Press
                </a>
              </li>
              <li>
                <Link href="/terms" className="hover:text-on-surface transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-on-surface transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/10">
          <p className="text-[11px]">
            &copy; {new Date().getFullYear()} DevPulse by Rashi Technologies. Bengaluru, India.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0 text-[11px]">
            <a
              href="https://github.com/Akshu1245/devpulse-complete-codebase"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-on-surface transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/devpulsehq"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-on-surface transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com/company/devpulse"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-on-surface transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
      <div className="text-3xl font-display-lg font-bold text-primary tracking-tighter">
        {value}
      </div>
      <div className="text-on-surface-variant font-label-caps text-[10px] tracking-wider mt-2">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:border-primary/40 transition-all">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-display-lg text-md text-primary mb-2 font-bold">{title}</h3>
      <p className="text-on-surface-variant font-body-md text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingCard({
  plan,
  price,
  inr,
  popular,
  features,
  cta,
  href,
}: {
  plan: string;
  price: string;
  inr: string;
  popular?: boolean;
  features: string[];
  cta: string;
  href: string;
}) {
  return (
    <div
      className={`glass-card p-6 rounded-xl relative overflow-hidden flex flex-col ${popular ? "border-primary shadow-[0_0_20px_rgba(207,188,255,0.25)]" : "border-outline-variant/10"}`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold px-4 py-1 rounded-full font-label-caps tracking-wider">
          POPULAR
        </div>
      )}
      <h3
        className={`text-lg font-display-lg font-bold mb-2 ${popular ? "text-primary" : "text-on-surface"}`}
      >
        {plan}
      </h3>
      <p className="text-3xl font-bold font-display-lg text-on-surface mb-1">
        {price}
        <span className="text-sm text-on-surface-variant font-body-md">/mo</span>
      </p>
      <p className="text-xs text-on-surface-variant/75 mb-4 font-body-md">{inr}/mo</p>
      <ul className="space-y-2 text-on-surface-variant text-xs mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-primary">✓</span> {f}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block w-full py-2.5 rounded font-bold transition-all text-center text-xs font-body-md ${popular ? "bg-primary text-on-primary hover:shadow-[0_0_12px_rgba(207,188,255,0.3)]" : "bg-surface-container-high text-on-surface border border-outline-variant/20 hover:bg-surface-variant/80"}`}
      >
        {cta}
      </Link>
    </div>
  );
}

function TrustBadge({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="glass-card p-4 rounded-xl relative overflow-hidden">
      <div className="font-bold text-on-surface text-sm font-display-lg">{title}</div>
      <div className="text-on-surface-variant text-[10px] mt-1 font-body-md">{desc}</div>
    </div>
  );
}
