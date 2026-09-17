import Link from "next/link";
import { CreateTransportForm } from "@/features/create-transport";
import { Header } from "@/widgets/header";

export function CreateTransportScreen() {
  return (
    <main className="bg-bg-subtle">
      <div className="bg-white">
        <Header />
      </div>

      <div className="container-app pt-8 pb-6 max-[640px]:pt-6 max-[640px]:pb-5">
        <nav aria-label="Навигация" className="flex items-center gap-2 text-sm">
          <Link
            href="/search"
            className="text-text-secondary tracking-[-0.14px] leading-[1.43] transition-colors duration-150 hover:text-text-primary"
          >
            АгроРынок
          </Link>
          <span className="text-text-muted">›</span>
          <span className="font-medium text-text-primary tracking-[-0.14px]">
            Размещение транспорта
          </span>
        </nav>
      </div>

      <CreateTransportForm />

      <footer className="py-6 text-center border-t border-[#0D0D0D12] bg-white text-sm text-text-muted tracking-[-0.14px]">
        © 2026 AgroRunok
      </footer>
    </main>
  );
}
