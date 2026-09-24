import Link from "next/link";
import { EditTransportForm } from "@/features/edit-transport";
import { Header } from "@/widgets/header";
import type { Transport } from "@/entities/transport/model";

interface EditTransportScreenProps {
  transport: Transport;
}

export function EditTransportScreen({ transport }: EditTransportScreenProps) {
  return (
    <main className="bg-bg-subtle">
      <div className="bg-white">
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
            Редактирование транспорта
          </span>
        </nav>
      </div>

      <EditTransportForm transport={transport} />

      <footer className="py-6 text-center border-t border-[#0D0D0D12] bg-white text-sm text-text-muted tracking-[-0.14px]">
        © 2026 AgroRunok
      </footer>
    </main>
  );
}
