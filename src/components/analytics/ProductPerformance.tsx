"use client";
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { SkuRow, SectorRow } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface Props { topSkus: SkuRow[]; sectorData: SectorRow[]; isLoading: boolean }

const SECTOR_COLORS: Record<string, string> = {
  'food-service': '#12271D',
  'agriculture':  '#4A7060',
  'industrial':   '#F59E0B',
};

const fmtR = (v: number) => v >= 1000 ? `R ${(v / 1000).toFixed(0)}k` : `R ${v}`;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-foreground text-background rounded-xl px-4 py-3 text-[12px] space-y-1 shadow-lg">
      <p className="font-medium mb-1 text-background/60 truncate max-w-[160px]">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name}>{p.name}: <span className="font-semibold">{fmtR(p.value)}</span></p>
      ))}
    </div>
  );
}

export default function ProductPerformance({ topSkus, sectorData, isLoading }: Props) {
  const skuData = topSkus.map(s => ({
    name: s.name.length > 24 ? s.name.slice(0, 24) + '…' : s.name,
    revenue: s.revenue,
    fill: SECTOR_COLORS[s.sector],
  }));

  return (
    <div className="bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-foreground/[0.06] flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">Products</p>
          <h3 className="font-display text-[1rem] font-light text-foreground mt-0.5">Product Performance</h3>
        </div>
        <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/30 hover:text-foreground transition-colors">
          <Download size={14} />
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Top SKUs horizontal bar */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40 mb-4">
            Top 8 SKUs by Revenue
          </p>
          {isLoading ? <Skeleton className="h-[240px] rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={skuData} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} horizontal={false} />
                <XAxis type="number" tickFormatter={fmtR}
                  tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.4 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={140}
                  tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', fillOpacity: 0.03 }} />
                <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {skuData.map((s, i) => (
                    <rect key={i} fill={s.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sector grouped bars */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40 mb-4">
            Units Sold vs Revenue by Sector
          </p>
          {isLoading ? <Skeleton className="h-[160px] rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={sectorData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                <XAxis dataKey="sector" tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.5 }}
                  tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.4 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', fillOpacity: 0.03 }} />
                <Bar dataKey="unitsSold" name="Units Sold" fill="#BFC0AC" radius={[4,4,0,0]} maxBarSize={28} />
                <Bar dataKey="revenue"   name="Revenue"    fill="#12271D" radius={[4,4,0,0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sector legend */}
        <div className="flex flex-wrap gap-4">
          {Object.entries(SECTOR_COLORS).map(([sector, color]) => (
            <span key={sector} className="flex items-center gap-1.5 text-[11px] text-foreground/40">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              {sector.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
