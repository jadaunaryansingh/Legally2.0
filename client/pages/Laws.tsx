import Layout from "@/components/Layout";
import { useMemo, useState, useEffect } from "react";
import { BookOpen, FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";

type LawItem = {
  id: string;
  title: string;
  act: string;
  section?: string;
  summary: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Laws() {
  const [query, setQuery] = useState("");
  const [actFilter, setActFilter] = useState<string>("all");
  const [laws, setLaws] = useState<LawItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(6);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchLaws = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/browse/laws?page=${page}&limit=${limit}`
        );
        const data = await response.json();
        setLaws(data.items || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching laws:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLaws();
  }, [page, limit]);

  const acts = useMemo(
    () => ["all", ...Array.from(new Set(laws.map((item) => item.act)))],
    [laws]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return laws.filter((item) => {
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        (item.section || "").toLowerCase().includes(q);
      const matchesAct = actFilter === "all" || item.act === actFilter;
      return matchesQuery && matchesAct;
    });
  }, [query, actFilter, laws]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold">Loading laws...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Browse Indian Laws
          </h1>
          <Link
            to="/chat"
            className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition"
          >
            Ask Legally
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, section, or summary..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          <select
            value={actFilter}
            onChange={(e) => setActFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {acts.map((a) => (
              <option key={a} value={a}>
                {a === "all" ? "All Acts" : a}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((law) => (
            <div
              key={law.id}
              className="group relative border border-white/10 rounded-xl p-6 hover:border-white/40 transition-all duration-300 hover:bg-white/10 active:scale-95 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/60">{law.act}</div>
                  <FileText className="w-5 h-5 text-white/70" />
                </div>
                <h3 className="text-xl font-bold">{law.title}</h3>
                {law.section && (
                  <div className="text-white/70 text-sm">{law.section}</div>
                )}
                <p className="text-white/80 text-sm leading-relaxed">{law.summary}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-white/70">
              No results. Try a different search or act filter.
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-white/70">
            Page {page} of {totalPages}
          </div>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}
