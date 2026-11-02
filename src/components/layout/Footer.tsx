'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-[#14181F]/10 bg-[#f4f7fb]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-8">

          {/* Brand & Description */}
          <div className="flex flex-col md:col-span-5 lg:col-span-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/solvetude-logo.png"
                alt="Solvetude"
                width={140}
                height={45}
                className="object-contain"
              />
            </Link>

            <p className="mt-6 max-w-md font-jost text-sm leading-relaxed text-[#565C6B]">
              Engineering high-throughput microservices, real-time event systems, and multi-agent AI architectures. Build the platforms that power global enterprises.
            </p>
          </div>

          {/* Platform Links */}
          <nav className="md:col-span-4 lg:col-span-3">
            <h4 className="mb-5 font-jost text-[10px] font-bold uppercase tracking-[0.25em] text-[#0f2953]">
              Career Portal
            </h4>
            <ul className="space-y-3 font-jost text-[13px] text-[#565C6B]">
              <li>
                <Link href="/careers" className="transition-colors hover:text-[#14181F]">
                  View Open Roles
                </Link>
              </li>
              <li>
                <Link href="/recruiter/dashboard" className="transition-colors hover:text-[#14181F]">
                  Internal HR Dashboard
                </Link>
              </li>
              <li>
                <Link href="/recruiter/create-job" className="transition-colors hover:text-[#14181F]">
                  AI Job Generator
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company Links */}
          <nav className="md:col-span-2 lg:col-span-3">
            <h4 className="mb-5 font-jost text-[10px] font-bold uppercase tracking-[0.25em] text-[#0f2953]">
              Company
            </h4>
            <ul className="space-y-3 font-jost text-[13px] text-[#565C6B]">
              <li>
                <a href="https://solvetude.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#14181F]">
                  Main Site
                </a>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-[#14181F]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-[#14181F]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-16 flex flex-col items-center justify-center border-t border-[#14181F]/10 pt-8 sm:flex-row">
          <p className="font-jost text-[10px] uppercase tracking-[0.2em] text-[#565C6B]/80">
            &copy; {currentYear} Solvetude. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}