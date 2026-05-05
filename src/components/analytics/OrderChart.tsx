"use client";
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Label,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { OrderAnalyticsData } from '@/types/analytics';
import { cn } from '@/lib/utils';

type Tab = 'volume' | 'distribution';

interface Props { data: OrderAnalyticsData; isLoading: boolean }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-foreground text-background rounded-xl px-4 py-3 text-[12px] space-y-1 shadow-lg">
      <p className="font-medium mb-1 text-background/60">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name}>{p.name}: <span className="font-semibold">{p.value}</span></p>
      ))}
    </div>
  );
}

export default function OrderChart({ data, isLoading }: Props) {
  const [tab, setTab] = useState<Tab>('volume');

  const chartData = data.daily.map(d => ({
    ...d,
    label: format(parseISO(d.date), 'd MMM'),
  }));

  return (
    <div className="bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-foreground/[0.06] flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">Orders</p>
          <h3 className="font-display text-[1rem] font-light text-foreground mt-0.5">Order Analytics</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-foreground/[0.04] rounded-lg p-0.5">
            {([['volume', 'Volume'], ['distribution', 'Status']] as [Tab, string][]).map(([t, l]) => (
              <button key={t} onClick={() => setTab(t)}
                className={cn(
                  'text-[11px] font-medium uppercase tracking-[0.1em] px-3 py-1.5 rounded-md transition-all',
                  tab === t ? 'bg-foreground text-background shadow-sm' : 'text-foreground/40 hover:text-foreground',
                )}>
                {l}
              </button>
            ))}
          </div>
          <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/30 hover:text-foreground transition-colors">
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <Skeleton className="h-[240px] w-full rounded-xl" />
        ) : tab === 'volume' ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.4 }}
                tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.4 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', fillOpacity: 0.03 }} />
              <Bar dataKey="fulfilled" name="Fulfilled" stackId="a" fill="#12271D" maxBarSize={24} />
              <Bar dataKey="pending"   name="Pending"   stackId="a" fill="#F59E0B" maxBarSize={24} />
              <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#EF4444" radius={[4,4,0,0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[240px]">
            <ResponsiveContainer width="60%" height={240}>
              <PieChart>
                <Pie data={data.byStatus} dataKey="value" nameKey="status"
                  innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {data.byStatus.map((s, i) => (
                    <Cell key={i} fill={s.fill} />
                  ))}
                  <Label
                    content={({ viewBox }: any) => {
                      const { cx, cy } = viewBox;
                      return (
                        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={cx} dy="-6" fontSize={26} fontWeight={300} fill="#12271D">
                            {data.totalOrders}
                          </tspan>
                          <tspan x={cx} dy="20" fontSize={10} fill="#12271D" opacity={0.4}>
                            TOTAL ORDERS
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
                <Tooltip formatter={(v: any, name: any) => [v, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {data.byStatus.map(s => (
                <div key={s.status} className="flex items-center gap-2 text-[12px]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.fill }} />
                  <span className="text-foreground/60">{s.status}</span>
                  <span className="font-medium text-foreground ml-1">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stat pills */}
      <div className="px-6 pb-5 flex flex-wrap gap-3 border-t border-foreground/[0.06] pt-4">
        {[
          { label: 'Fulfillment Rate', value: `${data.fulfillmentRate}%` },
          { label: 'Avg Processing', value: `${data.avgProcessingHours}h` },
          { label: 'Cancellation Rate', value: `${data.cancellationRate}%` },
        ].map(p => (
          <div key={p.label} className="flex items-center gap-2 bg-foreground/[0.04] rounded-full px-3 py-1.5">
            <span className="text-[11px] text-foreground/40 font-medium">{p.label}</span>
            <span className="text-[12px] font-semibold text-foreground">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
