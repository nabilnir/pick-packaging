"use client";
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { SegmentData, CustomerRow } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface Props { segmentData: SegmentData; topCustomers: CustomerRow[]; isLoading: boolean }

function StatusBadge({ status }: { status: CustomerRow['status'] }) {
  const s: Record<string, string> = {
    Active:    'bg-emerald-50 text-emerald-700',
    Inactive:  'bg-foreground/5 text-foreground/40',
    Suspended: 'bg-red-50 text-red-600',
  };
  return <span className={cn('text-[10px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full', s[status])}>{status}</span>;
}

export default function CustomerSegments({ segmentData, topCustomers, isLoading }: Props) {
  return (
    <div className="bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">
      <div className="px-6 py-4 border-b border-foreground/[0.06] flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">Customers</p>
          <h3 className="font-display text-[1rem] font-light text-foreground mt-0.5">Customer Segments</h3>
        </div>
        <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/30 hover:text-foreground transition-colors"><Download size={14} /></button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? <Skeleton className="h-[220px] rounded-xl" /> : (
          <div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={segmentData.segments} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {segmentData.segments.map((s, i) => <Cell key={i} fill={s.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-2">
              {segmentData.segments.map(s => (
                <div key={s.name} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.fill }} />
                    <span className="text-foreground/60">{s.name}</span>
                  </span>
                  <span className="font-medium text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {isLoading ? <Skeleton className="h-[220px] rounded-xl" /> : (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40 mb-3">Top 5 by Spend</p>
            <div className="space-y-1">
              {topCustomers.map(c => (
                <div key={c.rank} className="flex items-center gap-3 py-2 border-b border-foreground/[0.05] last:border-0">
                  <span className="text-[11px] font-mono text-foreground/30 w-4 shrink-0">{c.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-[11px] text-foreground/40">{c.orders} orders</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-semibold text-foreground">R {c.totalSpent.toLocaleString()}</p>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
