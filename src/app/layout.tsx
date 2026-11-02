import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Serif_Display, Jost } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { Toaster } from 'sonner';

export const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const serifDisplay = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solvetude Careers | Engineering Intelligent Systems",
  description: "Join Solvetude to build high-throughput microservices, real-time event systems, and multi-agent AI architectures.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${serifDisplay.variable} ${jost.variable} scroll-smooth`}
    >
      <body className="font-jost bg-[#f4f7fb] text-[#14181F] antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="grow">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              // background: '#11192b',
              // color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              fontFamily: 'var(--font-jost), sans-serif',
              boxShadow: '0 8px 40px -12px rgba(0,0,0,0.2)',
            },
            className: 'tracking-wide text-sm font-light'
          }}
        />
      </body>
    </html>
  );
}