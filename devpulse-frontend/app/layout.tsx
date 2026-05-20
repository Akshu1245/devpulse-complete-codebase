import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "../components/AuthProvider";
import { CookieConsent } from "../components/CookieConsent";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { OfflineBanner } from "../components/OfflineBanner";
import { TRPCProvider } from "@/lib/providers";
import AppShell from "@/components/AppShell";
import { ToastProvider } from "@/components/Toast";
import { TrialBanner } from "@/app/components/TrialBanner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-space-grotesk", // Map variable to use in tailwind config config
  weight: ["600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-space-jetbrains-mono",
  weight: ["400", "500", "700"],
});

// Configure fonts mapped to css variables in tailwind config
const spaceGroteskVar = spaceGrotesk.variable;
const jetbrainsMonoVar = jetbrainsMono.variable;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://devpulse.in";

export const metadata: Metadata = {
  title: "DevPulse — AI Runtime Governance Platform",
  description:
    "Real-time AI Agent Security Scanning, Cost Monitoring & Compliance. Built in India with 4 patents. Scan APIs, detect shadow endpoints, block prompt injection.",
  generator: "DevPulse",
  keywords: [
    "AI security",
    "API scanning",
    "LLM cost monitoring",
    "prompt injection",
    "shadow API detection",
    "PCI DSS compliance",
    "AI governance",
    "LLM runtime security",
    "AI agent protection",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "DevPulse — Secure Your AI Agents",
    description:
      "Real-time security scanning, cost anomaly detection, and PII redaction for production LLM applications.",
    type: "website",
    siteName: "DevPulse",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPulse — AI Runtime Governance Platform",
    description: "Real-time AI Agent Security Scanning, Cost Monitoring & Compliance.",
    creator: "@devpulsehq",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGroteskVar} ${jetbrainsMonoVar} dark`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root {
            --font-space-grotesk: ${spaceGrotesk.style.fontFamily};
            --font-jetbrains-mono: ${jetbrainsMono.style.fontFamily};
          }
        `,
          }}
        />
      </head>
      <body className="bg-[#0b0d12] text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen">
        <TRPCProvider>
          <AuthProvider>
            <TrialBanner />
            <ToastProvider>
              <ErrorBoundary>
                <OfflineBanner />
                <AppShell>{children}</AppShell>
              </ErrorBoundary>
              <CookieConsent />
            </ToastProvider>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
