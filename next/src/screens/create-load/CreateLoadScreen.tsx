import Link from "next/link";
import { CreateLoadForm } from "@/features/create-load";
import { Header } from "@/widgets/header";
import type { User } from "@/entities/user";

interface CreateLoadScreenProps {
  user: User;
}

export function CreateLoadScreen({ user }: CreateLoadScreenProps) {
  return (
    <main className="bg-bg-subtle">
      <div className="bg-bg-surface">
        <Header />
      </div>

      <div className="container-app pt-8 pb-6 max-[640px]:pt-6 max-[640px]:pb-5">
        <nav aria-label="Навигация" className="flex items-center gap-2 text-sm">
          <Link
            href="/search?type=load"
            className="text-text-secondary tracking-[-0.14px] leading-[1.43] transition-colors duration-150 hover:text-text-primary"
          >
            АгроРынок
          </Link>
          <span className="text-text-muted">›</span>
          <span className="font-medium text-text-primary tracking-[-0.14px]">
            Размещение груза
          </span>
        </nav>
      </div>

      <CreateLoadForm user={user} />

      <footer className="py-6 text-center border-t border-divider-strong bg-bg-surface text-sm text-text-muted tracking-[-0.14px]">
        © 2026 AgroRunok
      </footer>
    </main>
  );
}