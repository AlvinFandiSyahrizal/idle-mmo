import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/layout/SessionProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Idle MMO — Sands of Eternity",
  description: "Egyptian x Mesopotamian Idle RPG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} bg-stone-950 text-stone-100 antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}