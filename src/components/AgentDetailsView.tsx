'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ContentItem } from '@/lib/content';
import { getPrimaryPurpose } from '@/lib/purpose';

interface AgentDetailsViewProps {
  agent: ContentItem;
  mcp: ContentItem[];
  models: ContentItem[];
  skills: ContentItem[];
}

// Fallback installation commands for agents
const agentInstallCommands: Record<string, string> = {
  "claude-code": "npm i -g @anthropic-ai/claude-code",
  "codex-cli": "npm i -g @codex-space/cli",
  "gemini-antigravity-cli": "npm i -g @google/antigravity-cli",
  "opencode": "npm i -g opencode-terminal",
  "openhands": "docker run -d -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock openhands/openhands:latest",
  "devin": "npm i -g devin-agent-cli",
  "factory-droid": "pip install factory-droid-agent",
  "openclaw": "pip install openclaw-gateway",
  "hermes-agent": "npm i -g hermes-agent-cli",
  "ampcode-neo": "npm i -g ampcode-neo-cli",
  "augmentcode": "npm i -g augmentcode-cli"
};

// Fallback environment setups for agents
const agentEnvVariables: Record<string, string> = {
  "claude-code": "export ANTHROPIC_API_KEY=\"your_api_key_here\"",
  "codex-cli": "export CODEX_API_KEY=\"your_api_key_here\"",
  "gemini-antigravity-cli": "export GEMINI_API_KEY=\"your_api_key_here\"",
  "opencode": "export OPENAI_API_KEY=\"your_api_key_here\"",
  "openhands": "export OPENAI_API_KEY=\"your_api_key_here\"",
  "devin": "export COGNITION_API_KEY=\"your_api_key_here\"",
  "factory-droid": "export DROID_API_KEY=\"your_api_key_here\"",
  "openclaw": "export OPENCLAW_API_KEY=\"your_api_key_here\"",
  "hermes-agent": "export HERMES_API_KEY=\"your_api_key_here\"",
  "ampcode-neo": "export AMPCODE_API_KEY=\"your_api_key_here\"",
  "augmentcode": "export AUGMENT_API_KEY=\"your_api_key_here\""
};

