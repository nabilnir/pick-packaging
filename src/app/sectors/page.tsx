import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import SubpageHero from "@/components/sections/subpage-hero";
import SectorCards from "@/components/sections/sector-cards";
import MissionVisionSection from "@/components/sections/mission-vision";

export default function SectorsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main>
                <SubpageHero
                    title="Industry Sectors"
                    description="Specialized packaging expertise across agriculture, food processing, and hospitality sectors."
                />
                <div className="py-20">
                    <SectorCards />
                </div>
                <MissionVisionSection />
            </main>
            <Footer />
        </div>
    );
}
