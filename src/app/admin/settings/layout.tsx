"use client";

import React, { createContext, useContext, useState } from "react";
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    LayoutDashboard, ShoppingBag, Package, Users,
    BarChart3, Settings, Factory, ShieldCheck,
    Settings2, Bell, CreditCard, Building2, Webhook,
    AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

const ADMIN_NAV = [
    { label: "Overview",  href: "/admin",          icon: LayoutDashboard },
    { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag     },
    { label: "Products",  href: "/admin/products",  icon: Package         },
    { label: "Customers", href: "/admin/customers", icon: Users           },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3       },
    { label: "Vendors",   href: "/admin/vendors",   icon: Factory         },
    { label: "Settings",  href: "/admin/settings",  icon: Settings        },
];

const SETTINGS_NAV = [
    { label: "General",       href: "/admin/settings/general",       icon: Settings2 },
    { label: "Team",          href: "/admin/settings/team",          icon: Users },
    { label: "Notifications", href: "/admin/settings/notifications", icon: Bell },
    { label: "Payments",      href: "/admin/settings/payments",      icon: CreditCard },
    { label: "Vendors",       href: "/admin/settings/vendors",       icon: Building2 },
    { label: "Security",      href: "/admin/settings/security",      icon: ShieldCheck },
    { label: "Integrations",  href: "/admin/settings/integrations",  icon: Webhook },
];

interface SettingsContextType {
    setIsDirty: (dirty: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({ setIsDirty: () => {} });

export const useSettingsDirty = () => useContext(SettingsContext);

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isDirty, setIsDirty] = useState(false);
    
    const { showConfirm, setShowConfirm, pendingUrl, setPendingUrl } = useUnsavedChanges(isDirty);

    const handleConfirmDiscard = () => {
        setIsDirty(false);
        setShowConfirm(false);
        if (pendingUrl) {
            router.push(pendingUrl);
        }
    };

    return (
        <SettingsContext.Provider value={{ setIsDirty }}>
            <DashboardLayout items={ADMIN_NAV} title="Administrator">
                
                {/* ── Page Header ─────────────────────────────────────────── */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-foreground/[0.07]">
                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 mb-1">Admin Panel</p>
                        <h1 className="font-display text-[2.2rem] font-light text-foreground tracking-tight">Settings</h1>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 min-h-[calc(100vh-250px)]">
                    
                    {/* ── Left Sidebar (Settings Nav) ──────────────────────── */}
                    <aside className="w-full md:w-[200px] shrink-0">
                        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar md:sticky md:top-6">
                            {SETTINGS_NAV.map(item => {
                                const active = pathname.startsWith(item.href);
                                return (
                                    <Link 
                                        key={item.href} 
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 whitespace-nowrap",
                                            active 
                                                ? "bg-foreground/10 text-foreground" 
                                                : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
                                        )}
                                    >
                                        <item.icon size={16} strokeWidth={active ? 2 : 1.5} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                            
                            <div className="hidden md:block my-4 border-t border-foreground/[0.07]" />
                            
                            <Link 
                                href="/admin/settings/danger"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 whitespace-nowrap",
                                    pathname.startsWith("/admin/settings/danger")
                                        ? "bg-red-50 text-red-600" 
                                        : "text-red-500/70 hover:bg-red-50 hover:text-red-600"
                                )}
                            >
                                <AlertTriangle size={16} strokeWidth={1.5} />
                                Danger Zone
                            </Link>
                        </nav>
                    </aside>

                    {/* ── Content Area ─────────────────────────────────────── */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>

                </div>

                {/* ── Unsaved Changes Dialog ───────────────────────────────── */}
                <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                    <AlertDialogContent className="rounded-2xl border-foreground/[0.07] bg-background">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-display font-light text-[1.4rem]">Unsaved changes</AlertDialogTitle>
                            <AlertDialogDescription className="font-light text-foreground/60 text-[14px]">
                                You have unsaved changes in this section. If you leave now, your changes will be lost.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl border-foreground/10 font-medium text-[12px]">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDiscard} className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-[12px]">
                                Discard changes
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </DashboardLayout>
        </SettingsContext.Provider>
    );
}
