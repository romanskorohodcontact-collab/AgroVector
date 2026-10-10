import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const INPUT =
  "peer w-full rounded-[30px] bg-input-bg px-6 py-3 text-[20px] font-normal leading-normal text-text-primary outline-none placeholder:text-transparent";

const LABEL =
  "pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-[16px] font-normal leading-none text-input-label transition-[top,transform] duration-150 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2";

export function InputField({ label, className, ...props }: InputFieldProps) {
  return (
    <label className="relative block w-full">
      <input
        {...props}
        placeholder=" "
        className={className ? `${INPUT} ${className}` : INPUT}
      />
      <span className={LABEL}>{label}</span>
    </label>
  );
}
