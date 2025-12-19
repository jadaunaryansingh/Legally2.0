import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { BookOpen, Search } from "lucide-react";

interface Law {
  id: string;
  title: string;
  act?: string;
  section?: string;
  description?: string;
  category?: string;
}

// Static sample laws so the page works without a backend
const STATIC_LAWS: Law[] = [
  {
    id: "ipc-302",
    title: "Punishment for Murder",
    act: "Indian Penal Code, 1860",
    section: "302",
    category: "IPC",
    description:
      "Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine.",
  },
  {
    id: "ipc-420",
    title: "Cheating and dishonestly inducing delivery of property",
    act: "Indian Penal Code, 1860",
    section: "420",
    category: "IPC",
    description:
      "Covers cheating with dishonest intention, including inducing delivery of property or valuable security.",
  },
  {
    id: "crpc-154",
    title: "Information in cognizable cases (FIR)",
    act: "Code of Criminal Procedure, 1973",
    section: "154",
    category: "CrPC",
    description:
      "Mandates registration of First Information Report (FIR) for cognizable offences reported to the police.",
  },
  {
    id: "const-21",
    title: "Protection of life and personal liberty",
    act: "Constitution of India",
    section: "Article 21",
    category: "Constitution",
    description:
      "No person shall be deprived of his life or personal liberty except according to procedure established by law.",
  },
  {
    id: "ipc-354",
    title: "Assault or criminal force to woman with intent to outrage her modesty",
    act: "Indian Penal Code, 1860",
    section: "354",
    category: "IPC",
    description:
      "Provides punishment for assault or criminal force used against a woman intending to outrage her modesty.",
  },
];

export default function Laws() {
  const [laws, setLaws] = useState<Law[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate loading state, then set static data
    const timer = setTimeout(() => {
      setLaws(STATIC_LAWS);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const filteredLaws = searchQuery
    ? laws.filter(
        (law) =>
          law.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          law.act?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          law.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          law.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : laws;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-white/80" />
            <h1 className="text-4xl md:text-5xl font-bold text-white animate-dancing-glow">
              Browse Laws
            </h1>
          </div>
          <p className="text-white/60 text-lg">
            Explore Indian laws, acts, and legal provisions
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-slide-up">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search laws, acts, or sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && laws.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <BookOpen className="w-12 h-12 text-white/40 mb-4 animate-pulse" />
            <p className="text-white/60">Loading laws...</p>
          </div>
        )}

        {/* Laws Grid */}
        {!loading && filteredLaws.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredLaws.map((law, index) => (
              <div
                key={law.id || index}
                className="group relative border border-white/10 rounded-xl p-6 hover:border-white/40 transition-all duration-300 hover:bg-white/10 cursor-pointer active:scale-95 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${(index % 9) * 0.05}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all transform group-hover:scale-110 bg-white/5 group-hover:bg-white/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white/80 group-hover:text-white transition-all" />
                      </div>
                      {law.category && (
                        <span className="px-2 py-1 text-xs font-medium bg-white/10 text-white/70 rounded border border-white/10">
                          {law.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors group-hover:animate-glow-text line-clamp-2">
                    {law.title || law.act || "Untitled Law"}
                  </h3>
                  {(law.act || law.section) && (
                    <p className="text-white/50 text-sm mb-3 font-mono">
                      {law.act && <span>{law.act}</span>}
                      {law.act && law.section && <span> • </span>}
                      {law.section && <span>Section {law.section}</span>}
                    </p>
                  )}
                  {law.description && (
                    <p className="text-white/60 text-sm group-hover:text-white/90 transition-colors line-clamp-3">
                      {law.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredLaws.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">
              {searchQuery ? "No laws found" : "No laws available"}
            </h3>
            <p className="text-white/40 text-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Laws will appear here once available"}
            </p>
          </div>
        )}

      </div>
    </Layout>
  );
}

