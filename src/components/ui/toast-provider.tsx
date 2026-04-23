"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ─────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info' | 'warning' | 'cart';

interface ToastItem {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    image?: string;
    duration?: number;
}

interface ToastContextType {
    toast: (opts: Omit<ToastItem, 'id'>) => void;
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    cartToast: (productName: string, image?: string) => void;
}

// ─── Context ───────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

// ─── Icons map ─────────────────────────────────────────────────────────────
const ICONS: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
    error:   <AlertCircle  size={18} className="text-red-500 shrink-0" />,
    info:    <Info         size={18} className="text-sky-500 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
    cart:    <ShoppingBag  size={18} className="text-brand-green shrink-0" />,
};

const ACCENT: Record<ToastType, string> = {
    success: 'bg-emerald-500',
    error:   'bg-red-500',
    info:    'bg-sky-500',
    warning: 'bg-amber-500',
    cart:    'bg-brand-green',
};

// ─── Individual toast ──────────────────────────────────────────────────────
function Toast({ item, onClose }: { item: ToastItem; onClose: (id: string) => void }) {
    const [leaving, setLeaving] = React.useState(false);

    const handleClose = () => {
        setLeaving(true);
        setTimeout(() => onClose(item.id), 300);
    };

    React.useEffect(() => {
        const t = setTimeout(handleClose, item.duration ?? 4000);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className={cn(
                "relative flex items-start gap-4 w-full max-w-[380px] bg-background rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-foreground/5 p-4 overflow-hidden",
                "transition-all duration-300 ease-out",
                leaving
                    ? "opacity-0 translate-x-6 scale-95"
                    : "opacity-100 translate-x-0 scale-100"
            )}
        >
            {/* Accent bar */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl", ACCENT[item.type])} />

            {/* Product image (cart toast only) */}
            {item.image && item.type === 'cart' && (
                <div className="relative w-12 h-12 rounded-xl bg-foreground/5 shrink-0 overflow-hidden ml-2">
                    <img src={item.image} alt="" className="w-full h-full object-contain p-1" />
                </div>
            )}

            {/* Icon (non-cart) */}
            {!item.image && (
                <div className="mt-0.5 ml-2">
                    {ICONS[item.type]}
                </div>
            )}

            {/* Text */}
            <div className="flex-1 min-w-0 pr-2">
                <p className="text-[14px] font-medium text-foreground leading-snug">
                    {item.title}
                </p>
                {item.description && (
                    <p className="text-[12px] text-foreground/50 mt-0.5 font-light leading-snug">
                        {item.description}
                    </p>
                )}
            </div>

            {/* Close */}
            <button
                onClick={handleClose}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors text-foreground/30 hover:text-foreground"
                aria-label="Dismiss"
            >
                <X size={14} />
            </button>
        </div>
    );
}

// ─── Provider ──────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const counter = useRef(0);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((opts: Omit<ToastItem, 'id'>) => {
        const id = `toast-${++counter.current}`;
        setToasts(prev => [...prev.slice(-4), { ...opts, id }]); // keep max 5
    }, []);

    const helpers: ToastContextType = {
        toast:     addToast,
        success:  (title, description) => addToast({ type: 'success', title, description }),
        error:    (title, description) => addToast({ type: 'error',   title, description }),
        info:     (title, description) => addToast({ type: 'info',    title, description }),
        warning:  (title, description) => addToast({ type: 'warning', title, description }),
        cartToast: (productName, image) => addToast({
            type: 'cart',
            title: `Added to cart`,
            description: productName,
            image,
            duration: 3500,
        }),
    };

    return (
        <ToastContext.Provider value={helpers}>
            {children}

            {/* ── Toast portal ──── bottom-right stack */}
            <div
                aria-live="polite"
                aria-label="Notifications"
                className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 items-end pointer-events-none"
            >
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto">
                        <Toast item={t} onClose={dismiss} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
