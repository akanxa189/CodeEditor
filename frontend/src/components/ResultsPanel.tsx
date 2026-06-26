import type { ReviewResult } from '../types';
import ScoreRing from './ScoreRing';
import CodeEditor from './CodeEditor';
import type { Language } from '../types';

interface ResultsPanelProps {
  result: ReviewResult | null;
  loading: boolean;
  error: string | null;
}

function IssueBadge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: 'red' | 'yellow' | 'orange' | 'blue';
}) {
  const colorClasses = {
    red: 'border-terminal-red/40 bg-terminal-red/10 text-terminal-red',
    yellow: 'border-terminal-yellow/40 bg-terminal-yellow/10 text-terminal-yellow',
    orange: 'border-terminal-orange/40 bg-terminal-orange/10 text-terminal-orange',
    blue: 'border-terminal-blue/40 bg-terminal-blue/10 text-terminal-blue',
  };

  return (
    <div className={`rounded border px-3 py-2 text-sm ${colorClasses[color]}`}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, count, color }: { icon: string; title: string; count: number; color: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={`font-mono text-sm font-semibold ${color}`}>{icon}</span>
      <h3 className="font-mono text-sm font-semibold text-white">{title}</h3>
      <span className="rounded-full bg-terminal-border px-2 py-0.5 text-xs text-terminal-muted">
        {count}
      </span>
    </div>
  );
}

export default function ResultsPanel({ result, loading, error }: ResultsPanelProps) {
  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded border border-terminal-border bg-terminal-surface p-8">
        <div className="h-10 w-10 animate-spin-slow rounded-full border-2 border-terminal-border border-t-terminal-green" />
        <p className="font-mono text-sm text-terminal-muted">Analyzing code with Groq AI...</p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-terminal-green"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center rounded border border-terminal-red/30 bg-terminal-red/5 p-8">
        <div className="text-center">
          <p className="mb-2 font-mono text-terminal-red">Error</p>
          <p className="text-sm text-terminal-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded border border-terminal-border bg-terminal-surface p-8">
        <span className="font-mono text-4xl text-terminal-border">{'{}'}</span>
        <p className="text-center font-mono text-sm text-terminal-muted">
          Submit code to see AI review results
        </p>
        <p className="text-center text-xs text-terminal-muted/60">
          Bugs · Performance · Security · Best Practices
        </p>
      </div>
    );
  }

  return (
    <div className="custom-scrollbar flex h-full flex-col gap-6 overflow-y-auto rounded border border-terminal-border bg-terminal-surface p-5">
      <div className="flex justify-center border-b border-terminal-border pb-5">
        <ScoreRing score={result.score} />
      </div>

      {result.bugs.length > 0 && (
        <section>
          <SectionHeader icon="✕" title="Bugs" count={result.bugs.length} color="text-terminal-red" />
          <div className="space-y-2">
            {result.bugs.map((bug, i) => (
              <IssueBadge key={i} color="red">
                <div className="mb-1 font-mono text-xs opacity-70">Line {bug.line}</div>
                <div className="mb-1">{bug.issue}</div>
                <div className="text-xs opacity-80">Fix: {bug.fix}</div>
              </IssueBadge>
            ))}
          </div>
        </section>
      )}

      {result.performance.length > 0 && (
        <section>
          <SectionHeader icon="⚡" title="Performance" count={result.performance.length} color="text-terminal-yellow" />
          <div className="space-y-2">
            {result.performance.map((item, i) => (
              <IssueBadge key={i} color="yellow">
                <div className="mb-1">{item.issue}</div>
                <div className="text-xs opacity-80">{item.suggestion}</div>
              </IssueBadge>
            ))}
          </div>
        </section>
      )}

      {result.security.length > 0 && (
        <section>
          <SectionHeader icon="🔒" title="Security" count={result.security.length} color="text-terminal-orange" />
          <div className="space-y-2">
            {result.security.map((item, i) => (
              <IssueBadge key={i} color="orange">
                <div className="mb-1">{item.issue}</div>
                <div className="text-xs opacity-80">{item.suggestion}</div>
              </IssueBadge>
            ))}
          </div>
        </section>
      )}

      {result.bestPractices.length > 0 && (
        <section>
          <SectionHeader icon="✓" title="Best Practices" count={result.bestPractices.length} color="text-terminal-blue" />
          <div className="space-y-2">
            {result.bestPractices.map((item, i) => (
              <IssueBadge key={i} color="blue">
                <div className="mb-1">{item.issue}</div>
                <div className="text-xs opacity-80">{item.suggestion}</div>
              </IssueBadge>
            ))}
          </div>
        </section>
      )}

      {result.improvedCode && (
        <section>
          <SectionHeader icon="→" title="Improved Code" count={1} color="text-terminal-green" />
          <div className="h-64 overflow-hidden rounded border border-terminal-border">
            <CodeEditor
              code={result.improvedCode}
              language={result.language as Language}
              onChange={() => {}}
              readOnly
            />
          </div>
        </section>
      )}
    </div>
  );
}
