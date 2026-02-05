import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import SubpageHero from "@/components/sections/subpage-hero";

export default function SustainabilityPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main>
                <SubpageHero
                    title="Sustainability"
                    description="Our commitment to an eco-friendly future through 100% recyclable and compostable packaging solutions."
                    image="/images/food_service.png"
                />
                <section className="bg-background py-32 md:py-48 transition-colors duration-500">
                    <div className="container mx-auto px-8 max-w-5xl text-center">
                        <span className="text-[13px] font-bold uppercase tracking-[0.4em] text-foreground/40 mb-10 block">Our Future</span>
                        <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light text-foreground mb-12 leading-[1.1] uppercase tracking-[0.1em] font-display">Earth-First Engineering</h2>
                        <p className="text-[1.25rem] text-foreground/70 font-light leading-relaxed mb-20 max-w-4xl mx-auto">
                            Sustainability isn't just a trend at PickPacking; it's the foundation of everything we build. We've pivoted our entire supply chain to ensure that every box, cup, and crate we manufacture leaves the smallest possible footprint.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-24">
                            <div className="p-12 border border-foreground/10 rounded-[4px] hover:border-brand-green transition-colors duration-500 group">
                                <h3 className="text-[3.5rem] font-light mb-4 font-display text-foreground group-hover:text-brand-green transition-colors">100%</h3>
                                <p className="text-[11px] uppercase tracking-[0.2em] opacity-40 font-bold">Recyclable</p>
                            </div>
                            <div className="p-12 border border-foreground/10 rounded-[4px] hover:border-brand-green transition-colors duration-500 group">
                                <h3 className="text-[3.5rem] font-light mb-4 font-display text-foreground group-hover:text-brand-green transition-colors">85%</h3>
                                <p className="text-[11px] uppercase tracking-[0.2em] opacity-40 font-bold">Bio-Based</p>
                            </div>
                            <div className="p-12 border border-foreground/10 rounded-[4px] hover:border-brand-green transition-colors duration-500 group">
                                <h3 className="text-[3.5rem] font-light mb-4 font-display text-foreground group-hover:text-brand-green transition-colors">0</h3>
                                <p className="text-[11px] uppercase tracking-[0.2em] opacity-40 font-bold">Waste Goal</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
