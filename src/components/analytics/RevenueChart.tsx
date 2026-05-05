"use client";
import React, { useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { RevenuePoint } from '@/types/analytics';
import { cn } from '@/lib/utils';

type Granularity = 'daily' | 'monthly';

interface Props {
  data: RevenuePoint[];
  isLoading: boolean;
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
}

const fmtR = (v: number) =>
  v >= 1_000_000 ? `R ${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000  ? `R ${(v / 1_000).toFixed(0)}k`
  : `R ${v}`;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-foreground text-background rounded-xl px-4 py-3 text-[12px] space-y-1 shadow-lg">
      <p className="font-medium mb-1 text-background/60">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name}>{p.name}: <span className="font-semibold">{fmtR(p.value)}</span></p>
      ))}
    </div>
  );
}

export default function RevenueChart({ data, isLoading, granularity, onGranularityChange }: Props) {
  const chartData = data.map(d => ({
    ...d,
    label: format(parseISO(d.date), granularity === 'daily' ? 'd MMM' : 'MMM yy'),
  }));

  return (
    <div className="bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-foreground/[0.06] flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">Revenue</p>
          <h3 className="font-display text-[1rem] font-light text-foreground mt-0.5">Revenue Over Time</h3>
        </div>
        <div className="flex items-center gap-3">
          {/* Granularity toggle */}
          <div className="flex items-center bg-foreground/[0.04] rounded-lg p-0.5">
            {(['daily', 'monthly'] as Granularity[]).map(g => (
              <button key={g} onClick={() => onGranularityChange(g)}
                className={cn(
                  'text-[11px] font-medium uppercase tracking-[0.1em] px-3 py-1.5 rounded-md transition-all',
                  granularity === g
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-foreground/40 hover:text-foreground',
                )}>
                {g}
              </button>
            ))}
          </div>
          <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/30 hover:text-foreground transition-colors">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor"
                className="text-foreground" strokeOpacity={0.06} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.4 }}
                tickLine={false} axisLine={false} />
              <YAxis tickFormatter={fmtR} tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.4 }}
                tickLine={false} axisLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', fillOpacity: 0.03 }} />
              <Bar dataKey="grossRevenue" name="Gross Revenue" fill="#BFC0AC" radius={[4,4,0,0]} maxBarSize={32} />
              <Line dataKey="netRevenue" name="Net Revenue" stroke="#12271D" strokeWidth={2}
                dot={false} activeDot={{ r: 4, fill: '#12271D' }} type="monotone" />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="px-6 pb-4 flex items-center gap-5">
        <span className="flex items-center gap-1.5 text-[11px] text-foreground/40">
          <span className="w-3 h-3 rounded-sm bg-[#BFC0AC] inline-block" /> Gross Revenue
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-foreground/40">
          <span className="w-3 h-0.5 bg-[#12271D] inline-block" /> Net Revenue
        </span>
      </div>
    </div>
  );
}
