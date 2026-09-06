import Link from "next/link";

export function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #000",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <Link href="/">AgroRunok</Link>
        <Link href="/forum">Форум</Link>
      </div>
      <Link
        href="/auth"
        style={{
          padding: "6px 12px",
          border: "1px solid #000",
        }}
      >
        Войти
      </Link>
    </header>
  );
}