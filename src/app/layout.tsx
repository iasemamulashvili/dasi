import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import BackgroundGrid from "@/components/BackgroundGrid";
import "./globals.css";

const outfitHeading = Outfit({
  weight: ["600", "700", "800"],
  variable: "--font-outfit-heading",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
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
      className={`${outfitHeading.variable} ${plusJakartaSans.variable} h-full antialiased`}
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
