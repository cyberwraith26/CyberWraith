"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  hint?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const baseInputStyles = cn(
  "w-full bg-dark-100 border border-brand-green/20",
  "text-brand-green font-mono text-sm",
  "px-4 py-3 outline-none",
  "placeholder:text-brand-green/30",
  "transition-colors duration-200",
  "focus:border-brand-green/60",
  "disabled:opacity-50 disabled:cursor-not-allowed"
);

export const Input = ({
  label,
  error,
  leftIcon,
  hint,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-mono text-[10px] tracking-widest uppercase text-brand-green/60">
          {label} //
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-green/40">
            {leftIcon}
          </span>
        )}
        <input
          className={cn(
            baseInputStyles,
            leftIcon && "pl-10",
            error && "border-brand-red/60 focus:border-brand-red",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="font-mono text-[11px] text-brand-red">{error}</p>
      )}
      {hint && !error && (
        <p className="font-mono text-[11px] text-white/30">{hint}</p>
      )}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  hint,
  className,
  ...props
}: TextareaProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-mono text-[10px] tracking-widest uppercase text-brand-green/60">
          {label} //
        </label>
      )}
      <textarea
        className={cn(
          baseInputStyles,
          "resize-vertical min-h-[120px]",
          error && "border-brand-red/60 focus:border-brand-red",
          className
        )}
        {...props}
      />
      {error && (
        <p className="font-mono text-[11px] text-brand-red">{error}</p>
      )}
      {hint && !error && (
        <p className="font-mono text-[11px] text-white/30">{hint}</p>
      )}
    </div>
  );
};

export const Select = ({
  label,
  error,
  hint,
  options,
  value,
  onChange,
  placeholder,
  className,
}: SelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-mono text-[10px] tracking-widest uppercase text-brand-green/60">
          {label} //
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          baseInputStyles,
          "cursor-pointer appearance-none",
          error && "border-brand-red/60 focus:border-brand-red",
          className
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-dark-100"
          >
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="font-mono text-[11px] text-brand-red">{error}</p>
      )}
      {hint && !error && (
        <p className="font-mono text-[11px] text-white/30">{hint}</p>
      )}
    </div>
  );
};