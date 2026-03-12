import React from 'react';

export default function AdminHeader({ title, subtitle, children }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-sm text-slate-500 font-medium italic">{subtitle}</p>}
            </div>
            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
}
