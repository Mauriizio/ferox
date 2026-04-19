import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "FEROX BARF — Alimentación natural para tu perro",
  description:
    "Calcula la porción ideal diaria para tu perro según su peso, edad y actividad. Alimentación BARF natural, fresca y biológicamente adecuada.",
  generator: "v0.app",
  keywords: ["BARF", "alimentación natural", "perros", "FEROX", "calculadora BARF", "comida cruda"],
}

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production"}
      </body>
    </html>
  )
}
