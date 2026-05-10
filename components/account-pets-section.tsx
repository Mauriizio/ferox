import { Dog, UserRound } from "lucide-react";

export function AccountPetsSection() {
  return (
    <section
      id="cuenta"
      className="viewport-section bg-muted border-t border-border"
    >
      <div className="viewport-shell mx-auto flex w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Usuarios y mascotas
          </span>
          <h2 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-3xl md:text-5xl font-bold leading-tight tracking-tight text-balance">
            Crea tu cuenta y registra uno o varios perros
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            Relación 1 a muchos: un usuario puede registrar múltiples perros
            para calcular porciones y comprar según sus necesidades.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article className="rounded-2xl border border-border bg-background p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 text-foreground">
              <UserRound className="h-5 w-5" />
              <h3 className="font-semibold">Registro de usuario</h3>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
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
                    className="mt-1 block w-full rounded-lg border border-border bg-background px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm"
                  />
                </label>
              ))}
            </div>
            <button className="mt-3 inline-flex rounded-full bg-foreground px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-background hover:bg-foreground/90">
              Crear cuenta
            </button>
          </article>

          <article className="rounded-2xl border border-border bg-background p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 text-foreground">
              <Dog className="h-5 w-5" />
              <h3 className="font-semibold">Registro de perros</h3>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                "Nombre",
                "Peso",
                "Edad",
                "Tamaño",
                "Actividad",
                "Estado físico",
              ].map((label) => (
                <label key={label} className="text-sm text-foreground">
                  {label}
                  <input
                    type="text"
                    placeholder={`Ingresar ${label.toLowerCase()}`}
                    className="mt-1 block w-full rounded-lg border border-border bg-background px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm"
                  />
                </label>
              ))}
            </div>
            <button className="mt-3 inline-flex rounded-full border border-foreground px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium text-foreground hover:bg-muted">
              Añadir perro
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}
