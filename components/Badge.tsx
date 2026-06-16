"use client";

const colorMap: Record<string, string> = {
  client: "bg-emerald-50 text-emerald-700 border-emerald-200",
  lead: "bg-blue-50 text-blue-700 border-blue-200",
  vendor: "bg-amber-50 text-amber-700 border-amber-200",
  partner: "bg-purple-50 text-purple-700 border-purple-200",
  prospect: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function Badge({ label }: { label: string }) {
  const key = label.toLowerCase();
  const cls =
    colorMap[key] ?? "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}
    >
      {label || "—"}
    </span>
  );
}
