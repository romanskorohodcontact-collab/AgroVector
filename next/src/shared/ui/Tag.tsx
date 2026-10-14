interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
  return (
    <span className="inline-flex h-5 items-center rounded-pill bg-bg-subtle px-2.5 text-[12px] leading-none tracking-[-0.16px] whitespace-nowrap text-text-secondary">
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
      {label}
    </span>
  );
}
