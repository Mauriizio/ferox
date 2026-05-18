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

- agrega `profiles.avatar_url` si falta;
- agrega `dogs.photo_url` si falta;
- mantiene las columnas reales en español de `dogs` (`nombre`, `peso`, `edad`, `etapa_vida`, `tamano`, `actividad`, `estado_fisico`, `user_id`, `photo_url`), con `edad` numérica y `etapa_vida` como texto;
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

La app usa carga real de archivos al bucket público `media`; no pide URLs manuales ni guarda base64 en Postgres.

1. Verifica que exista el bucket `media`.
2. Mantén `profiles.avatar_url` y `dogs.photo_url` como destino de la URL pública devuelta por Storage.
3. Agrega políticas de Storage para que cada usuario autenticado pueda escribir dentro de sus carpetas (`avatars/` y `dogs/`) y pueda leer archivos públicos según la estrategia del bucket.
