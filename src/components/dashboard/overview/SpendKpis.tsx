import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { SpendKpiData } from '@/types/dashboard';

export type { SpendKpiData };

export interface SpendKpisProps {
  data: SpendKpiData | null;
  isLoading: boolean;
}

/** Format ZAR: "R48,600" — prefix R, no space, comma thousands */
const fmt = (value: number) =>
  'R' +
  new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export function SpendKpis({ data, isLoading }: SpendKpisProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-border rounded-lg p-5 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-36" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const isPositiveDelta = data.spendDeltaPct >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Lifetime Spend */}
      <div className="bg-white border border-border rounded-lg p-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
          Total Lifetime Spend
        </p>
        <p className="text-3xl font-semibold text-[#1a1f1a]">
          {fmt(data.totalLifetimeSpend)}
        </p>
      </div>

      {/* Spent This Month */}
      <div className="bg-white border border-border rounded-lg p-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
          Spent This Month
        </p>
        <div className="flex items-center gap-3">
          <p className="text-3xl font-semibold text-[#1a1f1a]">
            {fmt(data.spentThisMonth)}
          </p>
          <span
            className={cn(
              'flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md',
              isPositiveDelta
                ? 'bg-teal-50 text-teal-700'
                : 'bg-red-50 text-red-500'
            )}
          >
            {isPositiveDelta ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {Math.abs(data.spendDeltaPct)}%
          </span>
        </div>
      </div>

      {/* Total Orders */}
      <div className="bg-white border border-border rounded-lg p-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
          Total Orders Placed
        </p>
        <p className="text-3xl font-semibold text-[#1a1f1a]">
          {new Intl.NumberFormat('en-ZA').format(data.totalOrdersPlaced)}
        </p>
      </div>
    </div>
  );
}
