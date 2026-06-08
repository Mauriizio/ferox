"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { getDogsByUser } from "@/lib/services/dog-service";
import { logSupabaseError } from "@/lib/services/supabase-error";

const PHONE = "56927973379";

export function HeroSection() {
  const { user, profile } = useAuth();
  const [dogsCount, setDogsCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    if (!user) {
      setDogsCount(0);
      return () => {
        mounted = false;
      };
    }

    getDogsByUser(user.id)
      .then((dogs) => {
        if (mounted) setDogsCount(dogs.length);
      })
      .catch((error) => {
        logSupabaseError("Cargar conteo de perros en hero", error);
        if (mounted) setDogsCount(0);
      });

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const welcome = useMemo(
    () => profile?.full_name || user?.email?.split("@")[0] || "tu cuenta",
    [profile?.full_name, user?.email],
  );

  const avatarUrl = profile?.avatar_url ?? "";
  const heroImageAlt = "Perro fuerte y saludable alimentado con dieta BARF";
  const {
    props: { srcSet: desktopHeroSrcSet },
  } = getImageProps({
    src: "/hero.png",
    alt: heroImageAlt,
    width: 1774,
    height: 887,
    sizes: "100vw",
  });
  const {
    props: { srcSet: mobileHeroSrcSet, ...mobileHeroImageProps },
  } = getImageProps({
    src: "/hero-m.png",
    alt: heroImageAlt,
    width: 941,
    height: 1672,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <picture className="absolute inset-0 block h-full w-full">
          <source media="(min-width: 768px)" srcSet={desktopHeroSrcSet} sizes="100vw" />
          <source media="(max-width: 767px)" srcSet={mobileHeroSrcSet} sizes="100vw" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...mobileHeroImageProps}
            className="h-full w-full scale-[1.02] object-cover object-[56%_34%] md:scale-[1.03] md:object-[80%_34%] md:opacity-95"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.82)_16%,rgba(0,0,0,0.56)_34%,rgba(0,0,0,0.18)_54%,rgba(0,0,0,0)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.84)_22%,rgba(0,0,0,0.62)_42%,rgba(0,0,0,0.28)_62%,rgba(0,0,0,0.08)_78%,rgba(0,0,0,0)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-start px-4 pb-24 pt-44 sm:px-6 sm:pt-40 md:items-center md:px-8 md:pb-20 md:pt-28">
        <div className="max-w-lg translate-y-2 md:-translate-y-2 text-center md:text-left flex flex-col items-center md:items-start">
          <h1
            className="mt-5 md:mt-6 text-4xl sm:text-5xl md:text-6xl font-normal leading-[0.98] tracking-tight text-white text-balance"
            style={{ fontFamily: '"Ferox", ui-sans-serif, system-ui, sans-serif' }}
          >
            {user ? "BIENVENIDO A TU ESPACIO FEROX" : "NUTRICION REAL PREMIUM"}
          </h1>
          {user ? (
            <div className="mt-3 h-20 w-20 overflow-hidden rounded-full border border-white/30 bg-white/10 md:hidden">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar usuario" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-white"><UserRound className="h-8 w-8" /></div>
              )}
            </div>
          ) : null}

          <p
            className="mt-7 md:mt-5 text-base sm:text-lg md:text-xl text-white/85 leading-relaxed text-pretty max-w-lg mx-auto md:mx-0"
          >
            {user
              ? `Hola ${welcome}. Gestiona tus perros y sus recomendaciones BARF en segundos.`
              : "Carne, órganos y vegetales frescos. Planes BARF personalizados según peso, edad y actividad."}
          </p>

          <div className="mt-10 md:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center">
            <Link
              href={user ? `https://wa.me/${PHONE}` : "#tienda"}
              target={user ? "_blank" : undefined}
              rel={user ? "noopener noreferrer" : undefined}
              className="interactive-lift premium-transition group inline-flex w-auto min-w-[12.5rem] self-center sm:self-auto items-center justify-center gap-2 rounded-full bg-white px-4 sm:px-6 py-2.5 sm:py-4 text-sm sm:text-base font-semibold text-black text-center hover:bg-white/90 shadow-xl shadow-black/35"
            >
              {user ? "Hacer pedido" : "Comprar ahora"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={user ? "#cuenta" : "#calculadora"}
              className="interactive-lift premium-transition inline-flex w-auto min-w-[12.5rem] self-center sm:self-auto items-center justify-center gap-2 rounded-full border border-white/40 bg-black/20 px-4 sm:px-6 py-2.5 sm:py-4 text-sm sm:text-base font-medium text-white text-center hover:bg-black/35"
            >
              {user ? "Mis perros" : "Calcular ración"}
            </Link>
          </div>
          {user ? <p className="mt-2 text-sm text-white/80">Hola {welcome}. Tienes {dogsCount} perro{dogsCount === 1 ? "" : "s"}.</p> : null}

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
