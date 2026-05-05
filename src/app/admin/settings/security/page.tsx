"use client";

import React, { useState } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsSubSection } from "@/components/settings/SettingsSubSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { mockApiKeys, mockAuditLogs } from "@/lib/settings/mock-data";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";
import { Copy, Plus, Trash2, KeyRound } from "lucide-react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApiKey, ApiKeyScope } from "@/types/settings";

const SCOPES: ApiKeyScope[] = ['Read orders', 'Write orders', 'Read customers', 'Read analytics', 'Manage vendors', 'Webhooks'];

export default function SecuritySettingsPage() {
    const { success } = useToast();
    
    // Auth settings (mock local state, no form submission needed for demo)
    const [tfa, setTfa] = useState(false);
    const [timeout, setTimeoutVal] = useState("4 hours");
    const [remember, setRemember] = useState(true);

    // API Keys
    const [keys, setKeys] = useState<ApiKey[]>(mockApiKeys);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState("");
    const [newScopes, setNewScopes] = useState<ApiKeyScope[]>([]);
    
    const [newFullKey, setNewFullKey] = useState<string | null>(null);
    const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);

    const handleCreateKey = () => {
        if (!newName) return;
        const fullKey = `pk_live_${Math.random().toString(36).substr(2, 24)}`;
        const k: ApiKey = {
            id: `ak_${Date.now()}`,
            name: newName,
            keyPreview: fullKey.slice(-8),
            created: new Date().toISOString(),
            lastUsed: null,
            scopes: newScopes
        };
        setKeys([k, ...keys]);
        setNewFullKey(fullKey);
        setShowCreate(false);
        setNewName("");
        setNewScopes([]);
    };

    const handleRevoke = () => {
        if (!keyToRevoke) return;
        setKeys(keys.filter(k => k.id !== keyToRevoke));
        success("API key revoked");
        setKeyToRevoke(null);
    };

    const copyToClipboard = (txt: string) => {
        navigator.clipboard.writeText(txt);
        success("Copied to clipboard");
    };

    return (
        <SettingsSection
            title="Security"
            description="Manage authentication policies, API keys, and review audit logs."
        >
            <SettingsSubSection title="Authentication">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-foreground/[0.07] bg-foreground/[0.01]">
                        <div className="space-y-0.5">
                            <Label className="text-[13px] font-medium text-foreground">Require 2FA for admins</Label>
                            <p className="text-[11px] text-foreground/50">Admins without 2FA will be locked out on next login.</p>
                        </div>
                        <Switch checked={tfa} onCheckedChange={setTfa} className="data-[state=checked]:bg-teal-600" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-foreground/70">Session timeout</Label>
                            <Select value={timeout} onValueChange={setTimeoutVal}>
                                <SelectTrigger className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-foreground/[0.07] bg-background">
                                    <SelectItem value="1 hour">1 hour</SelectItem>
                                    <SelectItem value="4 hours">4 hours</SelectItem>
                                    <SelectItem value="8 hours">8 hours</SelectItem>
                                    <SelectItem value="24 hours">24 hours</SelectItem>
                                    <SelectItem value="Never">Never</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-foreground/[0.07] bg-foreground/[0.01]">
                            <Label className="text-[13px] font-medium text-foreground">Allow "Remember me"</Label>
                            <Switch checked={remember} onCheckedChange={setRemember} className="data-[state=checked]:bg-teal-600" />
                        </div>
                    </div>
                </div>
            </SettingsSubSection>

            <SettingsSubSection title="API Keys">
                <div className="mb-4 text-right">
                    <Button onClick={() => setShowCreate(true)} className="bg-foreground text-background hover:bg-foreground/90 text-[11px] font-medium px-4 rounded-xl h-8">
                        <Plus size={14} className="mr-1.5" /> Generate new key
                    </Button>
                </div>
                <div className="overflow-x-auto border border-foreground/[0.07] rounded-xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-foreground/[0.06] bg-foreground/[0.02] text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Key</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3">Scopes</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/[0.04]">
                            {keys.map(k => (
                                <tr key={k.id} className="hover:bg-foreground/[0.01]">
                                    <td className="px-4 py-3 text-[13px] font-medium">{k.name}</td>
                                    <td className="px-4 py-3 text-[12px] font-mono text-foreground/60">••••••••{k.keyPreview}</td>
                                    <td className="px-4 py-3 text-[11px] text-foreground/50">{new Date(k.created).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {k.scopes.slice(0, 2).map(s => (
                                                <span key={s} className="text-[9px] uppercase tracking-wider bg-foreground/5 px-1.5 py-0.5 rounded text-foreground/60">{s}</span>
                                            ))}
                                            {k.scopes.length > 2 && <span className="text-[9px] uppercase tracking-wider bg-foreground/5 px-1.5 py-0.5 rounded text-foreground/60">+{k.scopes.length - 2}</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500/70 hover:text-red-600 hover:bg-red-50" onClick={() => setKeyToRevoke(k.id)}>
                                            <Trash2 size={13} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {keys.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-[12px] text-foreground/40">No API keys found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </SettingsSubSection>

            <SettingsSubSection title="Audit Log (Recent)">
                <div className="overflow-x-auto border border-foreground/[0.07] rounded-xl mb-3">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-foreground/[0.04]">
                            {mockAuditLogs.map(log => (
                                <tr key={log.id} className="hover:bg-foreground/[0.01]">
                                    <td className="px-4 py-3">
                                        <p className="text-[12px] font-medium text-foreground">{log.action}</p>
                                        <p className="text-[11px] text-foreground/50">{log.resource}</p>
                                    </td>
                                    <td className="px-4 py-3 text-[11px] text-foreground/60">{log.actor}</td>
                                    <td className="px-4 py-3 text-[11px] font-mono text-foreground/40">{log.ipAddress}</td>
                                    <td className="px-4 py-3 text-[11px] text-foreground/50 text-right">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="text-right">
                    <button className="text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/40 hover:text-foreground transition-colors">
                        View full audit log →
                    </button>
                </div>
            </SettingsSubSection>

            {/* Create Dialog */}
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent className="rounded-2xl border-foreground/[0.07] bg-background sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-display font-light text-[1.4rem]">Generate API Key</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-foreground/70">Key Name</Label>
                            <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. ERP Prod Sync" className="rounded-xl border-foreground/[0.1]" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[12px] font-medium text-foreground/70">Permissions</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {SCOPES.map(scope => (
                                    <div key={scope} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`sc-${scope}`} 
                                            checked={newScopes.includes(scope)}
                                            onCheckedChange={(c) => {
                                                if(c) setNewScopes([...newScopes, scope]);
                                                else setNewScopes(newScopes.filter(s => s !== scope));
                                            }}
                                            className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                        />
                                        <Label htmlFor={`sc-${scope}`} className="text-[12px] font-normal leading-none">{scope}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowCreate(false)} className="rounded-xl text-[12px]">Cancel</Button>
                        <Button onClick={handleCreateKey} disabled={!newName || newScopes.length===0} className="rounded-xl bg-foreground text-background hover:bg-foreground/90 text-[12px]">Generate</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Key Reveal Dialog */}
            <Dialog open={!!newFullKey} onOpenChange={(o) => !o && setNewFullKey(null)}>
                <DialogContent className="rounded-2xl border-foreground/[0.07] bg-background sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-display font-light text-[1.4rem] text-teal-700 flex items-center gap-2">
                            <KeyRound size={20} /> Key Generated
                        </DialogTitle>
                        <DialogDescription className="text-[13px] text-foreground/70">
                            Please copy this key now. For security reasons, <strong className="text-foreground">it will not be shown again</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-center gap-2 p-3 bg-foreground/[0.03] border border-foreground/[0.1] rounded-xl font-mono text-[13px] break-all">
                            {newFullKey}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => copyToClipboard(newFullKey!)} className="rounded-xl bg-foreground text-background hover:bg-foreground/90 text-[12px] w-full">
                            <Copy size={14} className="mr-2" /> Copy to clipboard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revoke Confirm */}
            <AlertDialog open={!!keyToRevoke} onOpenChange={(o) => !o && setKeyToRevoke(null)}>
                <AlertDialogContent className="rounded-2xl border-foreground/[0.07] bg-background">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-display font-light text-[1.4rem]">Revoke API Key?</AlertDialogTitle>
                        <AlertDialogDescription className="font-light text-foreground/60 text-[14px]">
                            Any integrations using this key will immediately fail. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-foreground/10 font-medium text-[12px]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRevoke} className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-[12px]">
                            Revoke Key
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </SettingsSection>
    );
}
