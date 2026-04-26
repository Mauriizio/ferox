import { Dog, UserRound } from "lucide-react"

export function AccountPetsSection() {
  return (
    <section id="cuenta" className="min-h-[100svh] bg-muted border-t border-border flex items-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Usuarios y mascotas
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
            Crea tu cuenta y registra uno o varios perros
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Relación 1 a muchos: un usuario puede registrar múltiples perros para calcular porciones y comprar según sus
            necesidades.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article className="rounded-2xl border border-border bg-background p-5 sm:p-6">
            <div className="flex items-center gap-2 text-foreground">
              <UserRound className="h-5 w-5" />
              <h3 className="font-semibold">Registro de usuario</h3>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Nombre", "Tu nombre"],
                ["Apellido", "Tu apellido"],
                ["Correo", "correo@ejemplo.com"],
                ["Teléfono", "+56 9 2797 3379"],
              ].map(([label, placeholder]) => (
                <label key={label} className="text-sm text-foreground">
                  {label}
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                  />
                </label>
              ))}
            </div>
            <button className="mt-5 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:bg-foreground/90">
              Crear cuenta
            </button>
          </article>

          <article className="rounded-2xl border border-border bg-background p-5 sm:p-6">
            <div className="flex items-center gap-2 text-foreground">
              <Dog className="h-5 w-5" />
              <h3 className="font-semibold">Registro de perros</h3>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Nombre", "Peso", "Edad", "Tamaño", "Actividad", "Estado físico"].map((label) => (
                <label key={label} className="text-sm text-foreground">
                  {label}
                  <input
                    type="text"
                    placeholder={`Ingresar ${label.toLowerCase()}`}
                    className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
                  />
                </label>
              ))}
            </div>
            <button className="mt-5 inline-flex rounded-full border border-foreground px-5 py-3 text-sm font-medium text-foreground hover:bg-muted">
              Añadir perro
            </button>
          </article>
        </div>
      </div>
    </section>
  )
}
