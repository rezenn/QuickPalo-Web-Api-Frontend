import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/authContext";

const poppins = localFont({
  src: [{ path: "./assets/fonts/Poppins/Poppins-Regular.woff2" }],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuickPalo",
  description: "Booking means efficiency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
          {" "}
          {children}
          <Toaster richColors theme="light" />
        </AuthProvider>
      </body>
    </html>
  );
}
