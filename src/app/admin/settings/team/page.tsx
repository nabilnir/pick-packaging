"use client";

import React, { useState } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mockTeam } from "@/lib/settings/mock-data";
import { AdminUser, AdminRole } from "@/types/settings";
import { useToast } from "@/components/ui/toast-provider";
import { Crown, MoreVertical, Trash2, Mail, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const InviteSchema = z.object({
    email: z.string().email("Invalid email"),
    role: z.enum(["Owner", "Admin", "Viewer"])
});
type InviteForm = z.infer<typeof InviteSchema>;

// Mock current user
const CURRENT_USER_ID = "u_1";

export default function TeamSettingsPage() {
    const { success } = useToast();
    const [team, setTeam] = useState<AdminUser[]>(mockTeam);
    const [userToRemove, setUserToRemove] = useState<AdminUser | null>(null);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<InviteForm>({
        resolver: zodResolver(InviteSchema),
        defaultValues: { role: "Viewer" }
    });

    const onInvite = (data: InviteForm) => {
        const newUser: AdminUser = {
            id: `u_new_${Date.now()}`,
            name: "Pending",
            email: data.email,
            role: data.role as AdminRole,
            status: "Pending invite",
            joined: new Date().toISOString()
        };
        setTeam([...team, newUser]);
        reset({ email: "", role: "Viewer" });
        success(`Invite sent to ${data.email}`);
    };

    const confirmRemove = () => {
        if (!userToRemove) return;
        setTeam(team.filter(u => u.id !== userToRemove.id));
        success(`${userToRemove.name} has been removed.`);
        setUserToRemove(null);
    };

    const changeRole = (id: string, newRole: string) => {
        setTeam(team.map(u => u.id === id ? { ...u, role: newRole as AdminRole } : u));
        success("Role updated.");
    };

    const resendInvite = (email: string) => {
        success(`Invite resent to ${email}`);
    };

    return (
        <SettingsSection
            title="Team & Permissions"
            description="Manage administrative access, roles, and pending invitations."
        >
            <div className="space-y-8">
                
                {/* Invite Section */}
                <div>
                    <h3 className="text-[13px] font-medium uppercase tracking-[0.1em] text-foreground mb-4 border-b border-foreground/[0.07] pb-2">
                        Invite Admin
                    </h3>
                    <div className="flex flex-col md:flex-row items-start gap-4">
                        <div className="flex-1 w-full relative">
                            <Input {...register("email")} placeholder="Email address" className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                            {errors.email && <p className="absolute text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                        <div className="w-full md:w-40 shrink-0 relative">
                            <Controller name="role" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-foreground/[0.07] bg-background">
                                        <SelectItem value="Owner">Owner</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            )} />
                        </div>
                        <Button onClick={handleSubmit(onInvite)} className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/90 text-[12px] font-medium px-6 rounded-xl">
                            Send invite
                        </Button>
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-foreground/[0.03] border border-foreground/[0.05] flex gap-3">
                        <Info size={16} className="text-foreground/40 shrink-0 mt-0.5" />
                        <div className="text-[12px] text-foreground/70 space-y-2">
                            <p><strong className="font-medium text-foreground">Owner:</strong> Full access + billing + danger zone.</p>
                            <p><strong className="font-medium text-foreground">Admin:</strong> All features except danger zone and billing.</p>
                            <p><strong className="font-medium text-foreground">Viewer:</strong> Read-only access across all routes.</p>
                        </div>
                    </div>
                </div>

                {/* Team Table */}
                <div>
                    <h3 className="text-[13px] font-medium uppercase tracking-[0.1em] text-foreground mb-4 border-b border-foreground/[0.07] pb-2">
                        Active Members
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-foreground/[0.05]">
                                {team.map(user => {
                                    const isSelf = user.id === CURRENT_USER_ID;
                                    const canEdit = !isSelf && user.role !== "Owner"; // simplify permission logic for UI
                                    
                                    return (
                                        <tr key={user.id} className="group hover:bg-foreground/[0.01]">
                                            <td className="py-4 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-foreground/[0.06] text-foreground/50 flex items-center justify-center text-[11px] font-medium shrink-0">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-medium text-foreground flex items-center gap-2">
                                                            {user.name} 
                                                            {isSelf && <span className="text-[10px] text-foreground/40 font-light">(you)</span>}
                                                            {user.role === "Owner" && <Crown size={12} className="text-amber-500" />}
                                                        </p>
                                                        <p className="text-[11px] text-foreground/50">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className={cn(
                                                    "text-[10px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full",
                                                    user.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                                )}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2">
                                                <Select disabled={!canEdit} value={user.role} onValueChange={(v) => changeRole(user.id, v)}>
                                                    <SelectTrigger className="w-[100px] h-8 text-[11px] border-none shadow-none bg-transparent hover:bg-foreground/5 rounded-lg focus:ring-0 px-2">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-foreground/[0.07] bg-background">
                                                        <SelectItem value="Owner">Owner</SelectItem>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                        <SelectItem value="Viewer">Viewer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="py-4 pl-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-foreground/40 hover:text-foreground">
                                                            <MoreVertical size={14} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-xl border-foreground/[0.07]">
                                                        {user.status === "Pending invite" && (
                                                            <DropdownMenuItem onClick={() => resendInvite(user.email)} className="text-[12px] cursor-pointer">
                                                                <Mail size={14} className="mr-2 opacity-50" /> Resend invite
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem 
                                                            disabled={!canEdit}
                                                            onClick={() => setUserToRemove(user)} 
                                                            className="text-[12px] text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                        >
                                                            <Trash2 size={14} className="mr-2 opacity-50" /> Revoke access
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Remove confirm dialog */}
            <AlertDialog open={!!userToRemove} onOpenChange={(o) => !o && setUserToRemove(null)}>
                <AlertDialogContent className="rounded-2xl border-foreground/[0.07] bg-background">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-display font-light text-[1.4rem]">Revoke access</AlertDialogTitle>
                        <AlertDialogDescription className="font-light text-foreground/60 text-[14px]">
                            Are you sure you want to remove <strong className="text-foreground">{userToRemove?.name}</strong> from PickPackaging admin? They will lose all access immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-foreground/10 font-medium text-[12px]">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRemove} className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-[12px]">
                            Revoke access
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </SettingsSection>
    );
}
