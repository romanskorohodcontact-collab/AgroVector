import type { User } from "@/entities/user/model";
import { EditProfileForm } from "@/features/edit-profile";
import { Header } from "@/widgets/header";

interface EditProfileScreenProps {
  user: User;
}

export function EditProfileScreen({ user }: EditProfileScreenProps) {
  return (
    <main className="flex min-h-screen flex-col bg-bg-subtle">
      <Header />

      <div className="mx-auto w-full max-w-[720px] px-6 pt-12 text-center max-[640px]:px-4 max-[640px]:pt-8">
        <h1 className="text-[30px] leading-[1.4] font-semibold tracking-[-0.6px] text-text-dark max-[640px]:text-[26px]">
          Редактирование профиля
        </h1>
        <p className="mt-4 text-lg leading-[1.78] tracking-[-0.18px] text-text-secondary">
          Обновите данные вашего профиля
        </p>
      </div>

      <EditProfileForm user={user} />

      <footer className="mt-auto border-t border-divider-strong bg-bg-surface px-4 py-6 text-center text-sm tracking-[-0.14px] text-text-muted">
        © 2026 AgroRunok
      </footer>
    </main>
  );
}
