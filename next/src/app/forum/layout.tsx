import { Header } from "@/widgets/header";
import { ForumBreadcrumbs } from "@/widgets/forum-breadcrumbs";

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-subtle">
      <Header activePath="/forum" />
      <div className="mx-auto w-full max-w-[1152px] flex-1 px-4 py-10">
        <ForumBreadcrumbs />
        <div className="rounded-[24px] border border-border bg-bg-surface p-10 max-md:p-5">
          {children}
        </div>
      </div>
      <footer className="mt-10 border-t border-divider-strong bg-bg-surface py-6 text-center text-sm tracking-[-0.14px] text-text-muted">
        © 2026 AgroRunok
      </footer>
    </div>
  );
}
