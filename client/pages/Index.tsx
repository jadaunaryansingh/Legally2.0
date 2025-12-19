import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { BookOpen, Search, AlertCircle, Lightbulb, FileText } from "lucide-react";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative overflow-hidden">
        {/* Background animated elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-scale"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-scale" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="space-y-8 text-center animate-fade-in relative z-10">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-dancing-glow">
              AI-Powered Legal Intelligence
            </h1>
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed animate-glow-text">
              Understand laws, regulations, and applicable sections — instantly and accurately.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12 animate-bounce-in">
            <Link
              to="/chat"
              className="group relative px-10 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-white/90 transition-all duration-300 hover:shadow-2xl hover:shadow-white/40 overflow-hidden active:scale-95 transform hover:scale-110 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                ⚖️ Ask Legally
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 transform scale-0 group-active:scale-100 transition-transform duration-500 origin-center rounded-xl"></span>
              <span className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-xl transition-all duration-300"></span>
            </Link>
            <Link
              to="/laws"
              className="group relative px-10 py-4 border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:border-white hover:bg-white/10 transition-all duration-300 active:scale-95 overflow-hidden transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/20"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                📚 Browse Laws
              </span>
              <span className="absolute inset-0 bg-white/5 transform scale-0 group-active:scale-100 transition-transform duration-500 origin-center rounded-xl"></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 animate-slide-up animate-dancing-glow">
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Law Explanation */}
          <div className="group relative border border-white/10 rounded-xl p-8 hover:border-white/40 transition-all duration-300 hover:bg-white/10 cursor-pointer active:scale-95 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/20 overflow-hidden animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all transform group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-white/20 bg-white/5 group-hover:bg-white/10">
                <BookOpen className="w-8 h-8 text-white/80 group-hover:text-white transition-all animate-sparkling" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors group-hover:animate-glow-text">Law Explanation</h3>
              <p className="text-white/60 text-sm group-hover:text-white/90 transition-colors leading-relaxed">
                Understand laws in plain language without legal jargon.
              </p>
            </div>
          </div>

          {/* Applicable Sections */}
          <div className="group relative border border-white/10 rounded-xl p-8 hover:border-white/40 transition-all duration-300 hover:bg-white/10 cursor-pointer active:scale-95 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/20 overflow-hidden animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all transform group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-white/20 bg-white/5 group-hover:bg-white/10">
                <FileText className="w-8 h-8 text-white/80 group-hover:text-white transition-all animate-sparkling" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors group-hover:animate-glow-text">Applicable Sections</h3>
              <p className="text-white/60 text-sm group-hover:text-white/90 transition-colors leading-relaxed">
                Identify relevant legal sections and acts instantly.
              </p>
            </div>
          </div>

          {/* Crime Scenario Analysis */}
          <div className="group relative border border-white/10 rounded-xl p-8 hover:border-white/40 transition-all duration-300 hover:bg-white/10 cursor-pointer active:scale-95 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/20 overflow-hidden animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all transform group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-white/20 bg-white/5 group-hover:bg-white/10">
                <AlertCircle className="w-8 h-8 text-white/80 group-hover:text-white transition-all animate-sparkling" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors group-hover:animate-glow-text">Crime Scenario</h3>
              <p className="text-white/60 text-sm group-hover:text-white/90 transition-colors leading-relaxed">
                Describe an incident and get comprehensive legal insight.
              </p>
            </div>
          </div>

          {/* Indian Law Focus */}
          <div className="group relative border border-white/10 rounded-xl p-8 hover:border-white/40 transition-all duration-300 hover:bg-white/10 cursor-pointer active:scale-95 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/20 overflow-hidden animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all transform group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-white/20 bg-white/5 group-hover:bg-white/10">
                <Lightbulb className="w-8 h-8 text-white/80 group-hover:text-white transition-all animate-sparkling" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors group-hover:animate-glow-text">Indian Law Focus</h3>
              <p className="text-white/60 text-sm group-hover:text-white/90 transition-colors leading-relaxed">
                IPC, CrPC, Constitution, and case law expertise.
              </p>
            </div>
          </div>

          {/* AI-Powered Search */}
          <div className="group relative border border-white/10 rounded-xl p-8 hover:border-white/40 transition-all duration-300 hover:bg-white/10 cursor-pointer active:scale-95 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/20 overflow-hidden animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all transform group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-white/20 bg-white/5 group-hover:bg-white/10">
                <Search className="w-8 h-8 text-white/80 group-hover:text-white transition-all animate-sparkling" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors group-hover:animate-glow-text">AI Search</h3>
              <p className="text-white/60 text-sm group-hover:text-white/90 transition-colors leading-relaxed">
                Fast and accurate legal information retrieval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="group relative border-2 border-white/20 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-white/5 to-white/0 hover:from-white/10 hover:to-white/5 hover:border-white/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20 active:scale-95 animate-slide-up overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 animate-dancing-glow">
              <AlertCircle className="w-6 h-6 flex-shrink-0 transform group-hover:rotate-12 transition-transform" />
              Important Disclaimer
            </h3>
            <p className="text-white/70 text-lg leading-relaxed group-hover:text-white/90 transition-colors">
              This platform provides legal information for educational purposes
              only and does not constitute legal advice. Always consult with a
              qualified legal professional before making any legal decisions. We are not liable for any consequences arising from the use of information provided here.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
