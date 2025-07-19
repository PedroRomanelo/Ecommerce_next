import type { Metadata } from "next";
import clsx from "clsx";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar"

export const metadata: Metadata = {
  title: "Kamizetaz",
  description: "E-commerce de confecções",
};

const inter = Inter({ subsets: ['latin'] }); 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, 'bg-slate-700')}>
        <Navbar />
        <main className="h-screen p-16">{children}</main>
      </body>
    </html>
  );
}
