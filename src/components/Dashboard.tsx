'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ContentItem } from '@/lib/content';
import { getPrimaryPurpose } from '@/lib/purpose';

interface DashboardProps {
  agents: ContentItem[];
  mcp: ContentItem[];
  models: ContentItem[];
  skills: ContentItem[];
}

// Grouping logic removed by ponytail. Filtering handles discovery.
export default function Dashboard({ agents, mcp, models, skills }: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState<'agents' | 'mcp' | 'models' | 'skills'>('agents');
  const [searchQuery, setSearchQuery] = useState('');

  const currentList = useMemo(() => {
    switch (activeCategory) {
      case 'mcp':
        return mcp;
      case 'models':
        return models;
      case 'skills':
        return skills;
      case 'agents':
      default:
        return agents;
    }
  }, [activeCategory, agents, mcp, models, skills]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return currentList;
    const q = searchQuery.toLowerCase();
    return currentList.filter(item => 
      item.frontmatter.name.toLowerCase().includes(q) ||
      item.frontmatter.tagline?.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      item.frontmatter.features?.some((f: string) => f.toLowerCase().includes(q))
    );
  }, [currentList, searchQuery]);

  const categoryLabels = {
    agents: "🤖 Coding Agents",
    mcp: "🔌 MCP Servers",
    models: "🧠 Mô hình LLM",
    skills: "⚡ Agent Skills"
  };

  // Grouped logic removed by ponytail

  // Helper to render a card
  const renderCard = (item: ContentItem) => {
    const slug = item.frontmatter.slug;
    const name = item.frontmatter.name;
    
    let tagline = item.frontmatter.tagline || item.content;
    if (tagline.length > 150) {
      tagline = tagline.slice(0, 147) + '...';
    }
    
    let badgeText = '';
    let tags: string[] = [];
    
    if (activeCategory === 'agents') {
      badgeText = `v${item.frontmatter.version || '1.0'}`;
      tags = item.frontmatter.features?.slice(0, 2) || [];
    } else if (activeCategory === 'mcp') {
      badgeText = `★ ${item.frontmatter.rating || 'N/A'}`;
      tags = ['MCP Server'];
      if (item.frontmatter.install) {
        tags.push('CLI Tool');
      }
    } else if (activeCategory === 'models') {
      badgeText = item.frontmatter.provider || 'AI Model';
      tags = ['LLM'];
      if (item.frontmatter.rating) {
        tags.push(`★ ${item.frontmatter.rating}`);
      }
    } else if (activeCategory === 'skills') {
      badgeText = `★ ${item.frontmatter.rating || 'N/A'}`;
      tags = ['Skill'];
    }

    return (
      <Link
        key={slug}
        href={`/catalog/${activeCategory}/${slug}`}
        className="text-left p-5 rounded-xl border border-border bg-card text-card-foreground hover:border-foreground/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-4 group relative"
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-sans font-semibold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
              {name}
            </span>
            <span className="bg-secondary border border-border/50 text-[10px] text-secondary-foreground px-2 py-0.5 rounded-full font-mono font-medium shrink-0">
              {badgeText}
            </span>
          </div>
          <div className="text-[10px] font-sans font-medium text-muted-foreground bg-secondary/50 border border-border/30 px-2 py-0.5 rounded-md w-fit mt-2">
            🎯 {getPrimaryPurpose(slug)}
          </div>
          <p className="text-muted-foreground text-sm mt-3 font-normal leading-relaxed line-clamp-2">
            {tagline}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/50 w-full mt-auto">
          <div className="flex flex-wrap gap-1.5 items-center max-w-[70%]">
            {tags.map((tag: string, idx: number) => (
              <span key={idx} className="text-[10px] text-muted-foreground bg-transparent border border-border/60 px-1.5 py-0.5 rounded-md font-medium">
                {tag}
              </span>
            ))}
          </div>
          
          <span className="text-[11px] font-sans font-medium flex items-center gap-1 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
            Chi tiết
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 text-foreground">
      
      {/* Category Tabs as Interactive Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(categoryLabels).map(([catKey, label]) => {
          const count = catKey === 'agents' ? agents.length :
                        catKey === 'mcp' ? mcp.length :
                        catKey === 'models' ? models.length : skills.length;
          const isActive = activeCategory === catKey;
          
          return (
            <button
              key={catKey}
              onClick={() => { setActiveCategory(catKey as any); setSearchQuery(''); }}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-1.5 cursor-pointer select-none ${
                isActive
                  ? 'border-foreground/20 bg-card text-foreground shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.03)] scale-[1.02]'
                  : 'border-border bg-card/50 text-muted-foreground hover:border-foreground/20 hover:bg-card'
              }`}
            >
              <span className={`text-xs font-sans font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
              </span>
              <span className={`text-3xl font-sans font-semibold tracking-tight ${isActive ? 'text-foreground' : 'text-foreground/70'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Header Tool Belt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mt-4">
        <div className="flex items-center gap-2 font-sans text-sm font-semibold text-foreground text-left">
          <span className="w-1.5 h-4 bg-primary rounded-full"></span>
          Danh sách {activeCategory === 'agents' ? 'Coding Agents' : activeCategory === 'mcp' ? 'MCP Servers' : activeCategory === 'models' ? 'Mô hình LLM' : 'Agent Skills'}
          {searchQuery && (
            <span className="text-xs text-muted-foreground font-mono pl-1">
              ({filteredItems.length}/{currentList.length})
            </span>
          )}
        </div>
        
        <div className="relative w-full sm:w-80 shrink-0">
          <span className="absolute left-3 top-2.5 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm tài nguyên..."
            className="w-full bg-background border border-border rounded-xl px-4 pl-9 py-2 text-foreground focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30 placeholder-muted-foreground text-sm font-sans transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground font-sans text-xs font-medium"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid Collections Grid */}
      <div className="flex flex-col gap-6">
        {filteredItems.length === 0 ? (
          <div className="text-foreground/60 text-center py-16 border border-dashed border-border rounded-xl font-normal text-xs font-sans">
            Không tìm thấy kết quả phù hợp trong danh mục này.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map(item => renderCard(item))}
          </div>
        )}
      </div>

    </div>
  );
}
