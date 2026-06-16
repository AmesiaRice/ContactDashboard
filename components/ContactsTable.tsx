"use client";

import { Contact } from "@/lib/types";
import Badge from "./Badge";
import { Mail, Phone } from "lucide-react";

interface ContactsTableProps {
  contacts: Contact[];
  search: string;
  filterType: string;
}

export default function ContactsTable({
  contacts,
  search,
  filterType,
}: ContactsTableProps) {
  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q);
    const matchesType =
      !filterType ||
      c.contactType.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-lg font-medium">No contacts found</p>
        <p className="text-sm mt-1">Try adjusting your search or filter</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {[
              "#",
              "Name",
              "Phone",
              "Company",
              "City",
              "Email",
              "Type",
              "Remarks",
              "Date",
            ].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {filtered.map((c, i) => (
            <tr
              key={i}
              className="hover:bg-slate-50 transition-colors duration-100"
            >
              <td className="px-4 py-3.5 text-slate-400 text-xs">{i + 1}</td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center flex-shrink-0">
                    {c.name.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 whitespace-nowrap">
                      {c.name || "—"}
                    </p>
                    {c.address && (
                      <p className="text-xs text-slate-400 truncate max-w-[160px]">
                        {c.address}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <a
                  href={`tel:${c.phone}`}
                  className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  <Phone size={12} />
                  {c.phone || "—"}
                </a>
              </td>
              <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                {c.company || "—"}
              </td>
              <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                <span>
                  {c.city}
                  {c.pincode && (
                    <span className="text-slate-400 ml-1 text-xs">
                      {c.pincode}
                    </span>
                  )}
                </span>
              </td>
              <td className="px-4 py-3.5">
                {c.email ? (
                  <a
                    href={`mailto:${c.email}`}
                    className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <Mail size={12} />
                    <span className="truncate max-w-[180px]">{c.email}</span>
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3.5">
                <Badge label={c.contactType} />
              </td>
              <td className="px-4 py-3.5 text-slate-500 max-w-[200px]">
                <span className="truncate block">{c.remarks || "—"}</span>
              </td>
              <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                {c.timestamp
                  ? new Date(c.timestamp).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
