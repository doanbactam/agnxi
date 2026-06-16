import { redirect } from 'next/navigation';
import { getCollection } from '@/lib/content';

export async function generateStaticParams() {
  const agents = getCollection("agents");
  return agents.map((agent) => ({
    slug: agent.frontmatter.slug,
  }));
}

interface AgentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  redirect(`/catalog/agents/${slug}`);
}
