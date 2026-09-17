"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  border: "1px solid #000",
  background: "none",
  cursor: "pointer",
};

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps = {}) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Не удалось выйти");
      }
    },
    onSuccess: () => {
      router.push("/login");
      router.refresh();
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={className}
      style={className ? undefined : buttonStyle}
    >
      {mutation.isPending ? "Выход…" : "Выйти"}
    </button>
  );
}