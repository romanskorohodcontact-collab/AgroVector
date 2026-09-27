import { Header } from "@/widgets/header";
import { ForumBreadcrumbs } from "@/widgets/forum-breadcrumbs";

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-subtle flex flex-col">
      <div className="bg-bg-surface">
        <Header activePath="/forum" />
      </div>
      <div className="w-full px-4 py-10 max-w-[1152px] mx-auto flex-1">
        <ForumBreadcrumbs />
        <div className="bg-bg-surface border border-border rounded-[24px] p-10 max-md:p-5">
          {children}
        </div>
      </div>
      <footer className="text-center py-6 mt-10 text-sm tracking-[-0.14px] text-text-muted border-t border-divider-strong bg-bg-surface">
        © 2026 AgroRunok
      </footer>
    </div>
  );
}
