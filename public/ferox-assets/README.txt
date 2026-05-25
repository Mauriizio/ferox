IconFull — Assets
=====================

Contenido:
- /*           → PWA icons, apple-touch, favicons PNG y OG 1200×630
- favicon.ico  → Multi-tamaño (16/32) (si presente)
- manifest.webmanifest

Instrucciones rápidas (HTML):
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="theme-color" content="#000000">

Next.js (coloca los archivos en /public):
  - Copia los archivos generados (incluyendo manifest.webmanifest y og-1200x630.png) dentro de /public.
  - En app/layout.tsx o _document, añade los <link> de arriba.

Nota: si elegiste fondo "transparente", la OG usa blanco para un mejor preview en redes.
Generado 100% en tu navegador con IconFull.