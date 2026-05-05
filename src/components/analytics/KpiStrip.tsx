"use client";
import React from 'react';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { KpiData } from '@/types/analytics';
import { cn } from '@/lib/utils';

const fmt = (n: number) =>
  `R ${n >= 1_000_000 ? (n / 1_000_000).toFixed(2) + 'M' : n >= 1_000 ? (n / 1_000).toFixed(1) + 'k' : n.toLocaleString()}`;

function DeltaBadge({ delta }: { delta: number }) {
  const up = delta >= 0;
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full',
      up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600',
    )}>
      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {up ? '+' : ''}{delta.toFixed(1)}%
    </span>
  );
}

interface Props { data: KpiData; isLoading: boolean }

const CARDS = (d: KpiData) => [
  { label: 'Total Revenue',      value: fmt(d.totalRevenue),      delta: d.revenueDelta   },
  { label: 'Total Orders',       value: d.totalOrders.toString(), delta: d.ordersDelta     },
  { label: 'Avg Order Value',    value: fmt(d.avgOrderValue),     delta: d.aovDelta        },
  { label: 'Active Customers',   value: d.activeCustomers.toString(), delta: d.customersDelta },
];

export default function KpiStrip({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-background rounded-2xl border border-foreground/[0.07] p-6 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {CARDS(data).map(c => (
        <div key={c.label}
          className="bg-background rounded-2xl border border-foreground/[0.07] p-6 hover:border-foreground/15 transition-colors group"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">{c.label}</p>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-foreground/5 text-foreground/30 hover:text-foreground">
              <Download size={12} />
            </button>
          </div>
          <h4 className="font-display text-[2rem] font-light text-foreground tracking-tight leading-none mb-3">
            {c.value}
          </h4>
          <div className="flex items-center gap-2">
            <DeltaBadge delta={c.delta} />
            <span className="text-[11px] font-light text-foreground/30">vs prior period</span>
          </div>
        </div>
      ))}
    </div>
  );
}
