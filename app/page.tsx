import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { BenefitsSection } from "@/components/benefits-section";
import { CalculatorSection } from "@/components/calculator-section";
import { SocialProofGallerySection } from "@/components/social-proof-gallery-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CommentsSection } from "@/components/comments-section";
import { AccountPetsSection } from "@/components/account-pets-section";
import { CtaSection } from "@/components/cta-section";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappFloat } from "@/components/whatsapp-float";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <CalculatorSection />
        <BenefitsSection />
        <SocialProofGallerySection />
        <TestimonialsSection />
        <CommentsSection />

        <section className="border-t border-border bg-muted/20">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Área privada
            </p>
          </div>
        </section>

        <AccountPetsSection />
        <CtaSection />
      </main>
      <SiteFooter />
      <WhatsappFloat />
    </>
  );
}
