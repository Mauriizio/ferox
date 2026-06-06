"use client";

import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { BenefitsSection } from "@/components/benefits-section";
import { CalculatorSection } from "@/components/calculator-section";
import { BarfMethodSection } from "@/components/barf-method-section";
import { ShopSection } from "@/components/shop-section";
import { SubscriptionPlansSection } from "@/components/subscription-plans-section";
import { SocialProofGallerySection } from "@/components/social-proof-gallery-section";
import { CommentsSection } from "@/components/comments-section";
import { AccountPetsSection } from "@/components/account-pets-section";
import { ResponsibleFeedingSection } from "@/components/responsible-feeding-section";
import { CtaSection } from "@/components/cta-section";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappFloat } from "@/components/whatsapp-float";
import { useAuth } from "@/components/auth-provider";

export default function HomePage() {
  const { user, authLoading } = useAuth();
  const isAuthenticated = Boolean(user);

  return (
    <>
      <SiteHeader />
      {authLoading ? (
        <main>
          <section className="grid min-h-[100svh] place-items-center bg-background px-4 text-center">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                FEROX BARF
              </p>
              <p className="text-sm text-muted-foreground">Cargando tu sesión...</p>
            </div>
          </section>
        </main>
      ) : (
        <main>
          <HeroSection />
          {isAuthenticated ? <AccountPetsSection /> : null}
          <ShopSection />
          <SubscriptionPlansSection />
          <BenefitsSection />
          <CalculatorSection />
          <BarfMethodSection />
          <ResponsibleFeedingSection />
          <SocialProofGallerySection />
          <CommentsSection />
          <CtaSection />
        </main>
      )}
      <SiteFooter />
      <WhatsappFloat />
    </>
  );
}
