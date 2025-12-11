"use client";

import { Input } from "@repo/ui/components/input";
import { useEffect, useState } from "react";

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: number;
  onValueChange: (value: number) => void;
}

export function CurrencyInput({
  value,
  onValueChange,
  className,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatNumber(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digit characters
    const inputValue = e.target.value.replace(/[^0-9]/g, "");

    // Convert to number
    const numericValue = Number(inputValue);

    // Update display value with formatting
    // Note: We update local state immediately for responsiveness
    setDisplayValue(formatNumber(numericValue));

    // Notify parent
    onValueChange(numericValue);
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-medium">
        Rp
      </div>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={`pl-9 ${className || ""}`}
        placeholder="0"
        {...props}
      />
    </div>
  );
}
