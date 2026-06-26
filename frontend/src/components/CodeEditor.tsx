import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import type { Language } from '../types';

interface CodeEditorProps {
  code: string;
  language: Language;
  onChange: (code: string) => void;
  readOnly?: boolean;
}

const languageMap: Record<Language, string> = {
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  Python: 'python',
  React: 'jsx',
  'Node.js': 'javascript',
};

const defaultSnippets: Record<Language, string> = {
  JavaScript: `function fetchUserData(userId) {
  const response = fetch('/api/users/' + userId);
  return response.json();
}`,
  TypeScript: `interface User {
  id: string;
  name: string;
}

async function getUser(id: string): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}`,
  Python: `def calculate_average(numbers):
    total = 0
    for n in numbers:
        total = total + n
    return total / len(numbers)`,
  React: `function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
  'Node.js': `const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  const users = db.query('SELECT * FROM users');
  res.json(users);
});`,
};

export { defaultSnippets };

export default function CodeEditor({ code, language, onChange, readOnly = false }: CodeEditorProps) {
  const prismLang = languageMap[language];

  return (
    <div className="code-editor h-full overflow-auto rounded border border-terminal-border bg-terminal-bg">
      <Editor
        value={code}
        onValueChange={onChange}
        highlight={(c) => highlight(c, languages[prismLang], prismLang)}
        padding={16}
        disabled={readOnly}
        style={{
          fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
          fontSize: 14,
          lineHeight: 1.6,
          minHeight: '100%',
          backgroundColor: '#0a0a0a',
          color: '#e5e5e5',
        }}
        textareaClassName="focus:outline-none"
      />
    </div>
  );
}