export default function AgentDetailsView({ agent, mcp, models, skills }: AgentDetailsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());

  const toggleNodeComplete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompletedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const filteredItems = (list: any[]) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(item => 
      item.frontmatter.name.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      (item.frontmatter.install && item.frontmatter.install.toLowerCase().includes(q))
    );
  };

  // Group all linked resources by their category type dynamically
  const linkedResourcesByCategory = useMemo(() => {
    const categories: Record<string, ContentItem[]> = {};
    const agentSlug = agent.frontmatter.slug;
    
    const addItem = (category: string, item: ContentItem) => {
      if (!categories[category]) {
        categories[category] = [];
      }
      if (!categories[category].some(i => i.frontmatter.slug === item.frontmatter.slug)) {
        categories[category].push(item);
      }
    };

    // Scan MCP
    mcp.forEach(item => {
      const worksWith = item.frontmatter.worksWith || [];
      const mustHave = agent.frontmatter.mustHave || [];
      const powerUps = agent.frontmatter.powerUps || [];
      if (worksWith.includes(agentSlug) || mustHave.includes(item.frontmatter.slug) || powerUps.includes(item.frontmatter.slug)) {
        addItem('mcp', item);
      }
    });

    // Scan Models
    models.forEach(item => {
      const worksWith = item.frontmatter.worksWith || [];
      const recommended = agent.frontmatter.recommendedModels || [];
      if (worksWith.includes(agentSlug) || recommended.includes(item.frontmatter.slug)) {
        addItem('models', item);
      }
    });

    // Scan Skills
    skills.forEach(item => {
      const worksWith = item.frontmatter.worksWith || [];
      const mustHave = agent.frontmatter.mustHave || [];
      const powerUps = agent.frontmatter.powerUps || [];
      if (worksWith.includes(agentSlug) || mustHave.includes(item.frontmatter.slug) || powerUps.includes(item.frontmatter.slug)) {
        addItem('skills', item);
      }
    });

    return categories;
  }, [agent, mcp, models, skills]);

  // Extract must-have and power-up list items directly
  const mustHaves = useMemo(() => {
    const slugs = agent.frontmatter.mustHave || [];
    const all = [...mcp, ...skills];
    return all.filter(item => slugs.includes(item.frontmatter.slug));
  }, [agent, mcp, skills]);

  const powerUps = useMemo(() => {
    const slugs = agent.frontmatter.powerUps || [];
    const all = [...mcp, ...skills];
    return all.filter(item => slugs.includes(item.frontmatter.slug));
  }, [agent, mcp, skills]);

  // Capabilities section removed by ponytail

  const categoryLabels: Record<string, string> = {
    roadmap: 'Lộ trình Setup',
    mcp: 'MCP Servers',
    models: 'Mô hình LLM',
    skills: 'Agent Skills',
  };

  const availableCategories = useMemo(() => {
    const keys = ['roadmap'];
    Object.keys(linkedResourcesByCategory).forEach(k => {
      keys.push(k);
    });
    if (agent.frontmatter.combos && agent.frontmatter.combos.length > 0) {
      keys.push('combos');
    }
    return keys;
  }, [linkedResourcesByCategory, agent]);

  const [activeTab, setActiveTab] = useState<string>('roadmap');

  // Auto-select the first available tab category if reset
  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(activeTab)) {
      setActiveTab('roadmap');
    }
  }, [availableCategories, activeTab]);

  // Generate agent-specific MCP command register formats
  const getMCPRegisterCommand = (mcpItem: ContentItem) => {
    const agentSlug = agent.frontmatter.slug;
    const mcpName = mcpItem.frontmatter.slug;
    const installCmd = mcpItem.frontmatter.install || `npx -y @modelcontextprotocol/server-${mcpName}`;

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
    <div className="w-full flex flex-col items-center pt-6 md:pt-12 pb-24 overflow-hidden relative font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0" />

      {/* The Central Spine Line - connected from root node to the bottom */}
      <div className="absolute left-[38px] md:left-1/2 top-40 md:top-48 bottom-12 w-[3px] bg-border/50 md:-translate-x-1/2 rounded-full z-0"></div>

      {/* ROOT NODE (AGENT HEADER) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mb-16 md:mb-24 w-full">
        <div className="bg-primary text-primary-foreground border-4 border-primary/20 px-8 py-8 rounded-3xl shadow-[0_0_50px_rgba(148,114,20,0.15)] max-w-2xl w-full mx-4 relative overflow-hidden group">
          
          <div className="relative flex flex-col items-center gap-4 z-10">
            <span className="bg-background/20 text-primary-foreground/90 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border border-primary-foreground/20">
              Agent Ecosystem Root
            </span>
            <h1 className="font-extrabold text-4xl md:text-5xl tracking-tight">
              {agent.frontmatter.name}
            </h1>
            <span className="bg-background text-primary px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-sm">
              v{agent.frontmatter.version}
            </span>
            <p className="text-primary-foreground/90 text-sm md:text-base mt-2 max-w-lg mx-auto font-medium leading-relaxed">
              {agent.frontmatter.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* THE TECH STACK FLOWCHART */}
      <div className="relative w-full max-w-5xl mx-auto px-4 md:px-0 z-10">

            {[
              {
                id: "core",
                title: `Client: ${agent.frontmatter.name}`,
                icon: "⚡",
                content: (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3 bg-secondary/30 border border-border/50 rounded-lg p-3 overflow-x-auto scrollbar-none shadow-sm">
                      <code className="text-foreground text-xs font-mono flex-1 whitespace-nowrap pr-2">
                        {agent.frontmatter.install || agentInstallCommands[agent.frontmatter.slug] || `npm i -g ${agent.frontmatter.slug}`}
                      </code>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(agent.frontmatter.install || agentInstallCommands[agent.frontmatter.slug] || `npm i -g ${agent.frontmatter.slug}`); }}
                        className="bg-background border border-border hover:bg-secondary text-foreground px-3 py-1.5 rounded-md text-[10px] font-medium transition-all shrink-0 active:scale-95"
                      >
                        {copiedText === (agent.frontmatter.install || agentInstallCommands[agent.frontmatter.slug] || `npm i -g ${agent.frontmatter.slug}`) ? 'COPIED' : 'COPY'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 overflow-x-auto scrollbar-none shadow-md">
                      <code className="text-emerald-400 text-xs font-mono flex-1 whitespace-nowrap pr-2">
                        {agentEnvVariables[agent.frontmatter.slug] || "export API_KEY=\"your_key_here\""}
                      </code>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(agentEnvVariables[agent.frontmatter.slug] || "export API_KEY=\"your_key_here\""); }}
                        className="bg-[#d4af37] hover:bg-[#c29e2f] text-black px-3 py-1 rounded text-[10px] font-mono font-bold transition-all shrink-0 active:scale-95 uppercase tracking-wider"
                      >
                        {copiedText === (agentEnvVariables[agent.frontmatter.slug] || "export API_KEY=\"your_key_here\"") ? 'COPIED' : 'COPY'}
                      </button>
                    </div>
                  </div>
                )
              },
              {
                id: "model",
                title: "Model Khuyên Dùng",
                icon: "🧠",
                content: (
                  <div className="text-sm text-foreground">
                    Được tối ưu tốt nhất trên: <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded-md">{agent.frontmatter.defaultModel || "GPT/Claude"}</span>
                  </div>
                )
              },
              ...(linkedResourcesByCategory['mcp'] || []).map(mcp => ({
                id: `mcp-${mcp.frontmatter.slug}`,
                title: `MCP: ${mcp.frontmatter.name}`,
                icon: "🔌",
                content: (
                  <div className="flex items-center justify-between gap-3 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 overflow-x-auto scrollbar-none shadow-sm">
                    <code className="text-emerald-400 text-xs font-mono flex-1 whitespace-nowrap pr-2">
                      {getMCPRegisterCommand(mcp)}
                    </code>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopy(getMCPRegisterCommand(mcp)); }}
                      className="bg-[#d4af37] hover:bg-[#c29e2f] text-black px-3 py-1 rounded text-[10px] font-mono font-bold transition-all shrink-0 active:scale-95 uppercase tracking-wider"
                    >
                      {copiedText === getMCPRegisterCommand(mcp) ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                )
              })),
              ...(linkedResourcesByCategory['skills'] || []).map(sk => ({
                id: `skill-${sk.frontmatter.slug}`,
                title: `Skill: ${sk.frontmatter.name}`,
                icon: "🎯",
                content: (
                  <Link
                    href={`/catalog/skills/${sk.frontmatter.slug}`}
                    className="bg-background border border-border/80 hover:border-primary/50 text-foreground px-3 py-2.5 rounded-lg font-sans text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-sm w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Xem Prompt / Cài đặt</span>
                    <span className="text-primary ml-auto">→</span>
                  </Link>
                )
              }))
            ].map((node, index) => {
              const isCompleted = completedNodes.has(node.id);
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={node.id} 
                  className={`relative flex flex-col md:flex-row items-start md:items-center w-full mb-10 group ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* The Node (Circle) */}
                  <div 
                    className="absolute left-6 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-card bg-card z-10 -translate-x-[23px] md:translate-x-0 cursor-pointer"
                    onClick={(e) => toggleNodeComplete(e, node.id)}
                  >
                    <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${isCompleted ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(148,114,20,0.5)]' : 'bg-secondary text-foreground hover:bg-primary/20 border border-border'}`}>
                      {isCompleted ? '✓' : node.icon}
                    </div>
                  </div>

                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block w-1/2"></div>

                  {/* Content Box */}
                  <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div 
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 relative ${isCompleted ? 'border-primary/40 bg-primary/5' : 'border-border bg-background hover:border-primary/30'} shadow-sm text-left w-full max-w-[90%] mx-auto md:max-w-none md:mx-0`}
                    >
                      {/* Connecting mini line to central spine on desktop */}
                      <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-12 h-[2px] ${isEven ? '-right-12' : '-left-12'} ${isCompleted ? 'bg-primary/40' : 'bg-border/60'}`}></div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                        <h3 className={`font-sans font-bold text-lg tracking-tight ${isCompleted ? 'text-foreground/60 line-through' : 'text-foreground'}`}>
                          {node.title}
                        </h3>
                        <button
                          onClick={(e) => toggleNodeComplete(e, node.id)}
                          className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans uppercase tracking-wider transition-colors border ${isCompleted ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary/50 border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                        >
                          {isCompleted ? 'Đã Chọn' : 'Chọn Dùng'}
                        </button>
                      </div>
                      
                      <div className={`transition-opacity duration-300 ${isCompleted ? 'opacity-75' : 'opacity-100'}`}>
                        {node.content}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
    </div>
  );
}
