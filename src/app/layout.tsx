import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import BackgroundGrid from "@/components/BackgroundGrid";
import SmoothScroll from "@/components/SmoothScroll";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const outfitHeading = Outfit({
  weight: ["600", "700", "800"],
  variable: "--font-outfit-heading",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
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
      className={`${outfitHeading.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-carbon-black text-bright-snow">
        <BackgroundGrid />
        <SmoothScroll>
          <div className="relative z-10 flex flex-col min-h-full w-full">
            {children}
          </div>
        </SmoothScroll>
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
