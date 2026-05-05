"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useUnsavedChanges(isDirty: boolean) {
    const pathname = usePathname();
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    // Simple hack for intercepting clicks on Next.js links since route interception is tricky
    // A true robust solution would use a custom router or context, but this covers standard link clicks.
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a');
            if (target && target.href && isDirty) {
                const url = new URL(target.href);
                if (url.origin === window.location.origin && url.pathname !== pathname) {
                    e.preventDefault();
                    setPendingUrl(url.pathname);
                    setShowConfirm(true);
                }
            }
        };

        document.addEventListener('click', handleClick, { capture: true });
        return () => document.removeEventListener('click', handleClick, { capture: true });
    }, [isDirty, pathname]);

    return {
        showConfirm,
        setShowConfirm,
        pendingUrl,
        setPendingUrl
    };
}
