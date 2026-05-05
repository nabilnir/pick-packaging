"use client";
import React from 'react';
import { Download, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { FunnelStage } from '@/types/analytics';

interface Props { stages: FunnelStage[]; isLoading: boolean }

export default function ProcurementFunnel({ stages, isLoading }: Props) {
  const sessionCount = stages[0]?.value ?? 1;
  const orderCount   = stages[stages.length - 1]?.value ?? 0;
  const overallRate  = ((orderCount / sessionCount) * 100).toFixed(1);

  return (
    <div className="bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-foreground/[0.06] flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">Conversion</p>
          <h3 className="font-display text-[1rem] font-light text-foreground mt-0.5">Procurement Funnel</h3>
        </div>
        <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/30 hover:text-foreground transition-colors">
          <Download size={14} />
        </button>
      </div>

      <div className="p-6">
        {isLoading ? (
          <Skeleton className="h-[320px] rounded-xl" />
        ) : (
          <div className="flex flex-col items-center gap-0">
            {stages.map((stage, i) => {
              const maxW = 100;
              const pct  = (stage.value / sessionCount) * maxW;
              const prev = stages[i - 1];
              const dropoff = prev
                ? (((prev.value - stage.value) / prev.value) * 100).toFixed(0)
                : null;
              const convRate = prev
                ? ((stage.value / prev.value) * 100).toFixed(0)
                : '100';

              return (
                <React.Fragment key={stage.name}>
                  {/* Drop-off label between stages */}
                  {dropoff && (
                    <div className="flex items-center gap-1.5 py-1.5 text-[11px] text-foreground/35 font-medium">
                      <ArrowDown size={11} className="text-red-400" />
                      <span className="text-red-400">{dropoff}% drop-off</span>
                      <span className="text-foreground/20">·</span>
                      <span>{convRate}% converted</span>
                    </div>
                  )}

                  {/* Funnel bar */}
                  <div className="w-full flex flex-col items-center">
                    <div
                      className="flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-300"
                      style={{
                        width:      `${Math.max(pct, 28)}%`,
                        background: stage.fill,
                        minWidth:   120,
                      }}
                    >
                      <span className="text-[11px] font-medium text-white/80 truncate">{stage.name}</span>
                      <span className="text-[13px] font-semibold text-white ml-3 shrink-0">
                        {stage.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {!isLoading && (
          <div className="mt-6 pt-4 border-t border-foreground/[0.06] text-center">
            <p className="text-[13px] font-light text-foreground/50">
              <span className="font-semibold text-foreground">{overallRate}%</span> of sessions convert to orders
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
