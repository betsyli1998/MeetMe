import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <nav className="bg-primary text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold">
                MeetMe
              </Link>
              {/* Session info will be added back in Phase 2 with client-side component */}
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">{children}</main>
        <footer className="bg-gray-900 text-white py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm">© 2025 MeetMe. Let us create the event, so you can enjoy it.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
