import { SearchScreen } from "@/screens/search/SearchScreen";
import type { SearchFiltersValues } from "@/entities/load/model";
import { Header } from "@/widgets/header";

const FORM_KEYS = [
  "from",
  "to",
  "cargo",
  "tonnage",
  "rate",
  "distance",
  "company",
] as const;

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const initialValues: SearchFiltersValues = {};
  for (const key of FORM_KEYS) {
    const raw = params[key];
    initialValues[key] = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  }
  return (
    <div className="flex h-screen flex-col overflow-hidden max-[960px]:h-auto max-[960px]:overflow-visible">
      <Header fullWidth />
      <SearchScreen initialValues={initialValues} />
    </div>
  );
}