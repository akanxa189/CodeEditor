import type { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-terminal-border bg-terminal-surface px-6 py-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-lg font-bold text-terminal-green">
          {'>'} AI Code Reviewer
        </span>
        <span className="hidden text-xs text-terminal-muted sm:inline">v1.0.0</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-mono text-sm text-terminal-muted">
          <span className="text-terminal-green">$</span> {user.username}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded border border-terminal-border px-3 py-1 font-mono text-xs text-terminal-muted transition hover:border-terminal-red hover:text-terminal-red"
        >
          logout
        </button>
      </div>
    </header>
  );
}
