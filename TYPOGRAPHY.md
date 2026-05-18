# Guía rápida para probar tipografías en FEROX

La web usa dos familias principales:

- **Texto general:** `Manrope`, limpia y moderna para párrafos, botones, menús y formularios.
- **Títulos:** `Sora`, más atractiva y con personalidad, pero sin verse extravagante ni antigua.

## Forma más fácil: cambiar fuentes con un link de Google Fonts

1. Entra a [Google Fonts](https://fonts.google.com/).
2. Busca una fuente para **texto general** y otra para **títulos**.
3. En Google Fonts, copia el link `@import` que te da la página.
4. Abre `app/globals.css` y cambia esta línea de arriba:

```css
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap");
```

Por el link nuevo.

5. En el mismo archivo cambia los nombres aquí:

```css
--font-sans: "Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-serif: "Sora", "Manrope", ui-sans-serif, system-ui, sans-serif;
```

Y también en esta línea de títulos:

```css
font-family: "Sora", "Manrope", ui-sans-serif, system-ui, sans-serif;
```

6. Guarda y revisa la página con:

```bash
npm run dev
```

> Recomendación: prueba combinaciones como `Manrope + Sora`, `Inter + Montserrat`, `DM Sans + Space Grotesk`, `Nunito Sans + Poppins` o `Lato + Outfit`.

## Si quieres usar una fuente descargada

1. Descarga el archivo `.ttf`, `.otf`, `.woff` o `.woff2`.
2. Guárdalo en `styles/fonts/`, por ejemplo: `styles/fonts/MiFuente.woff2`.
3. Abre `app/globals.css` y agrega un `@font-face` arriba, antes de `:root`:

```css
@font-face {
  font-family: "Mi Fuente";
  src: url("../styles/fonts/MiFuente.woff2") format("woff2");
  font-weight: 400 800;
  font-style: normal;
  font-display: swap;
}
```

4. Para usarla en títulos, cambia en `app/globals.css` esta línea:

```css
--font-serif: "Sora", "Manrope", ui-sans-serif, system-ui, sans-serif;
```

por:

```css
--font-serif: "Mi Fuente", "Sora", "Manrope", ui-sans-serif, system-ui, sans-serif;
```

5. Para usarla en todo el texto, cambia esta línea:

```css
--font-sans: "Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

por:

```css
--font-sans: "Mi Fuente", "Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

## Tip para decidir rápido

- Si se ve **muy seria o vieja**, evita serifas clásicas como Playfair, Georgia o Times.
- Si se ve **muy deportiva o rara**, evita usar fuentes tipo logotipo en todos los textos.
- Lo más seguro para esta marca es: una fuente legible y moderna para el texto + una fuente con un poco más de carácter para títulos.
