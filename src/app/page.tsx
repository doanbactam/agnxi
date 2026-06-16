import { getCollection } from "@/lib/content";
import Dashboard from "@/components/Dashboard";
import CopyButton from "@/components/CopyButton";

export default function Home() {
  const agents = getCollection("agents");
  const mcp = getCollection("mcp");
  const models = getCollection("models");
  const skills = getCollection("skills");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/25 selection:text-primary">
      
      {/* Top Header Navigation */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-primary"></span>
            <span className="font-sans font-bold uppercase tracking-wider text-primary text-lg">
              AIStack
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-semibold tracking-wide text-foreground/85">
            <a href="#hero" className="hover:text-primary transition-colors">Về chúng tôi</a>
            <a href="#catalog" className="hover:text-primary transition-colors">Catalog</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Header minimal */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="max-w-4xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center gap-8">
        <h1 className="text-5xl sm:text-6xl md:text-[80px] font-sans font-bold tracking-tighter text-foreground leading-[1.1]">
          Bộ đồ chơi AI. <br className="hidden sm:block" />
          <span className="text-muted-foreground">Chọn. Lắp. Chạy.</span>
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <a 
            href="#catalog"
            className="text-primary-foreground bg-primary hover:bg-primary/90 px-6 py-3 rounded-full text-sm font-sans font-medium transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
          >
            Khám phá Catalog
          </a>
          <a 
            href="https://github.com/google-gemini/gemini-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border/60 bg-transparent hover:bg-secondary text-foreground px-6 py-3 rounded-full text-sm font-sans font-medium transition-all duration-200 active:scale-95 hover:border-foreground/20"
          >
            Đóng góp cấu hình
          </a>
        </div>
      </section>

      {/* Main Interactive Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-6 py-8 border-t border-border w-full">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-primary font-mono font-semibold">SPECIFICATION 01</span>
            <h2 className="text-3xl md:text-4xl font-display font-light tracking-wide text-foreground mt-2">
              Bản đồ cấu hình chi tiết
            </h2>
          </div>
        </div>
        <Dashboard 
          agents={agents} 
          mcp={mcp} 
          models={models} 
          skills={skills} 
        />
      </section>

      {/* Removed fluff sections by ponytail */}

      {/* Global Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-foreground/50">
          <span>AIStack &middot; PREMIUM EDITION &middot; 2026</span>
          <div className="flex items-center gap-6 text-[10px]">
            <a href="https://developers.googleblog.com" className="hover:text-foreground">Developers Blog</a>
            <a href="https://geminicli.com" className="hover:text-foreground">Gemini CLI</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
