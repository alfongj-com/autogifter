import type { Metadata } from "next";
import { Comic_Neue } from "next/font/google";
import "./globals.css";

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "AutoGifter - AI Gift Automation",
  description: "Automate your gift-giving with AI-powered recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comicNeue.variable} antialiased bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
