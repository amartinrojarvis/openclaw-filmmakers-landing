import Link from 'next/link';
import { TOOLS } from '@/lib/casos-vibe-coding';

export function CasosLogo() {
  return (
    <Link className="logo" href="/casos-de-uso-vibe-coding">
      <span className="m">IA</span>
      <b>IA para Filmmakers</b>
    </Link>
  );
}

export function ToolBadge({ tool }: { tool: string }) {
  const [abbr, tone] = TOOLS[tool] ?? [tool.slice(0, 2).toUpperCase(), ''];
  return <span className={`badge${tone ? ` ${tone}` : ''}`} title={tool}>{abbr}</span>;
}
