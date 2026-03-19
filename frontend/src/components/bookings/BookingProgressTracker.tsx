"use client";

import { CheckCircle2, Clock, CreditCard, Check, Circle } from "lucide-react";

interface BookingProgressTrackerProps {
    status: string;
    paymentStatus: string;
}

export function BookingProgressTracker({ status, paymentStatus }: BookingProgressTrackerProps) {
    const steps = [
        { id: 'pending', label: 'Requested', sub: 'Waiting for provider', icon: <Clock className="w-5 h-5" /> },
        { id: 'confirmed', label: 'Confirmed', sub: 'Provider accepted', icon: <CheckCircle2 className="w-5 h-5" /> },
        { id: 'paid', label: 'Payment', sub: 'Securely processed', icon: <CreditCard className="w-5 h-5" /> },
        { id: 'completed', label: 'Finished', sub: 'Service delivered', icon: <Check className="w-5 h-5" /> },
    ];

    const getCurrentStep = () => {
        if (status === 'cancelled') return -1;
        if (status === 'completed') return 3;
        if (paymentStatus === 'paid') return 2;
        if (status === 'confirmed') return 1;
        return 0; // pending
    };

    const currentStep = getCurrentStep();

    if (status === 'cancelled') {
        return (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-6 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
                    <Circle className="w-6 h-6 fill-current opacity-20" />
                </div>
                <div>
                    <h3 className="font-bold text-red-900 dark:text-red-400">Booking Cancelled</h3>
                    <p className="text-xs text-red-700/70 dark:text-red-400/70 font-medium">This service request has been terminated.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4">
            <div className="relative flex justify-between">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 w-full h-0.5 bg-muted -z-10">
                    <div 
                        className="h-full bg-blue-600 transition-all duration-1000" 
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step, i) => {
                    const isActive = i <= currentStep;
                    const isCurrent = i === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center text-center max-w-[100px] relative">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white dark:border-[#0B0F19] ${
                                isActive 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110" 
                                : "bg-muted text-muted-foreground scale-100"
                            }`}>
                                {step.icon}
                            </div>
                            <div className="mt-4 space-y-1">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                                    {step.label}
                                </p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-50 leading-tight">
                                    {step.sub}
                                </p>
                            </div>
                            {isCurrent && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <div className="bg-blue-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter animate-bounce">
                                        Active
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
