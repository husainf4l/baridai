"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import LogoSmall from "@/components/svgs/logo-small";

interface NavbarProps {
  showToggle?: boolean;
  transparent?: boolean;
}

export default function Navbar({
  showToggle = true,
  transparent = false,
}: NavbarProps) {
  return (
    <header
      className={`sticky top-0 z-50 ${
        transparent
          ? "bg-transparent"
          : "backdrop-blur-xl bg-white/80 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800"
      }`}
    >
      <div className="container mx-auto py-5 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <LogoSmall size="md" />
          </Link>
        </div>
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/#features"
            className="text-sm font-medium text-[#1D1D1F] dark:text-white hover:text-blue-500 transition"
          >
            Features
          </Link>
          <Link
            href="/#plans"
            className="text-sm font-medium text-[#1D1D1F] dark:text-white hover:text-blue-500 transition"
          >
            Pricing
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-[#1D1D1F] dark:text-white hover:text-blue-500 transition"
          >
            How It Works
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {showToggle && (
            <div className="mr-2">
              <ModeToggle />
            </div>
          )}
          <Link
            href="/login"
            className="text-sm font-medium text-[#1D1D1F] dark:text-white hover:text-blue-500 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-blue-500 text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
