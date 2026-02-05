import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import SubpageHero from "@/components/sections/subpage-hero";
import IndustryIntroduction from "@/components/sections/industry-introduction";
import StandardsGrid from "@/components/sections/standards-grid";

export default function CustomSolutionsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main>
                <SubpageHero
                    title="Custom Solutions"
                    description="Bespoke packaging engineered to meet your specific industrial requirements and brand identity."
                />
                <IndustryIntroduction />
                <StandardsGrid />
            </main>
            <Footer />
        </div>
    );
}
