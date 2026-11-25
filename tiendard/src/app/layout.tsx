import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TiendaRD // Transborder E-Commerce & DGA Logistics",
  description:
    "Plataforma de comercio electrónico transfronterizo con cálculo de flete en tiempo real, exención aduanal DGA ($200 USD) y seguimiento de envíos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[#0A0A09] text-[#F4F3EF] antialiased min-h-screen font-sans selection:bg-[#FF4F18] selection:text-white">
        <div className="fixed inset-0 pointer-events-none z-0 bg-architectural-grid" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
