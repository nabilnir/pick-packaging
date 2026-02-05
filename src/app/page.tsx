import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import ScrollingBanner from "@/components/sections/scrolling-banner";
import IndustryIntroduction from "@/components/sections/industry-introduction";
import SectorCards from "@/components/sections/sector-cards";
import MissionVisionSection from "@/components/sections/mission-vision";
import NewProducts from "@/components/sections/new-products";
import CustomSolutionsCTA from "@/components/sections/custom-solutions-cta";
import StandardsGrid from "@/components/sections/standards-grid";
import FAQSection from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import FadeIn from "@/components/ui/fade-in";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FadeIn direction="up" delay={0.2}>
          <ScrollingBanner />
        </FadeIn>
        <FadeIn direction="up" delay={0.4}>
          <IndustryIntroduction />
        </FadeIn>
        <FadeIn direction="up">
          <SectorCards />
        </FadeIn>
        <FadeIn direction="up">
          <MissionVisionSection />
        </FadeIn>
        <FadeIn direction="up">
          <NewProducts />
        </FadeIn>
        <FadeIn direction="up">
          <CustomSolutionsCTA />
        </FadeIn>
        <FadeIn direction="up">
          <ScrollingBanner />
        </FadeIn>
        <FadeIn direction="up">
          <StandardsGrid />
        </FadeIn>
        <FadeIn direction="up">
          <FAQSection />
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}
