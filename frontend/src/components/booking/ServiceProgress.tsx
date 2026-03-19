"use client";

import { motion } from "framer-motion";
import { Check, Clock, ShieldCheck, Star, Zap } from "lucide-react";

interface ServiceProgressProps {
    status: string;
}

const steps = [
    { id: 'pending', label: 'Requested', icon: Clock },
    { id: 'confirmed', label: 'Confirmed', icon: ShieldCheck },
    { id: 'in_progress', label: 'In Progress', icon: Zap },
    { id: 'completed', label: 'Finished', icon: Star },
];

export function ServiceProgress({ status }: ServiceProgressProps) {
    const currentStepIndex = steps.findIndex(s => s.id === status);
    const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

    return (
        <div className="py-6 scale-90 sm:scale-100 origin-left">
            <div className="relative flex justify-between items-center w-full max-w-md">
                {/* Connector Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                    className="absolute top-1/2 left-0 h-0.5 bg-sky-600 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out"
                />

                {steps.map((step, index) => {
                    const isActive = index <= activeIndex;
                    const isCurrent = index === activeIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                            <motion.div 
                                initial={false}
                                animate={{ 
                                    scale: isCurrent ? 1.2 : 1,
                                    backgroundColor: isActive ? 'rgb(2 132 199)' : 'rgb(241 245 249)',
                                    color: isActive ? 'white' : 'rgb(148 163 184)'
                                }}
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500 ${isCurrent ? 'ring-4 ring-sky-100' : ''}`}
                            >
                                {isActive && index < activeIndex ? (
                                    <Check className="w-5 h-5 stroke-[3px]" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </motion.div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-sky-600' : 'text-gray-400'} transition-colors duration-500`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
