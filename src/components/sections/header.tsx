"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const { itemCount } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "Shop", id: "shop", hasMegaMenu: true },
        { label: "Custom Solutions", href: "/custom-solutions" },
        { label: "Programmes", href: "/programmes" },
        { label: "Sectors", href: "/sectors" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Contact", href: "/contact" },
    ];

    const shopCategories = [
        { label: "Promotions", href: "/shop?product_cat=promo", tag: "Coming Soon" },
        { label: "Coffee", href: "/shop?product_cat=coffee" },
        { label: "Smoothies", href: "/shop?product_cat=smoothies" },
        { label: "Deli", href: "/shop?product_cat=deli" },
        { label: "Takeout", href: "/shop?product_cat=takeout" },
        { label: "Cutlery", href: "/shop?packaging_type=cutlery" },
        { label: "Bags", href: "/shop?packaging_type=bags" },
        { label: "Extras", href: "/shop?product_cat=extras" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out",
                isScrolled || activeMenu ? "bg-background/90 backdrop-blur-xl border-b border-foreground/10" : "bg-transparent"
            )}
            onMouseLeave={() => setActiveMenu(null)}
        >
            <div className="container mx-auto h-[90px] flex items-center justify-between pointer-events-auto">
                {/* Logo */}
                <Link href="/" className="relative z-[101] flex items-center gap-3 group">
                    <Image
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/svgs/logo-icon-4.svg"
                        alt="PickPacking Logo"
                        width={40}
                        height={40}
                        className={cn("h-10 w-auto transition-all", (!isScrolled && !activeMenu) ? "brightness-[0.2]" : "brightness-100")}
                    />
                    <div className={cn(
                        "flex flex-col leading-none transition-all duration-500",
                        (!isScrolled && !activeMenu) ? "brightness-[0.2]" : "brightness-100"
                    )}>
                        <span className="text-[1.25rem] font-bold tracking-tight text-foreground">Pick</span>
                        <span className="text-[0.75rem] font-medium tracking-[0.2em] uppercase text-foreground/80">Packaging</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navItems.map((item) => (
                        <div
                            key={item.label}
                            className="relative group py-8"
                            onMouseEnter={() => item.hasMegaMenu && setActiveMenu(item.id)}
                        >
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "text-[14px] font-medium tracking-widest transition-colors uppercase",
                                        "text-foreground hover:text-brand-green"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <button
                                    className={cn(
                                        "text-[14px] font-medium tracking-widest transition-colors uppercase outline-none flex items-center gap-1",
                                        "text-foreground hover:text-brand-green",
                                        activeMenu === item.id && "text-brand-green"
                                    )}
                                >
                                    {item.label}
                                </button>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button className={cn("transition-colors", "text-foreground hover:text-brand-green")}>
                        <Search size={20} strokeWidth={1.5} />
                    </button>

                    <Link
                        href="/cart"
                        className={cn(
                            "transition-all relative p-2.5 rounded-md border hover:border-foreground/30",
                            "text-foreground hover:text-brand-green",
                            "border-foreground/10"
                        )}
                    >
                        <ShoppingCart size={20} strokeWidth={1.5} />
                        {itemCount > 0 && (
                            <span className={cn(
                                "absolute -top-1.5 -right-2 text-[10px] font-bold px-1.5 rounded-full min-w-[16px] h-4 flex items-center justify-center transition-colors animate-in zoom-in duration-200",
                                (isScrolled || activeMenu) ? "bg-brand-green text-white" : "bg-brand-green text-white"
                            )}>
                                {itemCount > 99 ? '99+' : itemCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/login"
                        className={cn(
                            "transition-all p-2.5 rounded-md border hover:border-foreground/30",
                            "text-foreground hover:text-brand-green",
                            "border-foreground/10"
                        )}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Mega Menu Dropdown */}
            <div
                className={cn(
                    "absolute top-full left-0 w-full bg-background border-t border-foreground/5 transition-all duration-500 ease-in-out overflow-hidden origin-top",
                    activeMenu === "shop" ? "opacity-100 scale-y-100 h-auto" : "opacity-0 scale-y-95 pointer-events-none h-0"
                )}
            >
                <div className="container mx-auto pt-10 pb-16">
                    <div className="grid grid-cols-12 gap-12 text-foreground">
                        {/* Left Column: Category Links */}
                        <div className="col-span-4 flex flex-col h-full">
                            <Link
                                href="/shop"
                                className="flex items-center gap-2 text-foreground font-semibold uppercase tracking-widest text-[11px] group mb-6"
                            >
                                Shop all products
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="space-y-1">
                                {shopCategories.map((cat) => (
                                    <Link
                                        key={cat.label}
                                        href={cat.href}
                                        className="group flex items-center justify-between py-3 border-b border-foreground/5 hover:border-foreground/20 transition-all font-display"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-[1.25rem] text-foreground/70 group-hover:text-foreground transition-colors uppercase tracking-tight font-light">
                                                {cat.label}
                                            </span>
                                            {cat.tag && (
                                                <span className="bg-foreground/10 text-foreground/50 text-[10px] px-2 py-0.5 rounded-sm uppercase font-bold tracking-widest">
                                                    {cat.tag}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronRight size={16} className="text-foreground/20 group-hover:text-foreground transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Promotional Cards */}
                        <div className="col-span-8 grid grid-cols-2 gap-6">
                            {/* Card 1: Main Custom Promo */}
                            <div className="relative group p-8 flex flex-col justify-end min-h-[400px] overflow-hidden rounded-xl border border-foreground/5 bg-foreground/5">
                                <div className="absolute inset-0 z-0 opacity-40 grayscale group-hover:scale-105 transition-transform duration-700">
                                    <Image
                                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/menu-1.png"
                                        alt="Custom solutions"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <h3 className="text-3xl font-light leading-tight text-foreground">
                                        Looking for <br /> something specific?
                                    </h3>
                                    <p className="text-foreground/60 text-sm max-w-[200px] font-light">
                                        We can customise your packaging to fit your needs.
                                    </p>
                                    <Link
                                        href="/custom-solutions"
                                        className="flex items-center gap-2 text-foreground font-semibold uppercase tracking-widest text-[11px] group/link"
                                    >
                                        Explore
                                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* Stacked Cards on Right */}
                            <div className="flex flex-col gap-6">
                                {/* Card 2: Loyalty */}
                                <div className="relative group p-8 flex flex-col justify-between h-[188px] rounded-xl border border-foreground/5 bg-foreground/5">
                                    <h3 className="text-2xl font-light leading-tight max-w-[220px] text-foreground">
                                        Join our loyalty programme
                                    </h3>
                                    <Link
                                        href="/programmes"
                                        className="flex items-center gap-2 text-foreground font-semibold uppercase tracking-widest text-[11px] group/link"
                                    >
                                        Discover Now
                                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                {/* Card 3: Promotions */}
                                <div className="relative group p-8 flex flex-col h-[188px] rounded-xl border border-foreground/5 bg-background">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-light text-foreground">Promotions</h3>
                                        <p className="text-foreground/40 text-xs leading-relaxed line-clamp-2">
                                            Return soon. We believe in fair, transparent pricing.
                                        </p>
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-2 text-foreground/30 font-semibold uppercase tracking-widest text-[11px] cursor-not-allowed">
                                            Stay Updated
                                            <ArrowRight size={14} className="opacity-0" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;