"use client";

import { Mulish } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const mulish = Mulish({ subsets: ["latin"] });
const title = "Pay Wise";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
      </head>
      <body className={mulish.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
