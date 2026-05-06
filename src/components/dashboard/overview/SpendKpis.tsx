import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SpendKpiData {
  totalLifetimeSpend: number;
  spentThisMonth: number;
  spendDeltaPct: number;
  totalOrdersPlaced: number;
}

export interface SpendKpisProps {
  data: SpendKpiData | null;
  isLoading: boolean;
}

export function SpendKpis({ data, isLoading }: SpendKpisProps) {
  // Format currency in ZAR (R)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace('ZAR', 'R');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[104px] rounded-lg bg-white border border-gray-200 p-6 flex flex-col justify-between"
          >
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-4"></div>
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
      <div className="rounded-lg bg-white border border-gray-200 p-6 flex flex-col justify-center">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Lifetime Spend</h3>
        <div className="text-3xl font-semibold text-[#1a1f1a]">
          {formatCurrency(data.totalLifetimeSpend)}
        </div>
      </div>

      {/* Spent This Month */}
      <div className="rounded-lg bg-white border border-gray-200 p-6 flex flex-col justify-center">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Spent This Month</h3>
        <div className="flex items-center gap-3">
          <div className="text-3xl font-semibold text-[#1a1f1a]">
            {formatCurrency(data.spentThisMonth)}
          </div>
          <div
            className={cn(
              "flex items-center text-xs font-medium px-2 py-0.5 rounded-md",
              isPositiveDelta
                ? "bg-teal-50 text-teal-700"
                : "bg-red-50 text-red-500"
            )}
          >
            {isPositiveDelta ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
            )}
            {Math.abs(data.spendDeltaPct)}%
          </div>
        </div>
      </div>

      {/* Total Orders Placed */}
      <div className="rounded-lg bg-white border border-gray-200 p-6 flex flex-col justify-center">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Orders Placed</h3>
        <div className="text-3xl font-semibold text-[#1a1f1a]">
          {new Intl.NumberFormat('en-ZA').format(data.totalOrdersPlaced)}
        </div>
      </div>
    </div>
  );
}
