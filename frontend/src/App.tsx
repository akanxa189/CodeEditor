import { useState, useEffect, useCallback } from 'react';
import { api } from './api/client';
import type { User, Language, ReviewResult, HistoryItem } from './types';
import AuthModal from './components/AuthModal';
import Header from './components/Header';
import HistorySidebar from './components/HistorySidebar';
import LanguageSelect from './components/LanguageSelect';
import CodeEditor, { defaultSnippets } from './components/CodeEditor';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [code, setCode] = useState(defaultSnippets.JavaScript);
  const [language, setLanguage] = useState<Language>('JavaScript');
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch {
      // silently fail on history load
    } finally {
      setHistoryLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    if (!activeHistoryId) {
      setCode(defaultSnippets[lang]);
    }
    setResult(null);
    setError(null);
  };

  const handleReview = async () => {
    if (!code.trim()) return;
    setReviewLoading(true);
    setError(null);
    setResult(null);
    setActiveHistoryId(null);

    try {
      const review = await api.reviewCode(code, language);
      setResult(review);
      setActiveHistoryId(review._id);
      await fetchHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Review failed');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleHistorySelect = async (id: string) => {
    setActiveHistoryId(id);
    setReviewLoading(true);
    setError(null);

    try {
      const review = await api.getReviewById(id);
      setCode(review.code);
      setLanguage(review.language as Language);
      setResult(review);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setHistory([]);
    setResult(null);
    setActiveHistoryId(null);
  };

  if (!user) {
    return <AuthModal onAuth={setUser} />;
  }

  return (
    <div className="flex h-screen flex-col bg-terminal-bg">
      <Header user={user} onLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
        <HistorySidebar
          history={history}
          activeId={activeHistoryId}
          onSelect={handleHistorySelect}
          loading={historyLoading}
        />

        <main className="flex flex-1 flex-col overflow-hidden p-4 lg:flex-row lg:gap-4">
          <div className="mb-4 flex flex-1 flex-col overflow-hidden lg:mb-0">
            <div className="mb-3 flex items-center justify-between">
              <LanguageSelect value={language} onChange={handleLanguageChange} />
              <button
                type="button"
                onClick={handleReview}
                disabled={reviewLoading || !code.trim()}
                className="flex items-center gap-2 rounded bg-terminal-green px-5 py-2 font-mono text-sm font-semibold text-black transition hover:bg-terminal-green/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin-slow rounded-full border-2 border-black/30 border-t-black" />
                    Reviewing...
                  </>
                ) : (
                  <>
                    <span>{'>'}</span> Review Code
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-hidden" style={{ minHeight: '300px' }}>
              <CodeEditor code={code} language={language} onChange={setCode} />
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden" style={{ minHeight: '300px' }}>
            <div className="mb-3 font-mono text-sm text-terminal-muted">
              {'//'} review_results
            </div>
            <div className="flex-1 overflow-hidden">
              <ResultsPanel result={result} loading={reviewLoading} error={error} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
