import { LockKeyhole, MessageSquareHeart, Send, ShieldCheck, UserRound } from "lucide-react"

const previewComments = [
  {
    name: "Cliente FEROX",
    pet: "Experiencia verificada",
    comment:
      "Pronto podrás dejar tu experiencia desde tu cuenta y ayudar a otras familias a elegir BARF.",
  },
  {
    name: "Comunidad BARF",
    pet: "Comentarios conectados a Supabase",
    comment:
      "Esta sección queda lista visualmente para recibir comentarios reales cuando activemos el backend.",
  },
]

const backendSteps = [
  "Autenticación de usuarios reales",
  "Comentarios guardados en base de datos",
  "Moderación antes de publicar",
]

export function CommentsSection() {
  return (
    <section id="comentarios" className="border-t border-border bg-muted/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <MessageSquareHeart className="h-4 w-4 text-foreground" aria-hidden="true" />
              Comentarios
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
              La comunidad FEROX tendrá un espacio para contar su experiencia.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Estamos preparando esta sección para conectarla con Supabase. Cuando el backend esté activo, los clientes podrán crear cuentas reales, iniciar sesión y dejar comentarios verificados.
            </p>

            <ul className="mt-6 grid gap-3">
              {backendSteps.map((step) => (
                <li key={step} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-sm font-semibold text-foreground shadow-sm">
                  <ShieldCheck className="h-4 w-4 flex-none" aria-hidden="true" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-background p-4 shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Deja tu comentario
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Formulario preparado para la próxima integración con cuentas.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                Próximamente
              </span>
            </div>

            <form className="mt-5 grid gap-3" aria-label="Formulario de comentarios próximamente disponible">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                  Nombre
                  <input
                    disabled
                    placeholder="Inicia sesión para comentar"
                    className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm text-muted-foreground outline-none"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                  Mascota
                  <input
                    disabled
                    placeholder="Nombre de tu perro"
                    className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm text-muted-foreground outline-none"
                  />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                Comentario
                <textarea
                  disabled
                  placeholder="Cuéntanos cómo le fue con FEROX BARF"
                  className="min-h-28 resize-none rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
                />
              </label>
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Publicar comentario
              </button>
            </form>

            <div className="mt-6 grid gap-3">
              {previewComments.map((comment) => (
                <article key={comment.name} className="rounded-2xl border border-border bg-muted/45 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background">
                      <UserRound className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">{comment.name}</h4>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">{comment.pet}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {comment.comment}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
