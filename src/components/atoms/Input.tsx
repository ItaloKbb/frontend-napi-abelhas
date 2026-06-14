import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...rest }: InputProps) {
  return (
    <fieldset className="fieldset">
      {label && (
        <legend className="fieldset-legend">{label}</legend>
      )}
      <input
        id={id}
        className={`input ${error ? "input-error" : ""} ${className}`.trim()}
        {...rest}
      />
      {error && <p className="fieldset-label text-error">{error}</p>}
    </fieldset>
  );
}
