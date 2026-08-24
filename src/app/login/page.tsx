import AuthForm from "@/components/AuthForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { role?: string; mode?: string };
}) {
  const initialRole = searchParams.role === "parent" ? "parent" : "student";
  const initialMode = searchParams.mode === "signup" ? "signup" : "login";
  return (
    <div className="wrap" style={{ maxWidth: 460, paddingTop: 48, paddingBottom: 48 }}>
      <div className="center" style={{ marginBottom: 22 }}>
        <div className="brand" style={{ justifyContent: "center", fontSize: 22 }}>
          <span className="logo" style={{ width: 40, height: 40, fontSize: 22 }}>
            🦫
          </span>{" "}
          Querly
        </div>
        <p className="muted small mt8">Learn data. Win daily.</p>
      </div>
      <AuthForm initialRole={initialRole} initialMode={initialMode} />
    </div>
  );
}
