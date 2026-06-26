import type { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-terminal-green';
  if (score >= 60) return 'text-terminal-yellow';
  if (score >= 40) return 'text-terminal-orange';
  return 'text-terminal-red';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistorySidebar({ history, activeId, onSelect, loading }: HistorySidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r border-terminal-border bg-terminal-surface">
      <div className="border-b border-terminal-border px-4 py-3">
        <h2 className="font-mono text-sm font-semibold text-terminal-green">
          {'//'} review_history
        </h2>
        <p className="text-xs text-terminal-muted">{history.length} reviews</p>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin-slow rounded-full border-2 border-terminal-border border-t-terminal-green" />
          </div>
        ) : history.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-terminal-muted">No reviews yet</p>
        ) : (
          <ul className="space-y-1">
            {history.map((item) => (
              <li key={item._id}>
                <button
                  type="button"
                  onClick={() => onSelect(item._id)}
                  className={`w-full rounded px-3 py-2.5 text-left transition ${
                    activeId === item._id
                      ? 'border border-terminal-green/30 bg-terminal-green/10'
                      : 'border border-transparent hover:bg-terminal-bg'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-xs text-terminal-blue">{item.language}</span>
                    <span className={`font-mono text-sm font-bold ${getScoreColor(item.score)}`}>
                      {item.score}
                    </span>
                  </div>
                  <div className="text-xs text-terminal-muted">{formatDate(item.createdAt)}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
