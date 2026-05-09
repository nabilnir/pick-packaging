"use client";

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Order } from '@/types/dashboard';

export interface CancellationModalProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

const REASONS = [
  'Ordered by mistake',
  'Duplicate order',
  'Changed vendor',
  'Price too high',
  'Other',
] as const;

type Reason = typeof REASONS[number];

export function CancellationModal({ order, open, onClose }: CancellationModalProps) {
  const [reason, setReason]       = useState<Reason | ''>('');
  const [otherText, setOtherText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOther   = reason === 'Other';
  const canSubmit = reason !== '' && (!isOther || otherText.trim().length > 0);

  const handleClose = () => {
    setReason('');
    setOtherText('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      // Fire cancellation request to API
      await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: isOther ? otherText.trim() : reason,
        }),
      });

      toast.success(`Cancellation request submitted for ${order.orderNumber}`);
      handleClose();
    } catch {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-[#1a1f1a]">
            Request Cancellation
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground font-mono">
            {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Reason select */}
          <div className="space-y-2">
            <label
              htmlFor="cancel-reason"
              className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium"
            >
              Reason for cancellation <span className="text-red-500">*</span>
            </label>
            <select
              id="cancel-reason"
              value={reason}
              onChange={e => setReason(e.target.value as Reason | '')}
              required
              className="w-full px-3 py-2.5 border border-border rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[#1c3a2a] text-[#1a1f1a]"
            >
              <option value="" disabled>Select a reason…</option>
              {REASONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* "Other" textarea */}
          {isOther && (
            <div className="space-y-2">
              <label
                htmlFor="cancel-other"
                className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium"
              >
                Please describe <span className="text-red-500">*</span>
              </label>
              <textarea
                id="cancel-other"
                value={otherText}
                onChange={e => setOtherText(e.target.value)}
                placeholder="Tell us more about your reason…"
                rows={3}
                className="w-full px-3 py-2.5 border border-border rounded-md bg-transparent text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#1c3a2a] placeholder:text-muted-foreground"
              />
            </div>
          )}

          {/* Warning */}
          <div className="flex gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-md">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Cancellation requests are reviewed within 2 business hours. Orders already
              in <strong>PACKING</strong> stage cannot be cancelled.
            </p>
          </div>

          <DialogFooter className="gap-3 sm:gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 py-2.5 border border-border rounded-md text-sm font-bold uppercase tracking-widest text-[#1a1f1a] hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="flex-1 py-2.5 bg-[#1c3a2a] text-white rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
