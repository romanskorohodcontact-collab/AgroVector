import Link from "next/link";
import type { Load } from "@/entities/load/model";
import { EditLoadForm } from "@/features/edit-load";
import { Header } from "@/widgets/header";

interface EditLoadScreenProps {
  load: Load;
}

export function EditLoadScreen({ load }: EditLoadScreenProps) {
  return (
    <main className="bg-bg-subtle">
      <Header />

      <div className="container-app pt-4 pb-4 max-[640px]:pt-6 max-[640px]:pb-5">
        <nav aria-label="Навигация" className="flex items-center gap-2 text-sm">
          <Link
            href="/search?type=load"
            className="text-text-secondary tracking-[-0.14px] leading-[1.43] transition-colors duration-150 hover:text-text-primary"
          >
            АгроРынок
          </Link>
          <span className="text-text-muted">›</span>
          <span className="font-medium text-text-primary tracking-[-0.14px]">
            Редактирование груза
          </span>
        </nav>
      </div>

      <EditLoadForm load={load} />

      <footer className="py-6 text-center border-t border-divider-strong bg-bg-surface text-sm text-text-muted tracking-[-0.14px]">
        © 2026 AgroRunok
      </footer>
    </main>
  );
}