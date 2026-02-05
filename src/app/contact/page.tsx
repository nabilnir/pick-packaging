import Header from "@/components/sections/header";
import ContactHeroForm from "@/components/sections/contact-hero-form";
import MeetUsInfo from "@/components/sections/meet-us-info";
import FAQSection from "@/components/sections/faq-accordion";
import VisionCTA from "@/components/sections/vision-cta";
import ScrollingTicker from "@/components/sections/scrolling-ticker";
import Footer from "@/components/sections/footer";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main>
                <ContactHeroForm />
                <MeetUsInfo />
                <FAQSection />
                <VisionCTA />
                <ScrollingTicker />
            </main>
            <Footer />
        </div>
    );
}
