import fs from 'fs';
import path from 'path';

export interface Frontmatter {
  name: string;
  slug: string;
  color?: string;
  tagline?: string;
  defaultModel?: string;
  mustHave?: string[];
  powerUps?: string[];
  recommendedModels?: string[];
  combos?: string[];
  type?: 'mcp' | 'skill' | 'model' | 'config';
  worksWith?: string[];
  rating?: number;
  install?: string;
  affiliate?: { url: string; rel: string };
  updatedAt?: string;
  version?: string;
  stars?: string;
  features?: string[];
  transitionNote?: string;
  provider?: string;
  strength?: string;
  [key: string]: any;
}

export interface ContentItem {
  frontmatter: Frontmatter;
  content: string;
}

export function parseMDX(filePath: string): ContentItem {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: { name: path.basename(filePath), slug: path.basename(filePath, '.mdx') }, content: rawContent };
  }
  
  const yamlBlock = match[1];
  const content = match[2];
  const frontmatter: any = {};
  
  yamlBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let valStr = line.slice(colonIndex + 1).trim();
      
      // Remove enclosing quotes
      if ((valStr.startsWith('"') && valStr.endsWith('"')) || (valStr.startsWith("'") && valStr.endsWith("'"))) {
        valStr = valStr.slice(1, -1);
      }
      
      // Parse arrays e.g., ["a", "b"] or ['a', 'b']
      if (valStr.startsWith('[') && valStr.endsWith(']')) {
        try {
          const formatted = valStr.replace(/'/g, '"');
          frontmatter[key] = JSON.parse(formatted);
          return;
        } catch {
          frontmatter[key] = valStr
            .slice(1, -1)
            .split(',')
            .map(x => x.trim().replace(/^["']|["']$/g, ''));
          return;
        }
      }
      
      // Parse inline sub-objects e.g., { url: "", rel: "" }
      if (valStr.startsWith('{') && valStr.endsWith('}')) {
        const obj: any = {};
        const pairs = valStr.slice(1, -1).split(',');
        pairs.forEach(pair => {
          const colonIdx = pair.indexOf(':');
          if (colonIdx !== -1) {
            const k = pair.slice(0, colonIdx).trim();
            let v = pair.slice(colonIdx + 1).trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
              v = v.slice(1, -1);
            }
            obj[k] = v;
          }
        });
        frontmatter[key] = obj;
        return;
      }
      
      if (valStr === 'true') {
        frontmatter[key] = true;
      } else if (valStr === 'false') {
        frontmatter[key] = false;
      } else if (!isNaN(Number(valStr)) && valStr !== '') {
        frontmatter[key] = Number(valStr);
      } else {
        frontmatter[key] = valStr;
      }
    }
  });
  
  return { frontmatter: frontmatter as Frontmatter, content: content.trim() };
}

export function getCollection(type: string): ContentItem[] {
  const dirPath = path.join(process.cwd(), 'content', type);
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath);
  return files
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(file => parseMDX(path.join(dirPath, file)));
}
