import { NavigationHeader } from "@/components/navigation-header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { MarketplaceSection } from "@/components/marketplace-section";
import { DashboardPreview } from "@/components/dashboard-preview";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PricingSection } from "@/components/pricing-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <HeroSection />
      <FeaturesSection />
      <MarketplaceSection />
      <DashboardPreview />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
