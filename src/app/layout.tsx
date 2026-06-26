import type { Metadata } from "next";
import { Russo_One, Silkscreen, Outfit } from "next/font/google";
import BackgroundGrid from "@/components/BackgroundGrid";
import "./globals.css";

const russoOne = Russo_One({
  weight: "400",
  variable: "--font-russo-one",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  weight: "400",
  variable: "--font-silkscreen",
  subsets: ["latin"],
});

const outfit = Outfit({
  weight: ["300", "400", "700"],
  variable: "--font-outfit",
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
      className={`${russoOne.variable} ${silkscreen.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-carbon-black text-bright-snow">
        <BackgroundGrid />
        <div className="relative z-10 flex flex-col min-h-full w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
