import type { Language } from '../types';

interface LanguageSelectProps {
  value: Language;
  onChange: (lang: Language) => void;
}

const languages: Language[] = ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js'];

export default function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-terminal-muted">lang:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        className="rounded border border-terminal-border bg-terminal-surface px-3 py-1.5 font-mono text-sm text-white outline-none focus:border-terminal-green"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang} className="bg-terminal-surface">
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
