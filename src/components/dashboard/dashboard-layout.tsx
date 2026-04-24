"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Package, 
    Users, 
    BarChart3, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    Search,
    Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface SidebarItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    items: SidebarItem[];
    title: string;
}

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children, items, title }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) return <div className="h-screen bg-[#F9F9F7] flex items-center justify-center italic opacity-20 transition-opacity">Loading secure session...</div>;
    if (!user) return null; // Prevent flicker before redirect

    return (
        <div className="flex h-screen bg-[#F9F9F7]">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-[150] bg-foreground/20 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-[151] w-64 bg-background border-r border-foreground/5 transition-transform duration-300 transform lg:relative lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center text-white font-bold">P</div>
                            <span className="text-[1.1rem] font-bold tracking-tight">PickPacking</span>
                        </Link>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-4 space-y-1">
                        {items.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] transition-all",
                                        active 
                                            ? "bg-foreground text-background font-medium" 
                                            : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
                                    )}
                                >
                                    <item.icon size={20} strokeWidth={active ? 2 : 1.5} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer / Account */}
                    <div className="p-4 border-t border-foreground/5">
                        <div className="p-4 bg-foreground/3 rounded-xl flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center font-bold">
                                {user?.displayName?.[0] || 'U'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[13px] font-bold truncate">{user?.displayName || 'User'}</p>
                                <p className="text-[11px] opacity-40 truncate">{title}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-background border-b border-foreground/5 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-foreground/50 hover:text-foreground"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-[1.25rem] font-light font-display">{pathname.split('/').pop()?.replace(/^\w/, c => c.toUpperCase()) || 'Overview'}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-foreground/3 rounded-full border border-foreground/5 w-64">
                            <Search size={16} className="opacity-30" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="bg-transparent text-[13px] focus:outline-none w-full"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-foreground/50 hover:text-foreground transition-all">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </button>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
