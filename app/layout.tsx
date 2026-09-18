import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: `Cybersecurity portfolio for ${profile.name}, a Computer Science student focused on penetration testing, vulnerability assessment, and reconnaissance automation.`,
};

export const viewport: Viewport = {
  themeColor: "#0a0c0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-void font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
