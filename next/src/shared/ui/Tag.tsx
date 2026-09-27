interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
  return (
    <span className="inline-flex items-center h-5 px-2.5 rounded-pill bg-bg-subtle text-[12px] leading-none text-text-secondary tracking-[-0.16px] whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5" />
      {label}
    </span>
  );
}
