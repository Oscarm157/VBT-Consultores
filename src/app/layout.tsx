import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VBT Consultores",
  description:
    "Firma de consultoría fiscal, financiera y empresarial en Tijuana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
