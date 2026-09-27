"use client";

import { useRouter } from "next/navigation";

export function ForumBackButton() {
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/forum");
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center justify-center h-12 px-[21px] gap-2 rounded-pill border-[0.8px] border-outline bg-bg-surface text-base font-medium text-text-secondary tracking-[-0.16px] leading-none whitespace-nowrap transition-colors duration-150 hover:text-text-primary hover:border-outline-hover"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      Назад
    </button>
  );
}
