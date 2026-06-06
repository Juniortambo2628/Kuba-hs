"use client";

import { ReactNode } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";

interface FilterFieldProps {
  label?: string;
  children: ReactNode;
  className?: string;
  variant?: "compact" | "block";
  hideLabel?: boolean;
}

/** Dashboard / modal field labels (not shadcn FormLabel) */
export function FieldLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn(uiPrimitives.label.fieldBlock, "ml-0 block", className)}>{children}</label>
  );
}

export function FilterField({
  label,
  children,
  className,
  variant = "compact",
  hideLabel,
}: FilterFieldProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {!hideLabel && label && (
        <label
          className={cn(
            variant === "block" ? uiPrimitives.filter.labelBlock : uiPrimitives.filter.label,
            variant === "block" && "ml-0"
          )}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

interface FilterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: "default" | "toolbar";
}

export function FilterSelect({ className, variant = "default", ...props }: FilterSelectProps) {
  return (
    <select
      className={cn(
        variant === "toolbar" ? uiPrimitives.filter.selectMuted : uiPrimitives.filter.select,
        className
      )}
      {...props}
    />
  );
}

interface FilterResetLinkProps {
  onClick: () => void;
  children?: ReactNode;
  className?: string;
}

export function FilterResetLink({ onClick, children = "Reset", className }: FilterResetLinkProps) {
  return (
    <button type="button" onClick={onClick} className={cn(uiPrimitives.filter.resetLink, className)}>
      {children}
    </button>
  );
}

interface FilterSegmentOption<T extends string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterSegmentGroupProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: FilterSegmentOption<T>[];
  className?: string;
}

export function FilterSegmentGroup<T extends string>({
  value,
  onChange,
  options,
  className,
}: FilterSegmentGroupProps<T>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              uiPrimitives.filter.segmentBase,
              active ? uiPrimitives.filter.segmentActive : uiPrimitives.filter.segmentInactive
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

interface FilterCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function FilterCheckbox({ checked, onChange, label }: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div
        className={cn(
          uiPrimitives.filter.checkboxBox,
          checked ? uiPrimitives.filter.checkboxBoxOn : uiPrimitives.filter.checkboxBoxOff
        )}
      >
        <CheckCircle2
          className={cn("w-3.5 h-3.5 text-white transition-transform", checked ? "scale-100" : "scale-0")}
        />
      </div>
      <span
        className={cn(
          "text-sm transition-colors",
          checked ? "text-foreground font-bold" : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        {label}
      </span>
    </label>
  );
}

interface FilterRadioOption {
  value: number;
  label: ReactNode;
}

interface FilterRadioGroupProps {
  name: string;
  value: number | null;
  onChange: (value: number) => void;
  options: FilterRadioOption[];
}

export function FilterRadioGroup({ name, value, onChange, options }: FilterRadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name={name}
              className="hidden"
              checked={selected}
              onChange={() => onChange(opt.value)}
            />
            <div
              className={cn(
                uiPrimitives.filter.radioOuter,
                selected ? uiPrimitives.filter.radioOuterOn : uiPrimitives.filter.radioOuterOff
              )}
            >
              <div
                className={cn(uiPrimitives.filter.radioInner, selected ? "scale-100" : "scale-0")}
              />
            </div>
            <span
              className={cn(
                "text-sm flex items-center gap-1.5",
                selected ? "text-foreground font-bold" : "text-muted-foreground"
              )}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/** Rating filter presets (4.5+, 4+, 3.5+) */
export function FilterRatingGroup({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number) => void;
}) {
  return (
    <FilterRadioGroup
      name="min-rating"
      value={value}
      onChange={onChange}
      options={[4.5, 4.0, 3.5].map((r) => ({
        value: r,
        label: (
          <>
            {r}+ <Star className={cn("w-3.5 h-3.5", value === r ? "fill-amber-500 text-amber-500" : "text-gray-300")} />
          </>
        ),
      }))}
    />
  );
}
