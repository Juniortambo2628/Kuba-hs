"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ShieldCheck } from "lucide-react";
import type { BookingForm, BookingValues } from "@/components/booking/booking-modal-types";

interface BookingScheduleStepProps {
  form: BookingForm;
  promoDiscount: { amount: number; code: string } | null;
  promoError: string | null;
  isValidatingPromo: boolean;
  onValidatePromo: () => void;
}

export function BookingScheduleStep({
  form,
  promoDiscount,
  promoError,
  isValidatingPromo,
  onValidatePromo,
}: BookingScheduleStepProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="scheduled_date"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-sm font-bold text-gray-900 dark:text-white">Preferred Date</FormLabel>
            <FormControl>
              <Input type="date" className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="scheduled_time"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-sm font-bold text-gray-900 dark:text-white">Preferred Time</FormLabel>
            <FormControl>
              <Input type="time" className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Card className="bg-blue-50 dark:bg-blue-600/5 border-blue-100 dark:border-blue-600/20 rounded-2xl">
        <CardContent className="p-4 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            The professional will confirm if they are available at this time or suggest an alternative slot.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4 pt-4 border-t border-border/10">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Promo Code
          </label>
          {promoDiscount && (
            <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold">
              -{promoDiscount.amount.toLocaleString()} KES Applied
            </Badge>
          )}
        </div>

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="promo_code"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-0">
                <FormControl>
                  <Input
                    placeholder="Enter voucher code"
                    className={`bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl h-12 focus-visible:ring-blue-500 font-bold uppercase ${promoDiscount ? "border-emerald-500 ring-1 ring-emerald-500/20" : ""}`}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onValidatePromo}
            disabled={isValidatingPromo || !form.watch("promo_code")}
            className="h-12 px-6 rounded-xl border-gray-200 dark:border-white/10 font-bold text-xs uppercase tracking-widest hover:bg-muted"
          >
            {isValidatingPromo ? "..." : "Apply"}
          </Button>
        </div>
        {promoError && <p className="text-[10px] text-red-500 font-bold italic">{promoError}</p>}
        {promoDiscount && (
          <p className="text-[10px] text-emerald-600 font-bold italic">
            Successful! You're saving KES {promoDiscount.amount.toLocaleString()} on this booking.
          </p>
        )}
      </div>
    </>
  );
}
