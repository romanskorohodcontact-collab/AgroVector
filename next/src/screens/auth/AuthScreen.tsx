import Link from "next/link";

const inputStyle = {
  padding: "6px 8px",
  border: "1px solid #000",
};

export function AuthScreen() {
  return (
    <main>
      <div style={{ padding: "12px 16px" }}>
        <Link href="/">AgroRunok</Link>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 48px)",
        }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "32px",
            border: "1px solid #000",
          }}
        >
          <input type="tel" placeholder="Телефон" style={inputStyle} />
          <input type="password" placeholder="Пароль" style={inputStyle} />
          <button
            type="submit"
            style={{
              padding: "6px 12px",
              border: "1px solid #000",
              background: "none",
              cursor: "pointer",
            }}
          >
            Войти
          </button>
        </form>
      </div>
    </main>
  );
}