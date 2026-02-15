"use client";

import { Mulish } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Toaster } from "sonner";
// import GlobalAuthLoader from "@/components/loaders/global-auth-loader";

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
        <AuthProvider>
          {/* <GlobalAuthLoader /> */}
          {children}
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
