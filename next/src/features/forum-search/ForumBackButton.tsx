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
      className="inline-flex h-12 items-center justify-center gap-2 rounded-pill border-[0.8px] border-outline bg-bg-surface px-[21px] text-base leading-none font-medium tracking-[-0.16px] whitespace-nowrap text-text-secondary transition-colors duration-150 hover:border-outline-hover hover:text-text-primary"
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
