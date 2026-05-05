"use client";

import React, { useState } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsSubSection } from "@/components/settings/SettingsSubSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockWebhooks, mockDeliveryLogs } from "@/lib/settings/mock-data";
import { WebhookEndpoint, WebhookEvent } from "@/types/settings";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";
import { Play, Pause, Trash2, Edit2, Plus, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EVENTS_GROUPED = {
    Orders: ['orders.created', 'orders.updated', 'orders.cancelled', 'orders.fulfilled'],
    Customers: ['customers.registered', 'customers.suspended', 'customers.reactivated'],
    Vendors: ['vendors.registered', 'vendors.verified', 'vendors.suspended'],
    Products: ['products.created', 'products.updated', 'products.out_of_stock']
};

export default function IntegrationsSettingsPage() {
    const { success, error } = useToast();
    
    const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(mockWebhooks);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editEndpoint, setEditEndpoint] = useState<WebhookEndpoint | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form state
    const [url, setUrl] = useState("");
    const [events, setEvents] = useState<WebhookEvent[]>([]);
    const [retry, setRetry] = useState("3 attempts");
    const [secret, setSecret] = useState("");
    const [showSecret, setShowSecret] = useState(false);

    const openCreate = () => {
        setEditEndpoint(null);
        setUrl("");
        setEvents([]);
        setRetry("3 attempts");
        setSecret(`whsec_${Math.random().toString(36).substr(2, 24)}`);
        setSheetOpen(true);
    };

    const openEdit = (wh: WebhookEndpoint) => {
        setEditEndpoint(wh);
        setUrl(wh.url);
        setEvents(wh.events);
        setRetry(wh.retryPolicy);
        setSecret(`whsec_hidden_mock`);
        setSheetOpen(true);
    };

    const handleSave = () => {
        if (!url) return;
        if (editEndpoint) {
            setWebhooks(webhooks.map(w => w.id === editEndpoint.id ? { ...w, url, events, retryPolicy: retry as any } : w));
            success("Webhook updated");
        } else {
            const nw: WebhookEndpoint = {
                id: `wh_${Date.now()}`,
                url, events, retryPolicy: retry as any, status: 'Active',
                lastTriggered: null, successRate: 100
            };
            setWebhooks([...webhooks, nw]);
            success("Webhook created");
        }
        setSheetOpen(false);
    };

    const toggleStatus = (id: string) => {
        setWebhooks(webhooks.map(w => w.id === id ? { ...w, status: w.status === 'Active' ? 'Paused' : 'Active' } : w));
        success("Status updated");
    };

    const handleDelete = () => {
        if (!deleteId) return;
        setWebhooks(webhooks.filter(w => w.id !== deleteId));
        success("Webhook deleted");
        setDeleteId(null);
    };

    const testWebhook = (url: string) => {
        success(`Test payload sent to ${url}`);
    };

    return (
        <SettingsSection
            title="Integrations & Webhooks"
            description="Manage outbound webhooks and view delivery logs to sync PickPackaging with your external systems."
        >
            <SettingsSubSection title="Webhook Endpoints">
                <div className="mb-4 text-right">
                    <Button onClick={openCreate} className="bg-foreground text-background hover:bg-foreground/90 text-[11px] font-medium px-4 rounded-xl h-8">
                        <Plus size={14} className="mr-1.5" /> Add webhook
                    </Button>
                </div>
                
                <div className="overflow-x-auto border border-foreground/[0.07] rounded-xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-foreground/[0.06] bg-foreground/[0.02] text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40">
                                <th className="px-4 py-3">Endpoint URL</th>
                                <th className="px-4 py-3">Events</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Health</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/[0.04]">
                            {webhooks.map(w => (
                                <tr key={w.id} className="hover:bg-foreground/[0.01]">
                                    <td className="px-4 py-3 text-[12px] font-mono text-foreground max-w-[200px] truncate">{w.url}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {w.events.slice(0, 2).map(e => (
                                                <span key={e} className="text-[9px] bg-foreground/5 px-1.5 py-0.5 rounded text-foreground/60">{e}</span>
                                            ))}
                                            {w.events.length > 2 && <span className="text-[9px] bg-foreground/5 px-1.5 py-0.5 rounded text-foreground/60">+{w.events.length - 2}</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "text-[10px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full",
                                            w.status === 'Active' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                        )}>{w.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-[12px] font-medium">
                                        <span className={w.successRate > 90 ? "text-emerald-600" : "text-amber-600"}>{w.successRate}%</span>
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/40 hover:text-foreground" onClick={() => testWebhook(w.url)}>
                                            <Play size={13} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/40 hover:text-foreground" onClick={() => toggleStatus(w.id)}>
                                            {w.status === 'Active' ? <Pause size={13} /> : <Play size={13} />}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/40 hover:text-foreground" onClick={() => openEdit(w)}>
                                            <Edit2 size={13} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500/70 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteId(w.id)}>
                                            <Trash2 size={13} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {webhooks.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-[12px] text-foreground/40">No webhooks configured.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </SettingsSubSection>

            <SettingsSubSection title="Recent Deliveries">
                <div className="overflow-x-auto border border-foreground/[0.07] rounded-xl">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-foreground/[0.04]">
                            {mockDeliveryLogs.map(dl => (
                                <tr key={dl.id} className="hover:bg-foreground/[0.01]">
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "inline-block w-2 h-2 rounded-full mr-2",
                                            dl.status >= 200 && dl.status < 300 ? "bg-emerald-500" :
                                            dl.status >= 400 && dl.status < 500 ? "bg-amber-500" : "bg-red-500"
                                        )} />
                                        <span className="text-[12px] font-mono text-foreground/60">{dl.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-[12px] text-foreground">{dl.event}</td>
                                    <td className="px-4 py-3 text-[11px] font-mono text-foreground/50 max-w-[150px] truncate">{dl.endpointUrl}</td>
                                    <td className="px-4 py-3 text-[11px] text-foreground/40">{dl.responseTimeMs}ms</td>
                                    <td className="px-4 py-3 text-[11px] text-foreground/40 text-right">{new Date(dl.timestamp).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right">
                                        {dl.status >= 400 && (
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-foreground/40 hover:text-foreground" onClick={() => success("Retrying delivery...")}>
                                                <RefreshCw size={12} />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SettingsSubSection>

            {/* Sheet for Create/Edit */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="w-full sm:max-w-md border-l border-foreground/[0.07] bg-background p-0 flex flex-col overflow-y-auto">
                    <SheetHeader className="p-6 border-b border-foreground/[0.06] shrink-0">
                        <SheetTitle className="font-display font-light text-[1.4rem]">
                            {editEndpoint ? "Edit Webhook" : "Add Webhook"}
                        </SheetTitle>
                    </SheetHeader>
                    
                    <div className="p-6 space-y-8 flex-1">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-foreground/70">Endpoint URL</Label>
                            <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://" className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-foreground/70">Secret Key</Label>
                            <div className="flex gap-2">
                                <Input type={showSecret ? "text" : "password"} value={secret} readOnly className="rounded-xl border-foreground/[0.1] bg-foreground/[0.05] font-mono text-[12px]" />
                                <Button variant="outline" size="icon" className="rounded-xl border-foreground/[0.1] shrink-0" onClick={() => setShowSecret(!showSecret)}>
                                    {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-xl border-foreground/[0.1] shrink-0" onClick={() => { navigator.clipboard.writeText(secret); success("Copied"); }}>
                                    <Copy size={14} />
                                </Button>
                            </div>
                            <p className="text-[11px] text-foreground/40 mt-1">Used to verify payload signatures.</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-foreground/70">Retry Policy</Label>
                            <Select value={retry} onValueChange={setRetry}>
                                <SelectTrigger className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-foreground/[0.07] bg-background">
                                    <SelectItem value="3 attempts">3 attempts</SelectItem>
                                    <SelectItem value="5 attempts">5 attempts</SelectItem>
                                    <SelectItem value="No retry">No retry</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-foreground/[0.06]">
                            <Label className="text-[13px] font-medium text-foreground block">Event Subscriptions</Label>
                            {Object.entries(EVENTS_GROUPED).map(([group, evs]) => (
                                <div key={group} className="space-y-2">
                                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/40">{group}</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {evs.map(ev => {
                                            const checked = events.includes(ev as WebhookEvent);
                                            return (
                                                <div key={ev} className="flex items-center space-x-2">
                                                    <Checkbox 
                                                        id={`ev-${ev}`} 
                                                        checked={checked}
                                                        onCheckedChange={(c) => {
                                                            if (c) setEvents([...events, ev as WebhookEvent]);
                                                            else setEvents(events.filter(e => e !== ev));
                                                        }}
                                                        className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 rounded"
                                                    />
                                                    <Label htmlFor={`ev-${ev}`} className="text-[12px] font-normal font-mono text-foreground/80">{ev}</Label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <SheetFooter className="p-6 border-t border-foreground/[0.06] shrink-0 bg-background/95">
                        <Button variant="ghost" onClick={() => setSheetOpen(false)} className="rounded-xl text-[12px]">Cancel</Button>
                        <Button onClick={handleSave} disabled={!url || events.length === 0} className="rounded-xl bg-foreground text-background hover:bg-foreground/90 text-[12px]">Save Webhook</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
                <AlertDialogContent className="rounded-2xl border-foreground/[0.07] bg-background">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-display font-light text-[1.4rem]">Delete Webhook</AlertDialogTitle>
                        <AlertDialogDescription className="font-light text-foreground/60 text-[14px]">
                            Are you sure? This endpoint will no longer receive any payloads.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-foreground/10 font-medium text-[12px]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-[12px]">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </SettingsSection>
    );
}
