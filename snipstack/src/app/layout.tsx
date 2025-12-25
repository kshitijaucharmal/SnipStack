import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { ToastProvider } from "@/components/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnipStack",
  description: "Manage, search, and share your code snippets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ToastProvider>
          <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
            <h1 className="text-xl font-semibold tracking-tight">
              SnipStack
            </h1>

            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="bg-emerald-500 text-slate-950 rounded-full font-medium text-sm h-10 px-4 cursor-pointer hover:bg-emerald-400 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          {children}
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
