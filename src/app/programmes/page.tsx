import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import SubpageHero from "@/components/sections/subpage-hero";
import FAQSection from "@/components/sections/faq";

export default function ProgrammesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main>
                <SubpageHero
                    title="Our Programmes"
                    description="From loyalty rewards to sustainable supply chain management, explore the benefits of partnering with PickPacking."
                />
                <section className="py-32 md:py-48 bg-background transition-colors duration-500">
                    <div className="container mx-auto px-8 lg:px-20">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-light mb-8 uppercase tracking-widest text-foreground font-display">Loyalty Benefits</h2>
                                <p className="text-foreground/70 text-[1.25rem] font-light leading-relaxed mb-10 max-w-xl">
                                    Our loyalty programme is designed to support growing businesses by offering competitive pricing and exclusive benefits. Join over 500 partners who have streamlined their packaging procurement with us.
                                </p>
                            </div>
                            <div className="bg-brand-green p-12 md:p-16 rounded-[4px] text-brand-olive shadow-2xl">
                                <h3 className="text-[2rem] font-light mb-6 font-display">Partner with us today</h3>
                                <p className="text-brand-olive/80 mb-10 leading-relaxed text-[1.125rem]">Get 5% back on your first order when you sign up for our professional partner programme.</p>
                                <button className="px-10 py-4 bg-brand-olive text-brand-green uppercase tracking-widest text-[13px] font-bold rounded-[4px] hover:bg-white hover:text-brand-green transition-all duration-300">Get Started</button>
                            </div>
                        </div>
                    </div>
                </section>
                <FAQSection />
            </main>
            <Footer />
        </div>
    );
}
