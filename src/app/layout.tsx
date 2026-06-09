import type { Metadata } from "next";
import { Inter, Playfair_Display, IBM_Plex_Mono, Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vbtconsultores.com"),
  title: {
    default: "VBT Consultores",
    template: "%s · VBT Consultores",
  },
  description:
    "Firma de consultoría fiscal, financiera y empresarial en Tijuana. Estrategia, cumplimiento y crecimiento.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geist.variable} ${inter.variable} ${playfair.variable} ${plexMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-ink text-chalk">{children}</body>
    </html>
  );
}
