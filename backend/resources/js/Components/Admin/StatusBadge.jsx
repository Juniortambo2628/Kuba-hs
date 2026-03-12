import React from 'react';
import { cn } from '@/lib/utils';

const STATUS_CONFIGS = {
    // Booking Statuses
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    in_progress: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    cancelled: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' },
    
    // User/Provider Statuses
    active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-600' },
    inactive: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-600' },
    suspended: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-600' },
    
    // Role Statuses
    admin: { bg: 'bg-purple-50', text: 'text-purple-600' },
    provider: { bg: 'bg-blue-50', text: 'text-blue-600' },
    customer: { bg: 'bg-emerald-50', text: 'text-emerald-600' },

    // Payment Statuses
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    refunded: { bg: 'bg-red-50', text: 'text-red-500' },
    failed: { bg: 'bg-red-50', text: 'text-red-500' },
    processing: { bg: 'bg-blue-50', text: 'text-blue-600' },

    // Message Statuses
    new: { bg: 'bg-amber-50', text: 'text-amber-600' },
    read: { bg: 'bg-slate-50', text: 'text-slate-500' },
    replied: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
};

export default function StatusBadge({ status, className }) {
    const config = STATUS_CONFIGS[status?.toLowerCase()] || { bg: 'bg-slate-50', text: 'text-slate-500' };
    
    return (
        <span className={cn(
            "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5",
            config.bg,
            config.text,
            config.border && `border ${config.border}`,
            className
        )}>
            {config.dot && <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />}
            {status}
        </span>
    );
}
