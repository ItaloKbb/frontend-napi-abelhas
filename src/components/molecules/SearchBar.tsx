"use client";

import { InputHTMLAttributes } from "react";
import { Input } from "@/components/atoms";

interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar…",
  className = "",
  ...rest
}: SearchBarProps) {
  return (
    <div className={`flex gap-2 ${className}`.trim()}>
      <Input
        type="search"
        placeholder={placeholder}
        className="flex-1"
        onChange={(e) => onSearch?.(e.target.value)}
        {...rest}
      />
    </div>
  );
}
