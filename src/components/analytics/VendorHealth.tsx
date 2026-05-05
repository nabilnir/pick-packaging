"use client";
import React, { useState } from 'react';
import { CheckCircle2, Minus, Download, ArrowUpDown, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import type { VendorRow } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface Props { vendors: VendorRow[]; isLoading: boolean }

type SortKey = 'ordersFulfilled' | 'slaRate' | 'revenueContributed';

const STATUS_CHIP: Record<string, string> = {
  'Active':         'bg-emerald-50 text-emerald-700',
  'Audit Required': 'bg-amber-50 text-amber-700',
  'Suspended':      'bg-red-50 text-red-600',
};

export default function VendorHealth({ vendors, isLoading }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('slaRate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...vendors].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortDir === 'desc' ? -diff : diff;
  });

  const verifiedCount = vendors.filter(v => v.verified).length;
  const avgSla = vendors.length
    ? (vendors.reduce((s, v) => s + v.slaRate, 0) / vendors.length).toFixed(1)
    : '0';

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const ColHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="px-4 py-3 font-medium cursor-pointer hover:text-foreground/70 transition-colors select-none"
      onClick={() => toggleSort(k)}
    >
      <span className="flex items-center gap-1">
        {label} <ArrowUpDown size={10} className={sortKey === k ? 'opacity-60' : 'opacity-20'} />
      </span>
    </th>
  );

  return (
    <div className="bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-foreground/[0.06] flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">Suppliers</p>
          <h3 className="font-display text-[1rem] font-light text-foreground mt-0.5">Vendor / Supplier Health</h3>
        </div>
        <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/30 hover:text-foreground transition-colors">
          <Download size={14} />
        </button>
      </div>

      {/* KPI pills */}
      <div className="px-6 pt-4 pb-0 flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-foreground/[0.04] rounded-full px-3 py-1.5">
          <span className="text-[11px] text-foreground/40 font-medium">Verified</span>
          <span className="text-[12px] font-semibold text-foreground">{verifiedCount} of {vendors.length}</span>
        </div>
        <div className="flex items-center gap-2 bg-foreground/[0.04] rounded-full px-3 py-1.5">
          <span className="text-[11px] text-foreground/40 font-medium">Avg SLA Rate</span>
          <span className="text-[12px] font-semibold text-foreground">{avgSla}%</span>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 overflow-x-auto">
        {isLoading ? (
          <Skeleton className="h-[280px] rounded-xl" />
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/30 border-b border-foreground/[0.06]">
                <th className="px-4 py-3 font-medium">Vendor</th>
                <ColHeader label="Orders" k="ordersFulfilled" />
                <ColHeader label="SLA Rate" k="slaRate" />
                <ColHeader label="Revenue" k="revenueContributed" />
                <th className="px-4 py-3 font-medium">Verified</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/[0.05]">
              {sorted.slice(0, 10).map(v => (
                <tr
                  key={v.name}
                  className={cn(
                    'hover:bg-foreground/[0.02] transition-colors',
                    v.slaRate < 85 && v.slaRate > 0 && 'border-l-2 border-amber-400',
                  )}
                >
                  <td className="px-4 py-3 text-[13px] font-medium text-foreground max-w-[160px] truncate">{v.name}</td>
                  <td className="px-4 py-3 text-[13px] text-foreground/60">{v.ordersFulfilled}</td>
                  <td className="px-4 py-3 text-[13px] font-medium">
                    <span className={cn(v.slaRate < 85 && v.slaRate > 0 ? 'text-amber-600' : 'text-foreground/70')}>
                      {v.slaRate > 0 ? `${v.slaRate}%` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-foreground/60">
                    {v.revenueContributed > 0 ? `R ${v.revenueContributed.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {v.verified
                      ? <CheckCircle2 size={15} className="text-emerald-600" />
                      : <Minus size={15} className="text-foreground/20" />}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-[10px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full',
                      STATUS_CHIP[v.status] ?? 'bg-foreground/5 text-foreground/40',
                    )}>{v.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-6 pb-5">
        <Link href="/admin/vendors"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground/40 hover:text-foreground transition-colors uppercase tracking-[0.12em]">
          View all vendors <ExternalLink size={11} />
        </Link>
      </div>
    </div>
  );
}
