export type Language = 'JavaScript' | 'TypeScript' | 'Python' | 'React' | 'Node.js';

export interface BugIssue {
  line: number;
  issue: string;
  fix: string;
}

export interface SuggestionIssue {
  issue: string;
  suggestion: string;
}

export interface ReviewResult {
  _id: string;
  score: number;
  bugs: BugIssue[];
  performance: SuggestionIssue[];
  security: SuggestionIssue[];
  bestPractices: SuggestionIssue[];
  improvedCode: string;
  language: string;
  createdAt: string;
}

export interface HistoryItem {
  _id: string;
  language: string;
  score: number;
  createdAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}
