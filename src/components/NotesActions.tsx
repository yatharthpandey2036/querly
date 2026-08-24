"use client";

export default function NotesActions({ text, filename }: { text: string; filename: string }) {
  function downloadTxt() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="no-print" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <button className="btn btn-primary" onClick={() => window.print()}>
        ⤓ Save as PDF
      </button>
      <button className="btn btn-ghost" onClick={downloadTxt}>
        ⤓ Download .txt
      </button>
    </div>
  );
}
