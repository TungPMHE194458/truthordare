import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Baloo_2, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const title = "Truth or Dare — Fun Party Game";
const description = "Play Truth or Dare with random questions and challenges.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  applicationName: "Truth or Dare",
  openGraph: {
    title,
    description,
    type: "website",
    locale: "vi_VN",
    siteName: "Truth or Dare",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#15121f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" className={`${baloo.variable} ${beVietnam.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
