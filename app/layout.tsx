import type { Metadata } from "next";
import { Rakkas, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              {/* Session info will be added back in Phase 2 with client-side component */}
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-background">{children}</main>
        <footer className="bg-accent text-white py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm">© 2025 MeetMe. Let us create the event, so you can enjoy it.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
