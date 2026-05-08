import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';

export function NoActiveOrder() {
  return (
    <div className="bg-white border border-border rounded-lg p-5 flex flex-col items-center justify-center min-h-[280px] text-center">
      <Package size={40} className="text-gray-400 opacity-40 mx-auto mb-4" />
      <h3 className="text-base font-medium text-[#1a1f1a] mb-2">No active orders</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[220px]">
        Your next order will appear here once placed.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-[#1c3a2a] text-white px-6 py-3 rounded-md text-[11px] font-bold uppercase tracking-widest hover:bg-[#1c3a2a]/90 transition-colors"
      >
        Browse Products
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
