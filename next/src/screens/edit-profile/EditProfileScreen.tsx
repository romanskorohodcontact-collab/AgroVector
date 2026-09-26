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

      <div className="w-full max-w-[720px] mx-auto px-6 pt-12 text-center max-[640px]:px-4 max-[640px]:pt-8">
        <h1 className="text-[30px] font-semibold leading-[1.4] text-text-dark tracking-[-0.6px] max-[640px]:text-[26px]">
          Редактирование профиля
        </h1>
        <p className="mt-4 text-lg leading-[1.78] text-text-secondary tracking-[-0.18px]">
          Обновите данные вашего профиля
        </p>
      </div>

      <EditProfileForm user={user} />

      <footer className="mt-auto py-6 px-4 text-center border-t border-divider-strong bg-bg-surface text-sm text-text-muted tracking-[-0.14px]">
        © 2026 AgroRunok
      </footer>
    </main>
  );
}