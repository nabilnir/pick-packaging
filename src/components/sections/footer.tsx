import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-background pt-[120px] pb-12 transition-colors duration-500 border-t border-foreground/5">
            <div className="container max-w-[1440px] mx-auto px-8 lg:px-20">
                {/* Top Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {/* Stylized Logo Block */}
                    <div className="relative flex items-center justify-center bg-transparent border border-foreground/10 rounded-[24px] p-12 aspect-square group hover:border-brand-green transition-all duration-500">
                        <div className="relative w-full h-full">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/svgs/logo-icon-4.svg"
                                alt="PickPacking Logo"
                                fill
                                className="object-contain brightness-0 group-hover:brightness-100 transition-all duration-500"
                            />
                        </div>
                    </div>

                    {/* Category Box 1 */}
                    <a
                        href="/shop?product_cat=food-service"
                        className="flex flex-col items-center justify-center bg-transparent border border-foreground/10 rounded-[24px] p-8 aspect-square hover:bg-foreground hover:border-foreground transition-all duration-500 group"
                    >
                        <h4 className="text-[24px] font-light text-foreground group-hover:text-background transition-colors duration-500 uppercase tracking-widest">
                            Food Service
                        </h4>
                    </a>

                    {/* Category Box 2 */}
                    <a
                        href="/shop?product_cat=food-processing"
                        className="flex flex-col items-center justify-center bg-transparent border border-foreground/10 rounded-[24px] p-8 aspect-square hover:bg-foreground hover:border-foreground transition-all duration-500 group"
                    >
                        <h4 className="text-[24px] font-light text-foreground group-hover:text-background transition-colors duration-500 uppercase tracking-widest">
                            Food Processing
                        </h4>
                    </a>

                    {/* Category Box 3 */}
                    <a
                        href="/shop?product_cat=agriculture"
                        className="flex flex-col items-center justify-center bg-transparent border border-foreground/10 rounded-[24px] p-8 aspect-square hover:bg-foreground hover:border-foreground transition-all duration-500 group"
                    >
                        <h4 className="text-[24px] font-light text-foreground group-hover:text-background transition-colors duration-500 uppercase tracking-widest">
                            Agriculture
                        </h4>
                    </a>
                </div>

                {/* Bottom Bar */}
                <div className="border border-foreground/10 rounded-[16px] px-8 py-6 flex flex-col md:flex-row items-center justify-between text-foreground/50">
                    <div className="flex items-center gap-8 mb-6 md:mb-0">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border border-foreground/30 flex items-center justify-center text-[10px] font-bold">
                                ©
                            </div>
                            <span className="text-[13px] font-medium tracking-wide uppercase">PickPacking {currentYear}. All Rights Reserved</span>
                        </div>

                        <div className="flex items-center gap-5 ml-4">
                            <a href="#" className="text-foreground/40 hover:text-brand-green transition-colors duration-300">
                                <Facebook size={18} strokeWidth={1.5} />
                            </a>
                            <a href="#" className="text-foreground/40 hover:text-brand-green transition-colors duration-300">
                                <Instagram size={18} strokeWidth={1.5} />
                            </a>
                            <a href="#" className="text-foreground/40 hover:text-brand-green transition-colors duration-300">
                                <Linkedin size={18} strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-10 text-[12px] font-bold uppercase tracking-widest">
                        <a href="/contact" className="hover:text-brand-green transition-colors duration-300">
                            Contact Us
                        </a>
                        <a href="/privacy-policy" className="hover:text-brand-green transition-colors duration-300">
                            Privacy Policy
                        </a>
                        <a href="/terms-conditions" className="hover:text-brand-green transition-colors duration-300">
                            Terms & Conditions
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;