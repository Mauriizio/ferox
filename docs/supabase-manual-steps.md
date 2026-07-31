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

## 6. Imagen o video opcional en reseñas

Ejecuta manualmente, después de revisar su contenido, la migración no destructiva:

```txt
supabase/migrations/20260731000000_comment_media.sql
```

Esta migración agrega `public.comments.media_url` y `public.comments.media_type`. Sus constraints permiten una reseña sin archivo o con una sola URL clasificada como `image` o `video`, pero nunca dejan solo uno de ambos campos. También amplía únicamente la policy de INSERT `Users can upload own media` para admitir `comments/{userId}/...`, manteniendo las carpetas `avatars`, `dogs` y la comprobación del usuario autenticado.

El bucket queda con máximo remoto de **20 MB** y una lista explícita: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `video/mp4`, `video/quicktime` y `video/webm`. El frontend mantiene límites más estrictos: imágenes de hasta **5 MB** y videos de hasta **20 MB y 20 segundos**. La duración se valida en el navegador antes del upload.

Comprobaciones manuales posteriores:

1. Confirma que una reseña sin archivo guarda `media_url` y `media_type` como `null`.
2. Confirma por separado una imagen (`media_type = 'image'`) y un video (`media_type = 'video'`) bajo `comments/{userId}/...`.
3. Verifica que otro usuario no pueda insertar, actualizar ni eliminar archivos dentro de esa carpeta.
4. Comprueba el rechazo de imágenes mayores de 5 MB, videos mayores de 20 MB y videos mayores de 20 segundos.
5. Comprueba el rechazo de MIME/extensión incompatibles y de formatos fuera de la lista explícita.
6. Comprueba que al borrar una reseña propia también desaparezca su imagen o video asociado.

Rollback manual, solo si fuera necesario:

```sql
alter policy "Users can upload own media"
  on storage.objects
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] in ('avatars', 'dogs')
    and (storage.foldername(name))[2] = auth.uid()::text
  );

update storage.buckets
set
  file_size_limit = 5242880,
  allowed_mime_types = array['image/*']::text[]
where id = 'media';

alter table public.comments
  drop constraint if exists comments_media_pair_check,
  drop constraint if exists comments_media_type_check,
  drop column if exists media_url,
  drop column if exists media_type;
```

`5242880` bytes equivalen a 5 MiB y restauran el límite remoto conocido previo.

Antes de quitar la columna, conserva o limpia de forma controlada los objetos existentes en `comments/{userId}/`; el rollback no debe ejecutarse automáticamente.
