import { useState } from 'react';
import { api } from '../api/client';
import type { User } from '../types';

interface AuthModalProps {
  onAuth: (user: User) => void;
}

export default function AuthModal({ onAuth }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = isLogin
        ? await api.login(email, password)
        : await api.register(username, email, password);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      onAuth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-terminal-border bg-terminal-surface p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mb-2 font-mono text-2xl font-bold text-terminal-green">
            {'>'} AI Code Reviewer
          </div>
          <p className="text-sm text-terminal-muted">
            {isLogin ? 'Sign in to review your code' : 'Create an account to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-1 block text-xs text-terminal-muted">username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-white outline-none focus:border-terminal-green"
                placeholder="dev_user"
                required
                minLength={3}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs text-terminal-muted">email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-white outline-none focus:border-terminal-green"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-terminal-muted">password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 font-mono text-sm text-white outline-none focus:border-terminal-green"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="rounded border border-terminal-red/30 bg-terminal-red/10 px-3 py-2 text-sm text-terminal-red">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-terminal-green px-4 py-2.5 font-mono text-sm font-semibold text-black transition hover:bg-terminal-green/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-terminal-muted">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-terminal-green hover:underline"
          >
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
