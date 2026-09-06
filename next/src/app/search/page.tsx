import { SearchScreen } from "@/screens/search/SearchScreen";
import type { SearchFiltersValues } from "@/widgets/search-filters";

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
  return <SearchScreen initialValues={initialValues} />;
}