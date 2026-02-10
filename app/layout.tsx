import type { Metadata } from "next";
import { Rakkas, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";

const rakkas = Rakkas({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-rakkas',
});

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "MeetMe - AI-Powered Event Planning",
  description: "Create amazing events with AI assistance. Let us handle the planning, you enjoy the event.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TEMPORARILY DISABLED: async getSession() was blocking page loads
  // Will be moved to client-side navigation component in Phase 2

  return (
    <html lang="en">
      <body className={`${inter.className} ${rakkas.variable}`}>
        <nav className="bg-[#15128f] text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo-transparent.png"
                  alt="MeetMe Logo"
                  width={120}
                  height={40}
                  priority
                />
              </Link>
              <div className="flex items-center gap-8">
                <Link
                  href="/"
                  className="text-white hover:text-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#15128f] rounded-sm px-2 py-1"
                >
                  Home
                </Link>
                <Link
                  href="/my-events"
                  className="text-white hover:text-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#15128f] rounded-sm px-2 py-1"
                >
                  My Events
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="bg-background">{children}</main>
        <Analytics />
        <footer className="bg-[#15128f] text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">MeetMe - AI-Powered Event Planning</h3>
              <p className="text-sm text-gray-300 max-w-2xl mx-auto">
                <strong>Demo Application Notice:</strong> This is a demonstration project showcasing AI-powered event planning.
                Events are stored temporarily in memory and may be cleared periodically. Not intended for production use.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
                <span>Powered by Google Gemini AI</span>
                <span>•</span>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <span>•</span>
                <span>Built with Next.js 15</span>
              </div>
              <p className="text-xs text-gray-400 pt-2">
                © 2025 MeetMe. Let us create the event, so you can enjoy it.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
