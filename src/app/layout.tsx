import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/context/AuthProvider.js"
import PostTimestampProvider from '@/context/PostTimestampProvider.js'
import AppHeader from "@/components/AppHeader.js"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "待辦事項主動通知系統",
  description: "中壢地政事務所內網待辦事項主動通知系統",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PostTimestampProvider>
            <>
            <AppHeader />
            {children}
            </>
          </PostTimestampProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
