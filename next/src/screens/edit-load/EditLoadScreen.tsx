import type { Load } from "@/entities/load/model";
import { EditLoadForm } from "@/features/edit-load";
import { Header } from "@/widgets/header";

interface EditLoadScreenProps {
  load: Load;
}

export function EditLoadScreen({ load }: EditLoadScreenProps) {
  return (
    <main className="bg-bg-subtle">
      <div className="bg-white">
        <Header />
      </div>

      <div className="max-w-[1100px] mx-auto px-6 pt-10 pb-8 text-center max-[640px]:px-4 max-[640px]:pt-7 max-[640px]:pb-6">
        <h1 className="text-[30px] font-semibold leading-[1.4] text-text-dark tracking-[-0.6px] max-[640px]:text-2xl max-[640px]:tracking-[-0.48px]">
          Редактировать заявку на груз
        </h1>
        <p className="mt-4 text-lg leading-[1.78] text-text-secondary tracking-[-0.18px]">
          Внесите изменения в заявку и сохраните её
        </p>
      </div>

      <EditLoadForm load={load} />

      <footer className="py-6 text-center border-t border-[#0D0D0D12] bg-white text-sm text-text-muted tracking-[-0.14px]">
        © 2026 AgroRunok
      </footer>
    </main>
  );
}