"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OrdersPaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export function OrdersPagination({ total, page, pageSize, onChange }: OrdersPaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 0) return null;

  const startRange = (page - 1) * pageSize + 1;
  const endRange   = Math.min(page * pageSize, total);

  // Simple range of pages to show
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
      {/* "Showing X-Y of Z" text */}
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-[#1a1f1a]">{startRange}–{endRange}</span> of <span className="font-medium text-[#1a1f1a]">{total}</span> orders
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-md border border-border bg-white text-muted-foreground hover:text-[#1a1f1a] hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1 px-2">
          {getPageNumbers().map(p => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                "w-9 h-9 rounded-md text-[13px] font-bold transition-all",
                p === page
                  ? "bg-[#1c3a2a] text-white shadow-sm"
                  : "bg-white border border-border text-muted-foreground hover:border-[#1c3a2a]/20 hover:bg-teal-50/30 hover:text-[#1c3a2a]"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-md border border-border bg-white text-muted-foreground hover:text-[#1a1f1a] hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
