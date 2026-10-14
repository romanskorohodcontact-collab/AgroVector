import Link from "next/link";
import type { User } from "@/entities/user/model";
import { LogoutButton } from "@/features/auth";
import { ProfileLoadCard } from "./ui/ProfileLoadCard";
import { ProfileTransportCardDetail } from "./ui/ProfileTransportCardDetail";
import { listMyLoads } from "@/server/modules/loads";
import { listMyTransports } from "@/server/modules/transports";
import { getInitials } from "@/shared/lib/getInitials";
import { EditIcon } from "@/shared/ui/EditIcon";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

interface ProfileScreenProps {
  user: User;
}

export async function ProfileScreen({ user }: ProfileScreenProps) {
  const myLoads = await listMyLoads(user.id);
  const myTransports = await listMyTransports(user.id);

  return (
    <main className="bg-bg-subtle">
      <Header activePath="/profile" />

      <section className="flex flex-col items-center bg-[linear-gradient(160deg,var(--color-success-soft)_0%,var(--color-bg-surface)_50%)] px-6 pt-14 pb-11 max-[640px]:px-4 max-[640px]:pt-10 max-[640px]:pb-8">
        <div
          aria-hidden="true"
          className="mb-6 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent),color-mix(in_srgb,var(--color-accent)_70%,#fff))] text-[48px] font-medium tracking-[-1px] text-text-inverse shadow-[0_4px_20px] shadow-accent/20 max-[640px]:mb-5 max-[640px]:h-24 max-[640px]:w-24 max-[640px]:text-[38px]"
        >
          {getInitials(user.name)}
        </div>
        <div className="flex w-full max-w-[720px] min-w-0 flex-col items-center">
          <h1 className="mb-1.5 w-full truncate [mask-image:linear-gradient(to_right,black_88%,transparent_100%)] text-center text-2xl font-medium tracking-[-0.48px] text-text-primary [-webkit-mask-image:linear-gradient(to_right,black_88%,transparent_100%)] max-[640px]:text-xl max-[640px]:tracking-[-0.4px]">
            {user.name || "—"}
          </h1>
          <p className="mb-4 w-full truncate [mask-image:linear-gradient(to_right,black_88%,transparent_100%)] text-center text-base tracking-[-0.16px] text-text-secondary [-webkit-mask-image:linear-gradient(to_right,black_88%,transparent_100%)]">
            {user.companyName || "—"}
          </p>
        </div>
        <span className="inline-flex h-6 items-center rounded-pill bg-bg-subtle px-3 text-[13px] font-medium tracking-[-0.13px] text-accent">
          <span aria-hidden="true" className="mr-2 h-1.5 w-1.5 rounded-full bg-accent" />
          Онлайн
        </span>
      </section>

      <div className="mx-auto grid max-w-[1100px] grid-cols-[1fr_2fr] items-start gap-6 px-6 pt-8 pb-14 max-[960px]:grid-cols-1 max-[640px]:px-4 max-[640px]:pt-6 max-[640px]:pb-10">
        <section className="sticky top-0 min-w-0 self-start max-[960px]:static">
          <div className="overflow-hidden rounded-[20px] border border-border bg-bg-surface">
            <div className="flex items-center justify-between border-b border-border px-6 py-[18px] max-[640px]:px-4 max-[640px]:py-3.5">
              <ContactRowLabel icon="phone" label="Телефон" value={user.phone} />
            </div>

            <div className="flex items-center justify-between border-b border-border px-6 py-[18px] max-[640px]:px-4 max-[640px]:py-3.5">
              <ContactRowLabel icon="mail" label="Почта" value={user.email || "—"} />
            </div>

            <div className="flex items-center justify-between border-b border-border px-6 py-[18px] max-[640px]:px-4 max-[640px]:py-3.5">
              <ContactRowLabel icon="building" label="Компания" value={user.companyName || "—"} />
            </div>

            <div className="flex flex-col gap-3 border-t border-border px-6 py-4 max-[640px]:px-4">
              <Link
                href="/profile/edit"
                className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-pill bg-accent px-4 text-sm font-medium tracking-[-0.16px] whitespace-nowrap text-text-inverse transition-colors duration-150 hover:bg-accent/90"
              >
                <EditIcon />
                Редактировать профиль
              </Link>
              <LogoutButton className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-pill border-[0.8px] border-outline bg-bg-surface px-4 text-sm tracking-[-0.14px] whitespace-nowrap text-text-secondary transition-colors duration-150 hover:border-outline-hover hover:text-text-primary" />
            </div>
          </div>
        </section>

        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg leading-[1.33] font-semibold tracking-[-0.18px] text-text-primary">
              Мои заявки на груз
            </h2>
            <span className="text-sm tracking-[-0.14px] text-text-muted">
              {myLoads.length} {pluralLoads(myLoads.length)}
            </span>
          </div>

          {myLoads.length === 0 ? (
            <p className="text-sm tracking-[-0.14px] text-text-muted">Заявок пока нет</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-[960px]:grid-cols-1">
              {myLoads.map((load) => (
                <ProfileLoadCard key={load.id} load={load} editable />
              ))}
            </div>
          )}

          <div className="mt-10 mb-5 flex items-center justify-between">
            <h2 className="text-lg leading-[1.33] font-semibold tracking-[-0.18px] text-text-primary">
              Мои заявки на транспорт
            </h2>
            <span className="text-sm tracking-[-0.14px] text-text-muted">
              {myTransports.length} {pluralLoads(myTransports.length)}
            </span>
          </div>

          {myTransports.length === 0 ? (
            <p className="text-sm tracking-[-0.14px] text-text-muted">Заявок пока нет</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-[960px]:grid-cols-1">
              {myTransports.map((transport) => (
                <ProfileTransportCardDetail key={transport.id} transport={transport} />
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
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "заявки";
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
    <div className="flex min-w-0 items-center gap-3.5">
      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-bg-subtle text-text-muted max-[640px]:h-[34px] max-[640px]:w-[34px]">
        <ContactIcon name={icon} />
      </div>
      <div className="min-w-0">
        <div className="mb-0.5 text-[13px] tracking-[-0.13px] text-text-muted">{label}</div>
        <div className="relative min-w-0">
          <div className="truncate text-base font-medium tracking-[-0.16px] text-text-primary max-[640px]:text-[15px]">
            {value}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg-surface to-transparent"
          />
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
