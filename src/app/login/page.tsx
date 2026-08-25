import AuthForm from "@/components/AuthForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { role?: string; mode?: string };
}) {
  const initialRole = searchParams.role === "parent" ? "parent" : "student";
  const initialMode = searchParams.mode === "signup" ? "signup" : "login";
  return (
    <div
      style={{
        maxWidth: 460,
        margin: "0 auto",
        padding: "0 24px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className="center" style={{ marginBottom: 24 }}>
        <div className="brand" style={{ justifyContent: "center", fontSize: 24, color: "var(--ink)" }}>
          <span className="logo" style={{ width: 38, height: 38, fontSize: 22 }}>
            L
          </span>
          <span className="wordmark">Learnly</span>
        </div>
      </div>
      <AuthForm initialRole={initialRole} initialMode={initialMode} />
    </div>
  );
}
