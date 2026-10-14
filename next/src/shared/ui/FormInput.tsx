import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export const FORM_INPUT_WRAP =
  "flex items-center gap-3 h-[38px] w-full px-4 rounded-pill bg-bg-input focus-within:ring-1 focus-within:ring-accent";

export const FIELD_LABEL =
  "mb-1.5 block text-[12px] font-medium text-text-muted tracking-[-0.12px]";

export const FIELD_LABEL_INLINE =
  "w-[200px] shrink-0 text-left text-[12px] font-medium leading-[1.4] text-text-muted tracking-[-0.12px] max-[640px]:mb-1.5 max-[640px]:w-auto";

export const FIELD_ROW =
  "flex flex-row-reverse items-center gap-4 max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:gap-1.5";

export const FIELD_ROW_TOP =
  "flex flex-row-reverse items-start gap-4 max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:gap-1.5";

export const FORM_FILTER_TRIGGER =
  "flex items-center w-full h-[38px] px-4 rounded-pill bg-bg-input text-sm text-text-primary tracking-[-0.14px] cursor-pointer transition-colors duration-150 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const FORM_INPUT =
  "flex-1 min-w-0 border-0 bg-transparent outline-none text-sm text-text-primary leading-[1.43] tracking-[-0.14px] placeholder:text-icon-subtle";

export function FormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={FORM_INPUT_WRAP}>
      <input className={FORM_INPUT} {...props} />
    </div>
  );
}

interface FormInputIconProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode | null;
}

export function FormInputIcon({ icon, ...props }: FormInputIconProps) {
  return (
    <div className={FORM_INPUT_WRAP}>
      <input className={FORM_INPUT} {...props} />
      {icon}
    </div>
  );
}

export const FORM_SELECT =
  "flex-1 min-w-0 appearance-none border-0 bg-transparent outline-none cursor-pointer text-sm leading-[1.43] tracking-[-0.14px]";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export function FormSelect({ children, className, ...props }: FormSelectProps) {
  const isPlaceholder = props.value == null || props.value === "";
  return (
    <div className={FORM_INPUT_WRAP}>
      <select
        {...props}
        className={`${FORM_SELECT} ${
          isPlaceholder ? "text-icon-subtle" : "text-text-primary"
        }${className ? ` ${className}` : ""}`}
      >
        {children}
      </select>
      <ChevronIcon />
    </div>
  );
}

export const FORM_TEXTAREA =
  "w-full min-h-[96px] px-4 py-3 rounded-2xl bg-bg-subtle text-sm text-text-primary tracking-[-0.14px] placeholder:text-icon-subtle resize-y transition-colors duration-150 focus:outline-none focus:border-accent";

export function FormTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={FORM_TEXTAREA} {...props} />;
}

function ChevronIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 6 4 4 4-4"></path>
    </svg>
  );
}
