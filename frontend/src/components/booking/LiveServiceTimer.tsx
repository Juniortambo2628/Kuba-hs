"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";

interface LiveServiceTimerProps {
  startedAt: string;
  completedAt?: string | null;
  basePrice: number;
  pricingType: "hourly" | "fixed";
  status: string;
}

export function LiveServiceTimer({
  startedAt,
  completedAt,
  basePrice,
  pricingType,
  status,
}: LiveServiceTimerProps) {
  const [elapsed, setElapsed] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!startedAt) return;

    const calculateElapsed = () => {
      const start = new Date(startedAt).getTime();
      const end = completedAt ? new Date(completedAt).getTime() : Date.now();
      return Math.max(0, Math.floor((end - start) / 1000));
    };

    setElapsed(calculateElapsed());

    if (status === "in_progress" && !completedAt) {
      setTimerActive(true);
      const interval = setInterval(() => {
        setElapsed(calculateElapsed());
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimerActive(false);
    }
  }, [startedAt, completedAt, status]);

  const formatTime = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    const zeroPad = (num: number | undefined) => String(num || 0).padStart(2, "0");
    return `${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`;
  };

  const calculateLiveCost = () => {
    if (pricingType !== "hourly") return basePrice;
    const hours = Math.max(1, Math.ceil(elapsed / 3600));
    return basePrice * hours;
  };

  const liveCost = calculateLiveCost();

  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-premium group transition-all duration-500 hover:shadow-2xl">
      {/* Background Pulse for Active State */}
      <AnimatePresence>
        {timerActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-emerald-500 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${timerActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-sky-50 text-sky-600 dark:bg-sky-500/10'}`}>
              {timerActive ? <Zap className="w-5 h-5 animate-pulse" /> : <Clock className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                {timerActive ? "Service Live" : "Session Summary"}
              </p>
              <h3 className="font-black text-lg text-slate-800 dark:text-white tracking-tighter">
                {timerActive ? "Execution in Progress" : "Service Completed"}
              </h3>
            </div>
          </div>
          
          {timerActive && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Duration Elapsed</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black italic tracking-tighter text-slate-800 dark:text-white tabular-nums">
                {formatTime(elapsed)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              {pricingType === 'hourly' ? 'Running Cost (Hourly)' : 'Final Cost (Flat)'}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black italic tracking-tighter text-sky-600 tabular-nums">
                KES {liveCost.toLocaleString()}
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-500 mb-1" />
            </div>
          </div>
        </div>

        {pricingType === 'hourly' && timerActive && (
          <p className="text-[9px] font-bold text-gray-400 italic">
            * Cost is rounded up to the nearest hour. Current rate: KES {basePrice.toLocaleString()}/hr
          </p>
        )}
        
        {!timerActive && status === 'completed' && (
          <div className="flex items-center gap-2 pt-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
            <CheckCircle2 className="w-4 h-4" /> Finalized & Locked
          </div>
        )}
      </div>
    </div>
  );
}
