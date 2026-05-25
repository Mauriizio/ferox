import type { Metadata, Viewport } from "next"
import "./globals.css"

const title = "FEROX BARF — Alimentación natural para tu perro"
const description =
  "Calcula la porción ideal diaria para tu perro según su peso, edad y actividad. Alimentación BARF natural, fresca y biológicamente adecuada."

export const metadata: Metadata = {
  metadataBase: new URL("https://ferox-five.vercel.app"),
  title,
  description,
  applicationName: "FEROX",
  manifest: "/ferox-assets/manifest.webmanifest",
  generator: "v0.app",
  keywords: ["BARF", "alimentación natural", "perros", "FEROX", "calculadora BARF", "comida cruda"],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/ferox-assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/ferox-assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title,
    description,
    url: "https://ferox-five.vercel.app",
    siteName: "FEROX",
    images: [
      {
        url: "/ferox-assets/og-1200x630.png",
        width: 1200,
        height: 630,
        alt: "FEROX BARF",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/ferox-assets/og-1200x630.png"],
  },
  appleWebApp: {
    capable: true,
    title: "FEROX",
    statusBarStyle: "black-translucent",
  },
}

export const viewport: Viewport = {
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
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production"}
      </body>
    </html>
  )
}
