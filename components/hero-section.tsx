"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PawPrint, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { getDogsByUser } from "@/lib/services/dog-service";
import { getProfile } from "@/lib/services/auth-service";
export function HeroSection() {
  const [session, setSession] = useState<Session | null>(null);
  const [dogsCount, setDogsCount] = useState(0);
  const [fullName, setFullName] = useState("");
  const user = session?.user ?? null;

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        const [dogs, profile] = await Promise.all([
          getDogsByUser(data.session.user.id),
          getProfile(data.session.user.id),
        ]);
        if (!mounted) return;
        setDogsCount(dogs.length);
        setFullName(profile?.full_name ?? "");
      }
    }
    load();
    const { data: listener } = supabase.auth.onAuthStateChange((_e, next) => {
      setSession(next);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const welcome = useMemo(
    () => fullName || user?.email?.split("@")[0] || "tu cuenta",
    [fullName, user?.email],
  );
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/hero-m.png"
            alt="Perro fuerte y saludable alimentado con dieta BARF"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[56%_34%] scale-[1.02]"
          />
        </div>
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="/hero.png"
            alt="Perro fuerte y saludable alimentado con dieta BARF"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[80%_34%] scale-[1.03] opacity-95"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.82)_16%,rgba(0,0,0,0.56)_34%,rgba(0,0,0,0.18)_54%,rgba(0,0,0,0)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.84)_22%,rgba(0,0,0,0.62)_42%,rgba(0,0,0,0.28)_62%,rgba(0,0,0,0.08)_78%,rgba(0,0,0,0)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-start px-4 pb-24 pt-44 sm:px-6 sm:pt-40 md:items-center md:px-8 md:pb-20 md:pt-28">
        <div className="max-w-lg translate-y-2 md:-translate-y-2 text-center md:text-left flex flex-col items-center md:items-start">
          <h1
            className="mt-5 md:mt-6 text-4xl sm:text-5xl md:text-6xl font-normal leading-[0.98] tracking-tight text-white text-balance"
            style={{ fontFamily: '"Ferox", ui-sans-serif, system-ui, sans-serif' }}
          >
            {user ? "BIENVENIDO A TU ESPACIO FEROX" : "NUTRICIÓN REAL PREMIUM"}
          </h1>

          <p
            className="mt-7 md:mt-5 text-base sm:text-lg md:text-xl text-white/85 leading-relaxed text-pretty max-w-lg mx-auto md:mx-0"
          >
            {user
              ? `Hola ${welcome}. Gestiona tus perros y sus recomendaciones BARF en segundos.`
              : "Carne, órganos y vegetales frescos. Planes BARF personalizados según peso, edad y actividad."}
          </p>

          <div className="mt-10 md:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center">
            <Link
              href={user ? "#cuenta" : "#tienda"}
              className="group inline-flex w-auto min-w-[12.5rem] self-center sm:self-auto items-center justify-center gap-2 rounded-full bg-white px-4 sm:px-6 py-2.5 sm:py-4 text-sm sm:text-base font-semibold text-black text-center hover:bg-white/90 transition-all shadow-xl shadow-black/35"
            >
              {user ? "Ir a mi dashboard" : "Comprar ahora"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={user ? "#cuenta" : "#calculadora"}
              className="inline-flex w-auto min-w-[12.5rem] self-center sm:self-auto items-center justify-center gap-2 rounded-full border border-white/40 bg-black/20 px-4 sm:px-6 py-2.5 sm:py-4 text-sm sm:text-base font-medium text-white text-center hover:bg-black/35 transition-colors"
            >
              {user ? "Gestionar mis perros" : "Calcular ración"}
            </Link>
          </div>
          {user ? (
            <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-2 rounded-2xl border border-white/20 bg-black/30 p-3 backdrop-blur-sm">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Cuenta</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-white"><UserRound className="h-4 w-4" />{welcome}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Perros</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-white"><PawPrint className="h-4 w-4" />{dogsCount} registrado{dogsCount === 1 ? "" : "s"}</p>
              </div>
            </div>
          ) : null}

          <div className="mt-10 md:mt-9 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[11px] sm:text-xs tracking-[0.04em] text-white/90">
              Sin químicos
            </span>
            <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[11px] sm:text-xs tracking-[0.04em] text-white/90">
              Despacho a domicilio
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 md:bottom-8">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            className="text-center md:text-left text-[11px] sm:text-xs text-white/70 tracking-[0.01em]"
          >
            Recomendado por Dr. Camilo González · Bluaveterinaria.cl
          </p>
        </div>
      </div>
    </section>
  );
}
