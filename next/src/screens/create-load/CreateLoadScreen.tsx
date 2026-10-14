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
      <Header />

      <div className="container-app pt-4 pb-4 max-[640px]:pt-6 max-[640px]:pb-5">
        <nav aria-label="Навигация" className="flex items-center gap-2 text-sm">
          <Link
            href="/search?type=load"
            className="leading-[1.43] tracking-[-0.14px] text-text-secondary transition-colors duration-150 hover:text-text-primary"
          >
            АгроРынок
          </Link>
          <span className="text-text-muted">›</span>
          <span className="font-medium tracking-[-0.14px] text-text-primary">Размещение груза</span>
        </nav>
      </div>

      <CreateLoadForm user={user} />

      <footer className="border-t border-divider-strong bg-bg-surface py-6 text-center text-sm tracking-[-0.14px] text-text-muted">
        © 2026 AgroRunok
      </footer>
    </main>
  );
}
