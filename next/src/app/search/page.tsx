import { redirect } from "next/navigation";
import { SearchScreen } from "@/screens/search/SearchScreen";
import type { SearchFiltersValues } from "@/entities/load/model";
import type { SearchMode } from "@/shared/ui/SearchModeToggle";
import { Header } from "@/widgets/header";

const FORM_KEYS = ["from", "to", "cargo", "tonnage", "rate", "distance", "company"] as const;

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawType = params.type;
  const type = Array.isArray(rawType) ? rawType[0] : rawType;

  if (type !== "load" && type !== "transport") {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const v of value) next.append(key, v);
      } else {
        next.append(key, value);
      }
    }
    next.set("type", "load");
    redirect(`/search?${next.toString()}`);
  }

  const mode: SearchMode = type;
  const initialValues: SearchFiltersValues = {};
  for (const key of FORM_KEYS) {
    const raw = params[key];
    initialValues[key] = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden max-[960px]:h-auto max-[960px]:overflow-visible">
      <Header fullWidth activePath={`/search?type=${type}`} />
      <SearchScreen mode={mode} initialValues={initialValues} />
    </div>
  );
}
