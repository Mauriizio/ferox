"use client";

import type { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { BenefitsSection } from "@/components/benefits-section";
import { CalculatorSection } from "@/components/calculator-section";
import { SocialProofGallerySection } from "@/components/social-proof-gallery-section";
import { CommentsSection } from "@/components/comments-section";
import { AccountPetsSection } from "@/components/account-pets-section";
import { CtaSection } from "@/components/cta-section";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappFloat } from "@/components/whatsapp-float";

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null);
  const isAuthenticated = Boolean(session?.user);

  return (
    <>
      <SiteHeader onSessionChange={setSession} />
      <main>
        <HeroSection />
        {isAuthenticated ? <AccountPetsSection /> : null}
        <CalculatorSection />
        <BenefitsSection />
        <SocialProofGallerySection />
        <CommentsSection />
        <CtaSection />
      </main>
      <SiteFooter />
      <WhatsappFloat />
    </>
  );
}
