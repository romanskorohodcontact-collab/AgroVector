import Link from "next/link";
import type { User } from "@/entities/user/model";
import { LoadCard } from "@/entities/load";
import { LogoutButton } from "@/features/auth";
import { listMyLoads } from "@/server/modules/loads";
import { getInitials } from "@/shared/lib/getInitials";
import { EditIcon } from "@/shared/ui/EditIcon";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

interface ProfileScreenProps {
  user: User;
}

export async function ProfileScreen({ user }: ProfileScreenProps) {
  const myLoads = await listMyLoads(user.id);

  return (
    <main className="bg-bg-subtle">
      <div className="bg-white">
        <Header />
      </div>

      <section className="flex flex-col items-center px-6 pt-14 pb-11 bg-[linear-gradient(160deg,#edf7f0_0%,#ffffff_50%)] max-[640px]:px-4 max-[640px]:pt-10 max-[640px]:pb-8">
        <div
          aria-hidden="true"
          className="flex items-center justify-center w-[120px] h-[120px] rounded-full bg-[linear-gradient(135deg,#23793D,#2d994d)] text-[48px] font-medium text-text-inverse tracking-[-1px] mb-6 shadow-[0_4px_20px_rgba(35,121,61,0.2)] max-[640px]:w-24 max-[640px]:h-24 max-[640px]:text-[38px] max-[640px]:mb-5"
        >
          {getInitials(user.name)}
        </div>
        <h1 className="text-2xl font-medium text-text-primary tracking-[-0.48px] mb-1.5 max-[640px]:text-xl max-[640px]:tracking-[-0.4px]">
          {user.name || "—"}
        </h1>
        <p className="text-base text-text-secondary tracking-[-0.16px] mb-4">
          {user.companyName || "—"}
        </p>
        <span className="inline-flex items-center h-6 px-3 rounded-pill bg-bg-subtle text-[13px] font-medium text-accent tracking-[-0.13px]">
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent mr-2" />
          Онлайн
        </span>
      </section>

      <div className="max-w-[1100px] mx-auto px-6 pt-8 pb-14 grid grid-cols-[1fr_2fr] gap-6 items-start max-[960px]:grid-cols-1 max-[640px]:px-4 max-[640px]:pt-6 max-[640px]:pb-10">
        <section className="min-w-0 self-start sticky top-0 max-[960px]:static">
          <div className="border border-[#ECECEC] rounded-[20px] bg-white overflow-hidden">
            <div className="flex justify-between items-center px-6 py-[18px] border-b border-[#ECECEC] max-[640px]:px-4 max-[640px]:py-3.5">
              <ContactRowLabel icon="phone" label="Телефон" value={user.phone} />
            </div>

            <div className="flex justify-between items-center px-6 py-[18px] border-b border-[#ECECEC] max-[640px]:px-4 max-[640px]:py-3.5">
              <ContactRowLabel icon="mail" label="Почта" value={user.email || "—"} />
            </div>

            <div className="flex justify-between items-center px-6 py-[18px] border-b border-[#ECECEC] max-[640px]:px-4 max-[640px]:py-3.5">
              <ContactRowLabel icon="building" label="Компания" value={user.companyName || "—"} />
            </div>

            <div className="px-6 py-4 border-t border-[#ECECEC] flex flex-col gap-3 max-[640px]:px-4">
              <Link
                href="/profile/edit"
                className="inline-flex items-center justify-center gap-1.5 h-9 w-full px-4 rounded-pill bg-accent text-sm font-medium text-text-inverse tracking-[-0.16px] whitespace-nowrap transition-colors duration-150 hover:bg-accent/90"
              >
                <EditIcon />
                Редактировать профиль
              </Link>
              <LogoutButton className="inline-flex items-center justify-center gap-1.5 h-9 w-full px-4 rounded-pill border-[0.8px] border-[#0D0D0D1A] bg-white text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap transition-colors duration-150 hover:text-text-primary hover:border-[#0D0D0D33]" />
            </div>
          </div>
        </section>

        <section className="min-w-0">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold leading-[1.33] text-text-primary tracking-[-0.18px]">
              Мои заявки
            </h2>
            <span className="text-sm text-text-muted tracking-[-0.14px]">
              {myLoads.length} {pluralLoads(myLoads.length)}
            </span>
          </div>

          {myLoads.length === 0 ? (
            <p className="text-sm text-text-muted tracking-[-0.14px]">
              Заявок пока нет
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-[960px]:grid-cols-1">
              {myLoads.map((load) => (
                <LoadCard key={load.id} load={load} editable />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}

function pluralLoads(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "заявка";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
    return "заявки";
  return "заявок";
}

type ContactIconName = "phone" | "mail" | "building";

interface ContactRowLabelProps {
  icon: ContactIconName;
  label: string;
  value: string;
}

function ContactRowLabel({ icon, label, value }: ContactRowLabelProps) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] bg-bg-subtle text-text-muted shrink-0 max-[640px]:w-[34px] max-[640px]:h-[34px]">
        <ContactIcon name={icon} />
      </div>
      <div className="min-w-0">
        <div className="text-[13px] text-text-muted tracking-[-0.13px] mb-0.5">
          {label}
        </div>
        <div className="text-base font-medium text-text-primary tracking-[-0.16px] max-[640px]:text-[15px] break-words">
          {value}
        </div>
      </div>
    </div>
  );
}

function ContactIcon({ name }: { name: ContactIconName }) {
  switch (name) {
    case "phone":
      return (
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
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"></path>
        </svg>
      );
    case "mail":
      return (
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
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      );
    case "building":
      return (
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
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
        </svg>
      );
  }
}