"use client";

import React, { useState } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { AlertTriangle, DownloadCloud, PowerOff, Trash2 } from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// Mock role check
const IS_OWNER = true; 

export default function DangerZonePage() {
    const { success, error } = useToast();

    const [isSuspended, setIsSuspended] = useState(false);
    const [actionDialog, setActionDialog] = useState<"suspend" | "delete" | null>(null);
    const [confirmText, setConfirmText] = useState("");

    const handleExport = async () => {
        if (!IS_OWNER) return;
        success("Export requested. It will be emailed to you within 24 hours.");
    };

    const handleSuspendConfirm = () => {
        if (confirmText !== "SUSPEND") {
            error("Confirmation text did not match.");
            return;
        }
        setIsSuspended(true);
        success("Platform suspended.");
        setActionDialog(null);
        setConfirmText("");
    };

    const handleDeleteConfirm = () => {
        if (confirmText !== "PickPackaging") {
            error("Workspace name did not match.");
            return;
        }
        success("Account scheduled for deletion. You will be logged out.");
        setActionDialog(null);
        setConfirmText("");
    };

    const Card = ({ 
        title, desc, btnText, icon: Icon, onClick, destructive = false, disabled = false 
    }: any) => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-xl border-l-4 border-l-red-500 border border-y-foreground/[0.07] border-r-foreground/[0.07] bg-background gap-4">
            <div>
                <h4 className="text-[14px] font-medium text-foreground flex items-center gap-2">
                    <Icon size={16} className="text-red-500" /> {title}
                </h4>
                <p className="text-[12px] font-light text-foreground/60 mt-1 max-w-lg">{desc}</p>
            </div>
            <div className="shrink-0 group relative">
                <Button 
                    onClick={onClick} 
                    disabled={disabled}
                    variant={destructive ? "outline" : "default"}
                    className={cn(
                        "rounded-xl text-[12px] font-medium px-6 h-9 transition-colors",
                        destructive 
                            ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 hover:border-red-300" 
                            : "bg-red-600 text-white hover:bg-red-700"
                    )}
                >
                    {btnText}
                </Button>
                {disabled && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                        Owner access required
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <SettingsSection
            title="Danger Zone"
            description="Irreversible and highly destructive actions. Proceed with extreme caution."
        >
            <div className="space-y-4">
                
                <Card 
                    title="Export all data"
                    desc="Download a full export of all platform data (users, orders, catalogs) in JSON format for POPIA compliance."
                    btnText="Request export"
                    icon={DownloadCloud}
                    onClick={handleExport}
                    disabled={!IS_OWNER}
                    destructive={false}
                />

                <Card 
                    title={isSuspended ? "Platform is suspended" : "Suspend platform"}
                    desc="Temporarily disable all buyer-facing pages. Active vendor integrations and existing orders remain unaffected."
                    btnText={isSuspended ? "Reactivate platform" : "Suspend platform"}
                    icon={PowerOff}
                    onClick={() => {
                        if (isSuspended) { setIsSuspended(false); success("Platform active"); }
                        else setActionDialog("suspend");
                    }}
                    disabled={!IS_OWNER}
                    destructive={true}
                />

                <Card 
                    title="Delete workspace"
                    desc="Permanently delete this PickPackaging workspace, all associated data, and cancel subscriptions. This cannot be undone."
                    btnText="Delete workspace"
                    icon={Trash2}
                    onClick={() => setActionDialog("delete")}
                    disabled={!IS_OWNER}
                    destructive={true}
                />

            </div>

            {/* Suspend Dialog */}
            <AlertDialog open={actionDialog === "suspend"} onOpenChange={(o) => !o && setActionDialog(null)}>
                <AlertDialogContent className="rounded-2xl border-red-500/20 bg-background sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-display font-light text-[1.4rem] text-red-600">Suspend Platform</AlertDialogTitle>
                        <AlertDialogDescription className="font-light text-foreground/60 text-[14px]">
                            Customers will see a maintenance page. To confirm, please type <strong className="text-foreground select-all">SUSPEND</strong> below.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Input 
                            value={confirmText} 
                            onChange={e => setConfirmText(e.target.value)} 
                            className="rounded-xl border-foreground/[0.1] font-mono text-[12px]" 
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-foreground/10 font-medium text-[12px]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSuspendConfirm} disabled={confirmText !== "SUSPEND"} className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-[12px]">
                            Suspend Platform
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Dialog */}
            <AlertDialog open={actionDialog === "delete"} onOpenChange={(o) => !o && setActionDialog(null)}>
                <AlertDialogContent className="rounded-2xl border-red-500/20 bg-background sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-display font-light text-[1.4rem] text-red-600">Delete Workspace</AlertDialogTitle>
                        <AlertDialogDescription className="font-light text-foreground/60 text-[14px]">
                            This is permanent. All data will be wiped. To confirm, please type <strong className="text-foreground select-all">PickPackaging</strong> below.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Input 
                            value={confirmText} 
                            onChange={e => setConfirmText(e.target.value)} 
                            className="rounded-xl border-foreground/[0.1] font-mono text-[12px]" 
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-foreground/10 font-medium text-[12px]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} disabled={confirmText !== "PickPackaging"} className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-[12px]">
                            Permanently Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </SettingsSection>
    );
}
