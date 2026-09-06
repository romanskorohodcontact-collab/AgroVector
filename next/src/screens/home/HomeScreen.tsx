import Link from "next/link";
import { LoadCard } from "@/entities/load";
import { listLoads } from "@/server/modules/loads";
import { Header } from "@/widgets/header";
import { LoadsMap } from "@/widgets/loads-map";
import { SearchPanel } from "@/widgets/search-panel";

export async function HomeScreen() {
  const loads = await listLoads();

  return (
    <main>
      <Header />
      <div style={{ margin: "16px" }}>
        <Link
          href="/loads/create"
          style={{
            padding: "6px 12px",
            border: "1px solid #000",
            display: "inline-block",
          }}
        >
          Разместить груз
        </Link>
      </div>
      <SearchPanel />
      <LoadsMap mapItems={loads} />
      <div
        style={{
          margin: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {loads.length === 0 ? (
          <p>Заявок пока нет</p>
        ) : (
          loads.map((load) => <LoadCard key={load.id} load={load} />)
        )}
      </div>
    </main>
  );
}