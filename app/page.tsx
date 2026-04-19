import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { WhatIsBarf } from "@/components/what-is-barf"
import { BenefitsSection } from "@/components/benefits-section"
import { CalculatorSection } from "@/components/calculator-section"
import { TransitionSection } from "@/components/transition-section"
import { ComparisonSection } from "@/components/comparison-section"
import { ShopSection } from "@/components/shop-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CtaSection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"
import { WhatsappFloat } from "@/components/whatsapp-float"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <WhatIsBarf />
        <BenefitsSection />
        <CalculatorSection />
        <TransitionSection />
        <ComparisonSection />
        <ShopSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <SiteFooter />
      <WhatsappFloat />
    </>
  )
}
