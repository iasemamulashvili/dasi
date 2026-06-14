import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dasi Games | Crafting Premium Gaming Experiences",
  description: "Dasi Games is an independent game development studio and premium outsourcing partner based in Tbilisi, Georgia, specializing in hybrid arcade RPG, tycoon, and mobile gaming titles.",
  metadataBase: new URL("https://dasigames.com"),
  openGraph: {
    title: "Dasi Games | Crafting Premium Gaming Experiences",
    description: "Dasi Games is an independent game development studio and premium outsourcing partner based in Tbilisi, Georgia, specializing in hybrid arcade RPG, tycoon, and mobile gaming titles.",
    url: "https://dasigames.com",
    siteName: "Dasi Games",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
