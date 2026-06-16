"use client";

import { useState, useEffect, useCallback } from "react";
import { Contact } from "@/lib/types";
import ContactsTable from "./ContactsTable";
import StatCard from "./StatCard";
import {
  Users,
  Building2,
  MapPin,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";

const FORM_URL =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ?? "#";

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContacts = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contacts", { cache: "no-store" });
      const json = await res.json();

      if (json.status === "error") throw new Error(json.message);

      setContacts(json.data as Contact[]);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Derived stats
  const uniqueCities = new Set(contacts.map((c) => c.city).filter(Boolean))
    .size;
  const uniqueCompanies = new Set(
    contacts.map((c) => c.company).filter(Boolean)
  ).size;
  const contactTypes = [
    ...new Set(contacts.map((c) => c.contactType).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900 leading-tight">
                Contacts Dashboard
              </h1>
              {lastUpdated && (
                <p className="text-xs text-slate-400">
                  Updated {lastUpdated.toLocaleTimeString("en-IN")}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh */}
            <button
              onClick={() => fetchContacts(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Add Contact → Google Form */}
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <ExternalLink size={14} />
              Add Contact
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Contacts"
            value={contacts.length}
            icon={<Users size={18} className="text-indigo-600" />}
            color="bg-indigo-50"
          />
          <StatCard
            label="Companies"
            value={uniqueCompanies}
            icon={<Building2 size={18} className="text-emerald-600" />}
            color="bg-emerald-50"
          />
          <StatCard
            label="Cities"
            value={uniqueCities}
            icon={<MapPin size={18} className="text-amber-600" />}
            color="bg-amber-50"
          />
          <StatCard
            label="Contact Types"
            value={contactTypes.length}
            icon={<Users size={18} className="text-purple-600" />}
            color="bg-purple-50"
          />
        </div>

        {/* ── Main card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by name, company, city, email, phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              />
            </div>

            {/* Filter by type */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white transition min-w-[160px]"
              >
                <option value="">All Types</option>
                {contactTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Result count */}
            <div className="flex items-center text-sm text-slate-500 whitespace-nowrap">
              {contacts.length} records
            </div>
          </div>

          {/* Table / States */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
              <Loader2 size={28} className="animate-spin text-indigo-500" />
              <p className="text-sm">Loading contacts…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
              <AlertCircle size={28} className="text-red-400" />
              <p className="font-medium text-slate-700">Failed to load data</p>
              <p className="text-sm text-slate-400 max-w-sm text-center">
                {error}
              </p>
              <button
                onClick={() => fetchContacts()}
                className="mt-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            <ContactsTable
              contacts={contacts}
              search={search}
              filterType={filterType}
            />
          )}
        </div>


      </main>
    </div>
  );
}
