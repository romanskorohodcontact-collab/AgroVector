interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

const BTN_SM_OUTLINE =
  "inline-flex items-center justify-center h-9 px-4 gap-2 rounded-pill border-[0.8px] border-outline bg-bg-surface text-sm text-text-secondary tracking-[-0.14px] whitespace-nowrap transition-colors duration-150 hover:text-text-primary hover:border-outline-hover disabled:opacity-50 disabled:cursor-not-allowed";

export function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  return (
    <div className="mt-3 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className={BTN_SM_OUTLINE}
      >
        Назад
      </button>
      <span className="text-sm tracking-[-0.14px] text-text-secondary">
        Страница {page} из {totalPages} · Всего: {total}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className={BTN_SM_OUTLINE}
      >
        Вперёд
      </button>
    </div>
  );
}
