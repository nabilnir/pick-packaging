"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
    LayoutDashboard,
    Truck,
    PackageSearch,
    ShoppingCart,
    Factory,
    BadgeCheck,
    Settings,
    FileText,
    Bell,
    Search,
    Menu,
    LogOut,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href:  string;
    icon:  React.ElementType;
}

interface RiderLayoutProps {
    children:  React.ReactNode;
    navItems?: NavItem[];
}

export const RIDER_NAV: NavItem[] = [
    { label: "Dashboard",   href: "/rider",             icon: LayoutDashboard },
    { label: "Procurement", href: "/rider/procurement", icon: ShoppingCart    },
    { label: "Inventory",   href: "/rider/inventory",   icon: PackageSearch   },
    { label: "Logistics",   href: "/rider/logistics",   icon: Truck           },
    { label: "Vendors",     href: "/rider/vendors",     icon: Factory         },
    { label: "Team",        href: "/rider/team",        icon: BadgeCheck      },
];

const BOTTOM_NAV: NavItem[] = [
    { label: "Settings",      href: "/rider/settings",      icon: Settings  },
    { label: "Documentation", href: "/rider/documentation",  icon: FileText  },
];

export default function RiderLayout({ children, navItems }: RiderLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    const nav = navItems ?? RIDER_NAV;

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    if (loading) return (
        <div className="h-screen bg-background flex items-center justify-center text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/30">
            Authenticating…
        </div>
    );
    if (!user) return null;

    const pageTitle = pathname.split('/').filter(Boolean).pop()?.replace(/^./, c => c.toUpperCase()) ?? 'Dashboard';

    return (
        <div className="flex h-screen bg-background overflow-hidden">

            {/* ── Mobile overlay ──────────────────────────────────────── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[150] bg-foreground/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ─────────────────────────────────────────────── */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-[151] w-64 flex flex-col transition-transform duration-300",
                "bg-[#2D2D2D] border-r border-white/5",
                "lg:relative lg:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo */}
                <div className="p-8 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#BFC0AC] flex items-center justify-center text-[#12271D] text-xs font-bold shrink-0">
                            P
                        </div>
                        <span className="font-display text-[1rem] font-medium text-white tracking-tight">
                            PickPacking
                        </span>
                    </Link>
                </div>

                {/* Role badge */}
                <div className="px-6 pt-5 pb-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#BAB7AE]/50">
                        Rider Portal
                    </span>
                </div>

                {/* Primary nav */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    {nav.map(item => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
                                    active
                                        ? "bg-white/10 text-white"
                                        : "text-[#BAB7AE]/60 hover:bg-white/5 hover:text-[#BAB7AE]"
                                )}
                            >
                                <item.icon size={17} strokeWidth={active ? 2 : 1.5}
                                    className={active ? "text-[#BFC0AC]" : ""} />
                                {item.label}
                                {active && <ChevronRight size={13} className="ml-auto text-[#BFC0AC]/50" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom nav + logout */}
                <div className="p-4 border-t border-white/10 space-y-0.5">
                    {BOTTOM_NAV.map(item => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-[#BAB7AE]/50 hover:bg-white/5 hover:text-[#BAB7AE] transition-all"
                        >
                            <item.icon size={16} strokeWidth={1.5} />
                            {item.label}
                        </Link>
                    ))}

                    {/* User pill */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mt-3">
                        <div className="w-8 h-8 rounded-full bg-[#BFC0AC]/20 text-[#BFC0AC] flex items-center justify-center text-xs font-bold shrink-0">
                            {user?.displayName?.[0] ?? 'R'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-white truncate leading-tight">
                                {user?.displayName ?? 'Rider'}
                            </p>
                            <p className="text-[10px] text-[#BAB7AE]/40 truncate">Active · Sector 4</p>
                        </div>
                    </div>

                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-1"
                    >
                        <LogOut size={16} strokeWidth={1.5} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* ── Main content ────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top bar */}
                <header className="h-[72px] bg-background border-b border-foreground/[0.06] px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-foreground/40 hover:text-foreground transition-colors"
                        >
                            <Menu size={22} />
                        </button>
                        <h1 className="font-display text-[1.15rem] font-light text-foreground tracking-tight">
                            {pageTitle}
                        </h1>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-foreground/[0.04] rounded-full border border-foreground/[0.06] w-60">
                            <Search size={14} className="text-foreground/30 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search…"
                                className="bg-transparent text-[13px] font-light focus:outline-none w-full text-foreground placeholder:text-foreground/30"
                            />
                        </div>
                        <button className="relative p-2 text-foreground/40 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Page body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
