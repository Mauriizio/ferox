# Pasos manuales de Supabase para FEROX

Estos pasos son seguros para el esquema actual: no recrean tablas, no borran datos y no usan `service_role` en el frontend.

## 1. Variables de entorno

En local y en el hosting deben existir:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

No agregues claves privadas ni `service_role` al proyecto Next.js.

## 2. Ejecutar migración no destructiva

En Supabase Dashboard ve a **SQL Editor** y ejecuta el contenido de:

```txt
supabase/migrations/20260518000000_app_private_dashboard.sql
```

La migración:

- agrega `profiles.avatar_url` si falta y asegura que acepte `null`;
- agrega `dogs.photo_url` si falta y asegura que acepte `null`;
- mantiene las columnas reales en español de `dogs` (`nombre`, `peso`, `edad`, `tamaño`, `actividad`, `estado_fisico`, `user_id`);
- agrega columnas mínimas para guardar `food_calculations` con gramos diarios y mensuales;
- activa RLS y políticas por usuario autenticado;
- deja `comments` y `comment_likes` listos como base social.

## 3. Auth por email/contraseña

En Supabase Dashboard:

1. Ve a **Authentication → Providers → Email**.
2. Activa **Email provider**.
3. Decide si quieres confirmación de correo obligatoria.
   - Si está activa, el usuario deberá confirmar email antes de iniciar sesión.
   - Si está desactivada, podrá entrar inmediatamente tras registrarse.

## 4. Google OAuth preparado

El botón ya está implementado en la UI. Para activarlo:

1. Ve a **Authentication → Providers → Google**.
2. Activa Google.
3. Configura `Client ID` y `Client Secret` desde Google Cloud.
4. Agrega las URLs de redirección permitidas en Supabase, por ejemplo:
   - `http://localhost:3000`
   - tu dominio de producción

## 5. Storage de fotos

Esta fase permite dejar vacías las imágenes (`avatar_url` y `photo_url` se guardan como `null`) para no bloquear el producto con carga de archivos ni exigir URLs manuales. Si luego quieres subir archivos a Supabase Storage:

1. Crea buckets privados o públicos según la estrategia de negocio, por ejemplo `avatars` y `dogs`.
2. Mantén las columnas `profiles.avatar_url` y `dogs.photo_url` como destino de la URL pública o firmada.
3. Agrega políticas de Storage para que cada usuario solo pueda escribir sus propios archivos.
