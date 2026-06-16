'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ContentItem } from '@/lib/content';
import { getPrimaryPurpose } from '@/lib/purpose';

interface GenericDetailsViewProps {
  item: ContentItem;
  type: string;
  agents: ContentItem[];
}

export default function GenericDetailsView({ item, type, agents }: GenericDetailsViewProps) {
  const [copiedText, setCopiedText] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Find all agents that support this resource
  const supportedAgents = agents.filter(agent => {
    const slug = item.frontmatter.slug;
    const mustHave = agent.frontmatter.mustHave || [];
    const powerUps = agent.frontmatter.powerUps || [];
    const recommendedModels = agent.frontmatter.recommendedModels || [];
    const worksWith = item.frontmatter.worksWith || [];
    
    return (
      mustHave.includes(slug) ||
      powerUps.includes(slug) ||
      recommendedModels.includes(slug) ||
      worksWith.includes(agent.frontmatter.slug)
    );
  });

  const categoryLabel = {
    mcp: 'MCP Server',
    models: 'Mô hình LLM',
    skills: 'Agent Skill'
  }[type] || 'Tài nguyên';

  // Generate agent-specific MCP command register formats
  const getMCPRegisterCommand = (agentSlug: string) => {
    const mcpName = item.frontmatter.slug;
    const installCmd = item.frontmatter.install || `npx -y @modelcontextprotocol/server-${mcpName}`;

    if (agentSlug === 'claude-code') {
      return `claude mcp add ${mcpName} ${installCmd}`;
    } else if (agentSlug === 'gemini-antigravity-cli') {
      return `antigravity mcp register ${mcpName} ${installCmd}`;
    } else if (agentSlug === 'codex-cli') {
      return `codex mcp add ${mcpName} ${installCmd}`;
    } else if (agentSlug === 'opencode') {
      return `opencode mcp register ${mcpName} ${installCmd}`;
    } else if (agentSlug === 'openclaw') {
      return `openclaw register-tool mcp ${mcpName} ${installCmd}`;
    }
    return `mcp register ${mcpName} ${installCmd}`;
  };

  return (
    <div className="w-full text-foreground text-left">
      
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Main Description & Integration guides (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          
          {/* Overview Section */}
          <div className="border border-border bg-card rounded-2xl p-6 shadow-sm">
            <h2 className="font-sans font-semibold text-lg text-foreground border-b border-border/60 pb-3 mb-4">
              Giới thiệu & Tổng quan
            </h2>
            <p className="text-muted-foreground text-sm font-normal leading-relaxed whitespace-pre-wrap">
              {item.content}
            </p>

            {item.frontmatter.strength && (
              <div className="mt-5 bg-secondary/30 border border-border/50 p-4 rounded-xl text-sm font-normal leading-relaxed">
                <span className="text-foreground/80 font-sans font-semibold text-[11px] block mb-2 uppercase tracking-wider">Thế mạnh logic & lập trình:</span>
                <p className="text-foreground">{item.frontmatter.strength}</p>
              </div>
            )}
          </div>

          {/* Integration Guide Section */}
          {type === 'mcp' && supportedAgents.length > 0 && (
            <div className="border border-border bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="font-sans font-semibold text-lg text-foreground border-b border-border/60 pb-3 mb-4">
                Hướng dẫn tích hợp CLI
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed font-normal mb-5">
                Lệnh terminal để đăng ký trực tiếp MCP server {item.frontmatter.name} này vào từng coding agent tương thích:
              </p>
              <div className="grid grid-cols-1 gap-4">
                {supportedAgents.map(agent => {
                  const regCmd = getMCPRegisterCommand(agent.frontmatter.slug);
                  return (
                    <div key={agent.frontmatter.slug} className="border border-border/60 bg-secondary/10 rounded-xl p-4 flex flex-col gap-3 hover:border-foreground/20 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-semibold text-sm text-foreground">{agent.frontmatter.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">Registry Command</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 bg-secondary/30 border border-border/50 rounded-lg p-3 overflow-x-auto scrollbar-none shadow-sm">
                        <code className="text-foreground text-xs font-mono flex-1 whitespace-nowrap pr-2">
                          {regCmd}
                        </code>
                        <button
                          onClick={() => handleCopy(regCmd)}
                          className="bg-background border border-border hover:bg-secondary text-foreground px-3 py-1.5 rounded-md text-[10px] font-medium transition-all shrink-0 active:scale-95"
                        >
                          {copiedText === regCmd ? 'COPIED' : 'COPY'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Supported Agents Section */}
          <div className="border border-border bg-card rounded-2xl p-6 shadow-sm">
            <h2 className="font-sans font-semibold text-lg text-foreground border-b border-border/60 pb-3 mb-4">
              Các Coding Agents tương thích
            </h2>
            
            {supportedAgents.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                Chưa có cấu hình Agents chính thức nào đăng ký sử dụng tài nguyên này.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {supportedAgents.map(agent => (
                  <Link
                    key={agent.frontmatter.slug}
                    href={`/catalog/agents/${agent.frontmatter.slug}`}
                    className="p-5 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-sm transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-sans font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {agent.frontmatter.name}
                        </span>
                        <span className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full font-mono font-medium">
                          v{agent.frontmatter.version}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs mt-2 line-clamp-2 leading-relaxed font-normal">
                        {agent.frontmatter.tagline}
                      </p>
                    </div>
                    <div className="flex items-center justify-end font-sans text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors mt-2">
                      Cấu hình agent &rarr;
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Metadata & Setup Box (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          
          <div className="border border-border bg-card rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            
            {/* Title & Badge */}
            <div className="flex flex-col gap-2">
              <span className="bg-secondary text-secondary-foreground text-[10px] font-semibold font-sans uppercase tracking-wider px-2 py-0.5 rounded-full w-fit">
                {categoryLabel}
              </span>
              <h1 className="text-2xl font-sans font-bold tracking-tight text-foreground mt-1">
                {item.frontmatter.name}
              </h1>
            </div>

            {/* Purpose Callout Box */}
            <div className="bg-secondary/30 border border-border/50 p-3 rounded-xl text-xs font-sans text-foreground leading-relaxed text-left flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5">🎯</span>
              <div>
                <strong className="block text-[11px] text-foreground/80 font-semibold mb-1">Công dụng chính</strong>
                <span className="text-muted-foreground">{getPrimaryPurpose(item.frontmatter.slug)}</span>
              </div>
            </div>

            <hr className="border-border/50" />

            {/* Metadata keys */}
            <div className="flex flex-col gap-3 text-sm font-sans">
              {item.frontmatter.rating && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Đánh giá:</span>
                  <span className="font-mono text-foreground bg-secondary/50 border border-border/50 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                    ★ {item.frontmatter.rating}
                  </span>
                </div>
              )}
              {item.frontmatter.provider && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Nhà cung cấp:</span>
                  <strong className="text-foreground text-sm font-semibold">{item.frontmatter.provider}</strong>
                </div>
              )}
              {item.frontmatter.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Cập nhật:</span>
                  <span className="text-muted-foreground font-mono text-[11px]">{item.frontmatter.updatedAt}</span>
                </div>
              )}
            </div>

            {/* CLI Setup Command */}
            {item.frontmatter.install && (
              <div className="flex flex-col gap-2 border-t border-border/50 pt-4">
                <span className="text-xs text-muted-foreground font-sans font-medium">CLI Setup Command:</span>
                <div className="flex items-center justify-between gap-3 bg-secondary/30 border border-border/50 rounded-lg p-3 overflow-x-auto scrollbar-none shadow-sm">
                  <code className="text-foreground text-xs font-mono flex-1 whitespace-nowrap pr-2">
                    {item.frontmatter.install}
                  </code>
                  <button
                    onClick={() => handleCopy(item.frontmatter.install!)}
                    className="bg-background border border-border hover:bg-secondary text-foreground px-3 py-1.5 rounded-md text-[10px] font-medium transition-all shrink-0 active:scale-95"
                  >
                    {copiedText === item.frontmatter.install ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
            )}

            {/* Removed Affiliate Link by ponytail */}

          </div>

        </div>

      </div>

    </div>
  );
}
