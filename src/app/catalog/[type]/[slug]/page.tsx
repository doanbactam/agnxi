import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/content';
import AgentDetailsView from '@/components/AgentDetailsView';
import GenericDetailsView from '@/components/GenericDetailsView';

export async function generateStaticParams() {
  const types = ['agents', 'mcp', 'models', 'skills'];
  const paths: { type: string; slug: string }[] = [];
  
  for (const type of types) {
    const items = getCollection(type);
    items.forEach(item => {
      paths.push({
        type: type,
        slug: item.frontmatter.slug,
      });
    });
  }
  
  return paths;
}

interface CatalogPageProps {
  params: Promise<{
    type: string;
    slug: string;
  }>;
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { type, slug } = await params;
  
  const allowedTypes = ['agents', 'mcp', 'models', 'skills'];
  if (!allowedTypes.includes(type)) {
    notFound();
  }

  const items = getCollection(type);
  const item = items.find((i) => i.frontmatter.slug === slug);

  if (!item) {
    notFound();
  }

  const agents = getCollection("agents");
  const mcp = getCollection("mcp");
  const models = getCollection("models");
  const skills = getCollection("skills");

  const categoryLabel = {
    agents: 'Coding Agents',
    mcp: 'MCP Servers',
    models: 'Mô hình LLM',
    skills: 'Agent Skills'
  }[type] || 'Tài nguyên';

  return (
    <div className="flex flex-col min-h-screen bg-background neo-grid text-foreground selection:bg-primary/25 selection:text-primary">
      
      {/* Top Header Navigation */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-primary"></span>
            <Link href="/" className="font-sans font-bold uppercase tracking-wider text-primary text-lg hover:text-primary/80 transition-colors">
              AIStack
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="border border-primary/20 bg-secondary px-3.5 py-1.5 rounded text-xs font-mono text-primary hover:border-primary/50 transition-colors flex items-center gap-1.5 uppercase tracking-wider"
            >
              Quay lại Catalog
            </Link>
          </div>
        </div>
      </header>

      {/* Main Details Panel */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 font-mono text-xs uppercase tracking-wider text-foreground/50">
          <Link href="/" className="hover:text-primary transition-colors">Catalog</Link>
          <span className="mx-2">&middot;</span>
          <span className="hover:text-primary transition-colors">{categoryLabel}</span>
          <span className="mx-2">&middot;</span>
          <span className="text-primary font-bold">{item.frontmatter.name}</span>
        </div>

        {type === 'agents' ? (
          <AgentDetailsView 
            agent={item}
            mcp={mcp}
            models={models}
            skills={skills}
          />
        ) : (
          <GenericDetailsView 
            item={item}
            type={type}
            agents={agents}
          />
        )}
      </div>

      {/* Global Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground/60">
          <span>AIStack &middot; THIẾT KẾ PHIÊN BẢN HẠN CHẾ NEO-MIRAI &middot; 2026</span>
          <div className="flex items-center gap-6 text-[10px]">
            <a href="https://developers.googleblog.com" className="hover:text-muted-foreground">Developers Blog</a>
            <a href="https://geminicli.com" className="hover:text-muted-foreground">Gemini CLI</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
