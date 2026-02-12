import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import EducationalChatbot from "./components/EducationalChatbot";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "InternMatch AI - Next Gen",
  description: "Modern Fullstack AI Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster position="top-center" richColors closeButton theme="light" />
        <EducationalChatbot />
      </body>
    </html>
  );
}
